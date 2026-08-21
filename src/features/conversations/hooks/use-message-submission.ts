"use client";

import { useCallback, useState } from "react";
import ky from "ky";

import { useMessages } from "./use-conversations";
import { Id } from "@convex/_generated/dataModel";

interface UseMessageSubmissionOptions {
    projectId: Id<"projects">;
    activeConversationId: Id<"conversations"> | null;
    onCreateConversation: () => Promise<Id<"conversations"> | null>;
}

/**
 * Handles AI message submission: sending messages, cancelling requests,
 * and tracking processing state. Extracted from ConversationSidebar.
 */
export function useMessageSubmission({
    projectId,
    activeConversationId,
    onCreateConversation,
}: UseMessageSubmissionOptions) {
    const [isProcessing, setIsProcessing] = useState(false);
    const conversationMessages = useMessages(activeConversationId);

    // Check if any message is currently processing
    const currentlyProcessing = conversationMessages?.some((msg) => msg.status === "processing");

    const handleCancel = useCallback(async () => {
        try {
            await ky.post("/api/messages/cancel", {
                json: { projectId },
            });
        } catch {
            // Error handled by caller via toast
        }
    }, [projectId]);

    const handleSubmit = useCallback(
        async (messageText: string) => {
            let conversationId = activeConversationId;
            if (!conversationId) {
                conversationId = await onCreateConversation();
                if (!conversationId) return;
            }

            setIsProcessing(true);
            try {
                await ky.post("/api/messages", {
                    json: {
                        conversationId,
                        message: messageText,
                    },
                });
            } catch {
                // Error handled by caller via toast
            } finally {
                setIsProcessing(false);
            }
        },
        [activeConversationId, onCreateConversation],
    );

    return {
        isProcessing: currentlyProcessing ?? isProcessing,
        conversationMessages,
        handleSubmit,
        handleCancel,
    };
}
