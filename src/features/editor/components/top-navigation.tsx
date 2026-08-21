import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFile } from "@/features/projects/hooks/use-files";

import { useEditor } from "../hooks/use-editor";
import { Id } from "@convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { FileIcon } from "@react-symbols/icons/utils";
import { XIcon } from "lucide-react";

const Tab = ({
    fileId,
    isFirst,
    projectId,
}: {
    fileId: Id<"files">;
    isFirst: boolean;
    projectId: Id<"projects">;
}) => {
    const file = useFile(fileId);
    const { activeTabId, previewTabId, setActiveTab, openFile, closeTab } = useEditor(projectId);

    const isActive = activeTabId === fileId;
    const isPreview = previewTabId === fileId;
    const fileName = file?.name ?? "Loading…";

    return (
        <div
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => setActiveTab(fileId)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTab(fileId);
                }
            }}
            onDoubleClick={() => openFile(fileId, { pinned: true })}
            className={cn(
                "text-muted-foreground group hover:bg-accent/30 focus-visible:ring-ring flex h-8.75 cursor-pointer items-center gap-2 border-x border-y border-transparent pr-1.5 pl-2 focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-inset",
                isActive && "bg-background text-foreground border-x-border",
                isFirst && "border-l-transparent",
            )}
        >
            {file === undefined ? (
                <Spinner className="text-ring" />
            ) : (
                <FileIcon fileName={fileName} autoAssign className="size-4" />
            )}
            <span className={cn("text-sm whitespace-nowrap", isPreview && "italic")}>
                {fileName}
            </span>
            <button
                aria-label={`Close ${fileName} tab`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeTab(fileId);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        closeTab(fileId);
                    }
                }}
                className={cn(
                    "rounded-sm p-0.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 focus-visible:opacity-100",
                    isActive && "opacity-100",
                )}
            >
                <XIcon className="size-3.5" />
            </button>
        </div>
    );
};

export const TopNavigation = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { openTabs } = useEditor(projectId);

    return (
        <ScrollArea className="flex-1">
            <nav role="tablist" className="bg-sidebar flex h-8.75 items-center border-b">
                {openTabs.map((fileId, index) => (
                    <Tab key={fileId} fileId={fileId} isFirst={index === 0} projectId={projectId} />
                ))}
            </nav>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};
