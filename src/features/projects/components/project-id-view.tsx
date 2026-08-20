"use client";

import { useState } from "react";
import { Allotment } from "allotment";

import { cn } from "@/lib/utils";
import { EditorView } from "@/features/editor/components/editor-view";
import { ErrorBoundary } from "@/components/error-boundary";

import { Id } from "@convex/_generated/dataModel";
import { FileExplorer } from "./file-explorer";
import { PreviewView } from "./preview-view";
import { ExportPopover } from "./export-github";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_SIDEBAR_WIDTH = 350;
const DEFAULT_MAIN_SIZE = 1000;

const Tab = ({
    label,
    isActive,
    onClick,
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 h-full cursor-pointer text-muted-foreground border-r hover:bg-accent/30",
                isActive && "bg-background text-foreground",
            )}
        >
            <span className="text-sm">{label}</span>
        </div>
    );
};

export const ProjectIdView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const [activeView, setActiveView] = useState<"editor" | "preview">(
        "editor",
    );

    return (
        <div className="h-full flex flex-col">
            <nav className="h-[35px] flex items-center bg-sidebar border-b">
                <Tab
                    label="Code"
                    isActive={activeView === "editor"}
                    onClick={() => setActiveView("editor")}
                />
                <Tab
                    label="Preview"
                    isActive={activeView === "preview"}
                    onClick={() => setActiveView("preview")}
                />
                <div className="flex-1 flex justify-end h-full">
                    <ExportPopover projectId={projectId} />
                </div>
            </nav>
            <div className="flex-1 relative">
                <div
                    className={cn(
                        "absolute inset-0",
                        activeView === "editor" ? "visible" : "invisible",
                    )}
                >
                    <Allotment
                        defaultSizes={[
                            DEFAULT_SIDEBAR_WIDTH,
                            DEFAULT_MAIN_SIZE,
                        ]}
                    >
                        <Allotment.Pane
                            snap
                            minSize={MIN_SIDEBAR_WIDTH}
                            maxSize={MAX_SIDEBAR_WIDTH}
                            preferredSize={DEFAULT_SIDEBAR_WIDTH}
                        >
                            <ErrorBoundary feature="File Explorer">
                                <FileExplorer projectId={projectId} />
                            </ErrorBoundary>
                        </Allotment.Pane>
                        <Allotment.Pane>
                            <ErrorBoundary feature="Code Editor">
                                <EditorView projectId={projectId} />
                            </ErrorBoundary>
                        </Allotment.Pane>
                    </Allotment>
                </div>
                <div
                    className={cn(
                        "absolute inset-0",
                        activeView === "preview" ? "visible" : "invisible",
                    )}
                >
                    <ErrorBoundary feature="Preview">
                        <PreviewView projectId={projectId} />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};
