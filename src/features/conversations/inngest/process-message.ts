import { NonRetriableError } from "inngest";

import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { CODING_AGENT_SYSTEM_PROMPT } from "./constant";
import { Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import {
    buildSystemPrompt,
    createTitleAgent,
    extractTitle,
    createCodingAgent,
    createAgentNetwork,
    extractAssistantResponse,
    shouldGenerateTitle,
} from "./helpers";

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
                throw new NonRetriableError("POLARIS_CONVEX_INTERNAL_KEY not configured");
            }

            await step.run("update-message-on-failure", async () => {
                await convex.mutation(api.system.updateMessageContent, {
                    internalKey,
                    messageId,
                    content:
                        "My apologies, I encountered an error while processing your request. Let me know if you need anything else.",
                });
            });
        },
    },
    { event: "message/sent" },
    async ({ event, step }) => {
        const { messageId, conversationId, projectId, message } = event.data as MessageEvent;

        const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
        if (!internalKey) {
            throw new NonRetriableError("POLARIS_CONVEX_INTERNAL_KEY not configured");
        }

        await step.sleep("wait-for-db-sync", "1s");

        const conversation = await step.run("get-conversation", async () => {
            return await convex.query(api.system.getConversationById, {
                internalKey,
                conversationId,
            });
        });

        if (!conversation) {
            throw new NonRetriableError("Conversation not found");
        }

        const recentMessages = await step.run("get-recent-messages", async () => {
            return await convex.query(api.system.getRecentMessages, {
                internalKey,
                conversationId,
                limit: 10,
            });
        });

        const systemPrompt = buildSystemPrompt(
            CODING_AGENT_SYSTEM_PROMPT,
            recentMessages,
            messageId,
        );

        if (shouldGenerateTitle(conversation.title)) {
            const groqApiKey = process.env.GROQ_API_KEY;
            if (!groqApiKey) {
                throw new NonRetriableError("GROQ_API_KEY not configured");
            }

            const titleAgent = createTitleAgent(groqApiKey);
            const { output } = await titleAgent.run(message, { step });
            const title = extractTitle(output);

            if (title) {
                await step.run("update-conversation-title", async () => {
                    await convex.mutation(api.system.updateConversationTitle, {
                        internalKey,
                        conversationId,
                        title,
                    });
                });
            }
        }

        const nvidiaApiKey = process.env.NVIDIA_API_KEY;
        if (!nvidiaApiKey) {
            throw new NonRetriableError("NVIDIA_API_KEY not configured");
        }

        const codingAgent = createCodingAgent(systemPrompt, nvidiaApiKey, projectId, internalKey);

        const network = createAgentNetwork(codingAgent);
        const result = await network.run(message);

        const assistantResponse = extractAssistantResponse(result.state.results);

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
