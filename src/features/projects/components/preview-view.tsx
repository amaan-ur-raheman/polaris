"use client";

import { useState } from "react";
import { Allotment } from "allotment";
import { Loader2Icon, TerminalSquareIcon, AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

import { useWebContainer } from "@/features/preview/hooks/use-webcontainer";
import { PreviewSettingsPopover } from "@/features/preview/components/preview-settings-popover";
import { PreviewTerminal } from "@/features/preview/components/preview-terminal";
import { Button } from "@/components/ui/button";

import { useProject } from "../hooks/use-projects";
import { Id } from "@convex/_generated/dataModel";

interface PreviewViewProps {
    projectId: Id<"projects">;
}

export const PreviewView = ({ projectId }: PreviewViewProps) => {
    const project = useProject(projectId);
    const [showTerminal, setShowTerminal] = useState(true);

    const { status, previewUrl, error, restart, terminalOutput } = useWebContainer({
        projectId,
        enabled: true,
        settings: project?.settings,
    });

    const isLoading = status === "booting" || status === "installing";

    return (
        <div className="bg-background flex h-full flex-col">
            <div className="bg-sidebar flex h-8.75 shrink-0 items-center border-b">
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="h-full rounded-none"
                    disabled={isLoading}
                    onClick={restart}
                    aria-label="Restart container"
                    title="Restart container"
                >
                    <RefreshCwIcon className="size-3" />
                </Button>

                <div className="bg-background text-muted-foreground flex h-full flex-1 items-center truncate border-x px-3 font-mono text-xs">
                    {isLoading && (
                        <div className="flex items-center gap-1.5">
                            <Loader2Icon className="size-3 animate-spin" />
                            {status === "booting" ? "Starting…" : "Installing…"}
                        </div>
                    )}
                    {previewUrl && <span className="truncate">{previewUrl}</span>}
                    {!isLoading && !previewUrl && !error && <span>Ready to preview</span>}
                </div>

                <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="h-full rounded-none"
                    aria-label="Toggle terminal"
                    title="Toggle terminal"
                    onClick={() => setShowTerminal((prev) => !prev)}
                >
                    <TerminalSquareIcon className="size-3" />
                </Button>

                <PreviewSettingsPopover
                    projectId={projectId}
                    initialValues={project?.settings}
                    onSave={restart}
                />
            </div>

            <div className="min-h-0 flex-1">
                <Allotment vertical>
                    <Allotment.Pane>
                        {error && (
                            <div className="text-muted-foreground flex size-full items-center justify-center">
                                <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
                                    <AlertTriangleIcon className="size-6" />
                                    <p className="text-sm font-medium">{error}</p>
                                    <Button size={"sm"} variant={"outline"} onClick={restart}>
                                        <RefreshCwIcon className="size-4" />
                                        Restart
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isLoading && !error && (
                            <div className="text-muted-foreground flex size-full items-center justify-center">
                                <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
                                    <Loader2Icon className="size-6 animate-spin" />
                                    <p className="text-sm font-medium">
                                        {status === "booting" ? "Starting…" : "Installing…"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {previewUrl && (
                            <iframe
                                src={previewUrl}
                                className="size-full border-0"
                                title="Preview"
                            />
                        )}
                    </Allotment.Pane>

                    {showTerminal && (
                        <Allotment.Pane minSize={100} maxSize={500} preferredSize={200}>
                            <div className="bg-background flex h-full flex-col border-t">
                                <div className="text-muted-foreground border-border/50 flex h-7 shrink-0 items-center gap-1.5 border-b px-3 text-xs">
                                    <TerminalSquareIcon className="size-3" />
                                    Terminal
                                </div>
                                <PreviewTerminal output={terminalOutput} />
                            </div>
                        </Allotment.Pane>
                    )}
                </Allotment>
            </div>
        </div>
    );
};
