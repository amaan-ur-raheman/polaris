import { NonRetriableError } from "inngest";

import { createAgent, gemini, openai } from "@inngest/agent-kit";
import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";

import {
    CODING_AGENT_SYSTEM_PROMPT,
    TITLE_GENERATOR_SYSTEM_PROMPT,
} from "./constant";
import { DEFAULT_CONVERSATION_TITLE } from "../constants";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

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

        if (shouldGenerateTitle) {
            const titleAgent = createAgent({
                name: "title-generator",
                system: TITLE_GENERATOR_SYSTEM_PROMPT,
                model: openai({
                    model: "llama-3.1-8b-instant",
                    apiKey: process.env.GROQ_API_KEY,
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

        await step.run("update-assistant-message", async () => {
            await convex.mutation(api.system.updateMessageContent, {
                internalKey,
                messageId,
                content: "AI processed this message",
            });
        });
    },
);
