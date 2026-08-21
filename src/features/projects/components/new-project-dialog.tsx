"use client";

import { useEffect, useState } from "react";
import ky from "ky";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    PromptInput,
    PromptInputBody,
    PromptInputFooter,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
    type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

import { Id } from "@convex/_generated/dataModel";
import { TemplateSelector } from "./template-selector";
import { getTemplateById } from "../templates";

interface NewProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NewProjectDialog = ({
    open,
    onOpenChange,
}: NewProjectDialogProps) => {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (message: PromptInputMessage) => {
        if (!message.text) return;

        setIsSubmitting(true);

        try {
            const template = selectedTemplateId
                ? getTemplateById(selectedTemplateId)
                : undefined;

            const { projectId } = await ky
                .post("/api/projects/create-with-prompt", {
                    json: {
                        prompt: message.text.trim(),
                        templateId: template?.id,
                    },
                })
                .json<{ projectId: Id<"projects"> }>();

            toast.success("Project created successfully");
            onOpenChange(false);
            setInput("");
            router.push(`/projects/${projectId}`);
        } catch {
            toast.error("Unable to create project");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="sm:max-w-lg p-0">
                <DialogHeader className="hidden">
                    <DialogTitle>What do you want to build?</DialogTitle>
                    <DialogDescription>
                        Describe your project and AI will help you create it.
                    </DialogDescription>
                </DialogHeader>
                <div className="px-4 pt-4">
                    <TemplateSelector
                        selectedTemplateId={selectedTemplateId}
                        onSelect={setSelectedTemplateId}
                    />
                </div>
                <PromptInput onSubmit={handleSubmit} className="border-none!">
                    <PromptInputBody>
                        <PromptInputTextarea
                            placeholder="Ask Polaris to build…"
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            disabled={isSubmitting}
                        />
                    </PromptInputBody>
                    <PromptInputFooter>
                        <PromptInputTools />
                        <PromptInputSubmit
                            disabled={!input.trim() || isSubmitting}
                        />
                    </PromptInputFooter>
                </PromptInput>
            </DialogContent>
        </Dialog>
    );
};
