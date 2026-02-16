import { NonRetriableError } from "inngest";

import { createAgent, createNetwork, gemini, openai } from "@inngest/agent-kit";
import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";

import {
    CODING_AGENT_SYSTEM_PROMPT,
    TITLE_GENERATOR_SYSTEM_PROMPT,
} from "./constant";
import { DEFAULT_CONVERSATION_TITLE } from "../constants";
import { createReadFilesTool } from "./tools/read-file";
import { createListFilesTool } from "./tools/list-files";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { createUpdateFileTool } from "./tools/update-file";
import { createCreateFilesTool } from "./tools/create-files";
import { createCreateFolderTool } from "./tools/create-folder";
import { createDeleteFilesTool } from "./tools/delete-files";
import { createScrapeUrlsTool } from "./tools/scrape-urls";
import { createRenameFileTool } from "./tools/rename-file";

interface MessageEvent {
    messageId: Id<"messages">;
    conversationId: Id<"conversations">;
    projectId: Id<"projects">;
    message: string;
}

export const processMessage = inngest.createFunction(
    {
        id: "process-message",
        cancelOn: [
            {
                event: "message/cancel",
                if: "event.data.messageId == async.data.messageId",
            },
        ],
        onFailure: async ({ event, step }) => {
            const { messageId } = event.data.event.data as MessageEvent;

            const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
            if (!internalKey) {
                throw new NonRetriableError(
                    "POLARIS_CONVEX_INTERNAL_KEY not configured",
                );
            }

            // Update the message with error content
            if (internalKey) {
                await step.run("update-message-on-failure", async () => {
                    await convex.mutation(api.system.updateMessageContent, {
                        internalKey,
                        messageId,
                        content:
                            "My apologies, I encountered an error while processing your request. Let me know if you need anything else.",
                    });
                });
            }
        },
    },
    { event: "message/sent" },
    async ({ event, step }) => {
        const { messageId, conversationId, projectId, message } =
            event.data as MessageEvent;

        const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
        if (!internalKey) {
            throw new NonRetriableError(
                "POLARIS_CONVEX_INTERNAL_KEY not configured",
            );
        }

        // TODO: Check if this is needed
        await step.sleep("wait-for-db-sync", "1s");

        // Get conversation for the title generation
        const conversation = await step.run("get-conversation", async () => {
            return await convex.query(api.system.getConversationById, {
                internalKey,
                conversationId,
            });
        });

        if (!conversation) {
            throw new NonRetriableError("Conversation not found");
        }

        // Fetch recent messages for the title generation
        const recentMessages = await step.run(
            "get-recent-messages",
            async () => {
                return await convex.query(api.system.getRecentMessages, {
                    internalKey,
                    conversationId,
                    limit: 10,
                });
            },
        );

        // Build the system prompt with conversation history (exclude the current processing message)
        let systemPrompt = CODING_AGENT_SYSTEM_PROMPT;

        // Filter out the current processing message and empty messages
        const contextMessages = recentMessages.filter(
            (msg) => msg._id !== messageId && msg.content.trim() !== "",
        );

        if (contextMessages.length > 0) {
            const historyText = contextMessages
                .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                .join("\n\n");

            systemPrompt += `\n\n## Previous Conversation (for context only - do NOT repeat these responses):\n${historyText}\n\n## Current Request:\nRespond ONLY to the user's new message below. Do not repeat or reference your previous responses.`;
        }

        const shouldGenerateTitle =
            conversation.title === DEFAULT_CONVERSATION_TITLE;

        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            throw new NonRetriableError("GROQ_API_KEY not configured");
        }

        if (shouldGenerateTitle) {
            const titleAgent = createAgent({
                name: "title-generator",
                system: TITLE_GENERATOR_SYSTEM_PROMPT,
                model: openai({
                    model: "llama-3.1-8b-instant",
                    apiKey: groqApiKey,
                    baseUrl: "https://api.groq.com/openai/v1",
                }),
            });

            const { output } = await titleAgent.run(message, { step });

            const textMessage = output.find(
                (m) => m.type === "text" && m.role === "assistant",
            );

            if (textMessage?.type === "text") {
                const title =
                    typeof textMessage.content === "string"
                        ? textMessage.content.trim()
                        : textMessage.content
                              .map((c) => c.text)
                              .join("")
                              .trim();

                if (title) {
                    await step.run("update-conversation-title", async () => {
                        await convex.mutation(
                            api.system.updateConversationTitle,
                            {
                                internalKey,
                                conversationId,
                                title,
                            },
                        );
                    });
                }
            }
        }

        const nvidiaApiKey = process.env.NVIDIA_API_KEY;
        if (!nvidiaApiKey) {
            throw new NonRetriableError("NVIDIA_API_KEY not configured");
        }

        // Create the coding agent with fallback
        const codingAgent = createAgent({
            name: "polaris",
            description: "An expert AI coding assistant",
            system: systemPrompt,
            model: openai({
                model: "stepfun-ai/step-3.5-flash",
                apiKey: nvidiaApiKey,
                baseUrl: "https://integrate.api.nvidia.com/v1",
            }),
            tools: [
                createListFilesTool({ projectId, internalKey }),
                createReadFilesTool({ internalKey }),
                createUpdateFileTool({ internalKey }),
                createCreateFilesTool({ projectId, internalKey }),
                createCreateFolderTool({ projectId, internalKey }),
                createRenameFileTool({ internalKey }),
                createDeleteFilesTool({ internalKey }),
                createScrapeUrlsTool(),
            ],
        });

        // Create a network for single agent
        const network = createNetwork({
            name: "polaris-network",
            agents: [codingAgent],
            maxIter: 75,
            router: ({ network }) => {
                const lastResult = network.state.results.at(-1);

                const hasTextResponse = lastResult?.output.some(
                    (m) => m.type === "text" && m.role === "assistant",
                );

                const hasToolCall = lastResult?.output.some(
                    (m) => m.type === "tool_call",
                );

                // Only stop if there's text without tool call
                if (hasTextResponse && !hasToolCall) {
                    return undefined;
                }

                return codingAgent;
            },
        });

        // Run the agent
        const result = await network.run(message);

        // Extracts the assistant's final text response from last agent result
        const lastResult = result.state.results.at(-1);
        const textMessage = lastResult?.output.find(
            (m) => m.type === "text" && m.role === "assistant",
        );

        let assistantResponse =
            "I processed your request. Let me know if you need anything else!";

        if (textMessage?.type === "text") {
            const rawContent =
                typeof textMessage.content === "string"
                    ? textMessage.content
                    : textMessage.content.map((c) => c.text).join("");

            // Remove <think> tags from MiniMax reasoning
            assistantResponse = rawContent
                .replace(/<think>[\s\S]*?<\/think>\s*/g, "")
                .trim();
        }

        // Update the assistant message with the response
        await step.run("update-assistant-message", async () => {
            await convex.mutation(api.system.updateMessageContent, {
                internalKey,
                messageId,
                content: assistantResponse,
            });
        });

        return { success: true, messageId, conversationId };
    },
);
