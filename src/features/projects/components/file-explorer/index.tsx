import {
    ChevronRightIcon,
    CopyMinusIcon,
    FilePlusCornerIcon,
    FolderPlusIcon,
} from "lucide-react";
import { useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Id } from "@convex/_generated/dataModel";
import { useProject } from "../../hooks/use-projects";
import {
    useCreateFile,
    useCreateFolder,
    useFolderContents,
} from "../../hooks/use-files";
import { CreateInput } from "./create-input";
import { LoadingRow } from "./loading-row";
import { Tree } from "./tree";

export const FileExplorer = ({ projectId }: { projectId: Id<"projects"> }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [collapseKey, setCollapseKey] = useState(0);
    const [creating, setCreating] = useState<"file" | "folder" | null>(null);

    const project = useProject(projectId);
    const rootFiles = useFolderContents({
        projectId,
        enabled: isOpen,
    });

    const createFile = useCreateFile();
    const createFolder = useCreateFolder();

    const handleCreate = (name: string) => {
        setCreating(null);

        if (creating === "file") {
            createFile({
                projectId,
                name,
                content: "",
                parentId: undefined,
            });
        } else {
            createFolder({
                projectId,
                name,
                parentId: undefined,
            });
        }
    };

    return (
        <div className="h-full bg-sidebar">
            <ScrollArea>
                <div className="group/project w-full flex items-center h-5.5 bg-accent font-bold">
                    <button
                        type="button"
                        onClick={() => setIsOpen((value) => !value)}
                        className="flex flex-1 min-w-0 items-center gap-0.5 h-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
                        aria-expanded={isOpen}
                    >
                        <ChevronRightIcon
                            className={cn(
                                "size-4 shrink-0 text-muted-foreground",
                                isOpen && "rotate-90"
                            )}
                        />
                        <p className="text-xs uppercase line-clamp-1">
                            {project?.name ?? "Loading…"}
                        </p>
                    </button>
                    <div className="flex items-center pr-1 opacity-0 group-hover/project:opacity-100 focus-within:opacity-100">
                        <Button
                            variant="highlight"
                            size="icon-xs"
                            aria-label="New file"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsOpen(true);
                                setCreating("file");
                            }}
                        >
                            <FilePlusCornerIcon className="size-3.5" />
                        </Button>
                        <Button
                            variant="highlight"
                            size="icon-xs"
                            aria-label="New folder"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsOpen(true);
                                setCreating("folder");
                            }}
                        >
                            <FolderPlusIcon className="size-3.5" />
                        </Button>
                        <Button
                            variant="highlight"
                            size="icon-xs"
                            aria-label="Collapse all"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setCollapseKey((prev) => prev + 1);
                                setIsOpen(false);
                            }}
                        >
                            <CopyMinusIcon className="size-3.5" />
                        </Button>
                    </div>
                </div>
                {isOpen && (
                    <>
                        {rootFiles === undefined && <LoadingRow level={0} />}
                        {creating && (
                            <CreateInput
                                type={creating}
                                level={0}
                                onSubmit={handleCreate}
                                onCancel={() => setCreating(null)}
                            />
                        )}
                        {rootFiles?.map((item) => (
                            <Tree
                                key={`${item._id}-${collapseKey}`}
                                item={item}
                                level={0}
                                projectId={projectId}
                            />
                        ))}
                    </>
                )}
            </ScrollArea>
        </div>
    );
};
