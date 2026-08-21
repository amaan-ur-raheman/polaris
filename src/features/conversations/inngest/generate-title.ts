import { NonRetriableError } from "inngest";

import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { createTitleAgent, extractTitle, shouldGenerateTitle } from "./helpers";

interface TitleGenerateEvent {
    conversationId: Id<"conversations">;
    message: string;
}

/**
 * Generates a conversation title in the background.
 * Runs independently from the main message processing so it never blocks the coding agent.
 */
export const generateTitle = inngest.createFunction(
    {
        id: "generate-title",
        cancelOn: [
            {
                event: "message/cancel",
                if: "event.data.conversationId == async.data.conversationId",
            },
        ],
    },
    { event: "message/title-generate" },
    async ({ event, step }) => {
        const { conversationId, message } = event.data as TitleGenerateEvent;

        const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
        if (!internalKey) {
            throw new NonRetriableError("POLARIS_CONVEX_INTERNAL_KEY not configured");
        }

        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            throw new NonRetriableError("GROQ_API_KEY not configured");
        }

        // Check if we need to generate a title
        const conversation = await step.run("get-conversation", async () => {
            return await convex.query(api.system.getConversationById, {
                internalKey,
                conversationId,
            });
        });

        if (!conversation) {
            return { skipped: true, reason: "conversation not found" };
        }

        if (!shouldGenerateTitle(conversation.title)) {
            return { skipped: true, reason: "title already exists" };
        }

        // Generate the title
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

        return { success: true, title: title ?? null };
    },
);
