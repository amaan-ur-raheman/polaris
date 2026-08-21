"use client";

import { CopyIcon, LoaderIcon } from "lucide-react";

import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
    Message,
    MessageContent,
    MessageResponse,
    MessageActions,
    MessageAction,
} from "@/components/ai-elements/message";

import { Doc, Id } from "@convex/_generated/dataModel";

interface MessageListProps {
    messages: Doc<"messages">[] | undefined;
}

/**
 * Pure component that renders conversation messages.
 * Handles loading, completed, and cancelled states.
 * Extracted from ConversationSidebar for independent testability.
 */
export function MessageList({ messages }: MessageListProps) {
    return (
        <Conversation className="flex-1">
            <ConversationContent>
                {messages?.map((message, messageIndex) => (
                    <Message key={message._id} from={message.role}>
                        <MessageContent>
                            {message.status === "processing" ? (
                                <div className="text-muted-foreground flex items-center gap-2">
                                    <LoaderIcon className="size-4 animate-spin" />
                                    <span>Thinking…</span>
                                </div>
                            ) : message.status === "cancelled" ? (
                                <div className="text-muted-foreground italic">
                                    <span>Request cancelled</span>
                                </div>
                            ) : (
                                <MessageResponse>{message.content}</MessageResponse>
                            )}
                        </MessageContent>
                        {message.role === "assistant" &&
                            message.status === "completed" &&
                            messageIndex === (messages?.length ?? 0) - 1 && (
                                <MessageActions>
                                    <MessageAction
                                        onClick={() => {
                                            navigator.clipboard.writeText(message.content);
                                        }}
                                        label="Copy"
                                    >
                                        <CopyIcon className="size-3" />
                                    </MessageAction>
                                </MessageActions>
                            )}
                    </Message>
                ))}
            </ConversationContent>
            <ConversationScrollButton />
        </Conversation>
    );
}
