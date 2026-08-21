"use client";

import { useState, useCallback } from "react";

import {
    useConversation,
    useConversations,
    useCreateConversation,
} from "../hooks/use-conversations";
import { DEFAULT_CONVERSATION_TITLE } from "../constants";
import { Id } from "@convex/_generated/dataModel";

interface UseConversationManagerOptions {
    projectId: Id<"projects">;
}

/**
 * Manages conversation lifecycle: creation, selection, and listing.
 * Extracted from ConversationSidebar to separate concerns.
 */
export function useConversationManager({ projectId }: UseConversationManagerOptions) {
    const [selectedConversationId, setSelectedConversationId] =
        useState<Id<"conversations"> | null>(null);

    const createConversation = useCreateConversation();
    const conversations = useConversations(projectId);

    const activeConversationId = selectedConversationId ?? conversations?.[0]?._id ?? null;
    const activeConversation = useConversation(activeConversationId);

    const handleCreateConversation = useCallback(async () => {
        try {
            const newConversationId = await createConversation({
                projectId,
                title: DEFAULT_CONVERSATION_TITLE,
            });
            setSelectedConversationId(newConversationId);
            return newConversationId;
        } catch {
            return null;
        }
    }, [createConversation, projectId]);

    return {
        conversations,
        activeConversationId,
        activeConversation,
        setSelectedConversationId,
        handleCreateConversation,
    };
}
