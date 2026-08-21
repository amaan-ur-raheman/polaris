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
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={onClick}
            className={cn(
                "text-muted-foreground hover:bg-accent/30 focus-visible:ring-ring flex h-full cursor-pointer items-center gap-2 border-r px-3 focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-inset",
                isActive && "bg-background text-foreground",
            )}
        >
            <span className="text-sm">{label}</span>
        </button>
    );
};

export const ProjectIdView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const [activeView, setActiveView] = useState<"editor" | "preview">("editor");

    return (
        <div className="flex h-full flex-col">
            <nav role="tablist" className="bg-sidebar flex h-[35px] items-center border-b">
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
                <div className="flex h-full flex-1 justify-end">
                    <ExportPopover projectId={projectId} />
                </div>
            </nav>
            <div className="relative flex-1">
                <div
                    className={cn(
                        "absolute inset-0",
                        activeView === "editor" ? "visible" : "invisible",
                    )}
                >
                    <Allotment defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}>
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
