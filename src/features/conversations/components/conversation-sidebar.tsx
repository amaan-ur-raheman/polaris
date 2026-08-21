"use client";

import { useState } from "react";
import { HistoryIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import {
    PromptInput,
    PromptInputBody,
    PromptInputFooter,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
    type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";

import { Id } from "@convex/_generated/dataModel";
import { useConversationManager } from "../hooks/use-conversation-manager";
import { useMessageSubmission } from "../hooks/use-message-submission";
import { MessageList } from "./message-list";
import { PastConversationsDialog } from "./past-conversations-dialog";

interface ConversationSidebarProps {
    projectId: Id<"projects">;
}

export const ConversationSidebar = ({ projectId }: ConversationSidebarProps) => {
    const [input, setInput] = useState("");
    const [pastConversationsOpen, setPastConversationsOpen] = useState(false);

    const {
        activeConversation,
        activeConversationId,
        setSelectedConversationId,
        handleCreateConversation,
    } = useConversationManager({ projectId });

    const { isProcessing, conversationMessages, handleSubmit, handleCancel } = useMessageSubmission(
        {
            projectId,
            activeConversationId,
            onCreateConversation: handleCreateConversation,
        },
    );

    const onSubmit = async (message: PromptInputMessage) => {
        if (isProcessing && !message.text) {
            await handleCancel();
            setInput("");
            return;
        }

        if (!message.text) return;

        await handleSubmit(message.text);
        setInput("");
        toast.success("Message sent");
    };

    return (
        <>
            <PastConversationsDialog
                projectId={projectId}
                open={pastConversationsOpen}
                onOpenChange={setPastConversationsOpen}
                onSelect={setSelectedConversationId}
            />
            <div className="bg-sidebar flex h-full flex-col">
                <div className="flex h-8.75 items-center justify-between border-b">
                    <div className="truncate pl-3 text-sm">
                        {activeConversation?.title ?? "New Conversation"}
                    </div>
                    <div className="flex items-center gap-1 px-1">
                        <Button
                            size="icon-xs"
                            variant="highlight"
                            onClick={() => setPastConversationsOpen(true)}
                            aria-label="View conversation history"
                        >
                            <HistoryIcon className="size-3.5" />
                        </Button>
                        <Button
                            size="icon-xs"
                            variant="highlight"
                            onClick={handleCreateConversation}
                            aria-label="New conversation"
                        >
                            <PlusIcon className="size-3.5" />
                        </Button>
                    </div>
                </div>
                <MessageList messages={conversationMessages} />
                <div className="p-3">
                    <PromptInput onSubmit={onSubmit} className="mt-2">
                        <PromptInputBody>
                            <PromptInputTextarea
                                placeholder="Ask Polaris anything…"
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                                disabled={isProcessing}
                            />
                        </PromptInputBody>
                        <PromptInputFooter>
                            <PromptInputTools />
                            <PromptInputSubmit
                                disabled={isProcessing ? false : !input}
                                status={isProcessing ? "streaming" : undefined}
                            />
                        </PromptInputFooter>
                    </PromptInput>
                </div>
            </div>
        </>
    );
};
