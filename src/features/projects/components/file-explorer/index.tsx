import { ChevronRightIcon, CopyMinusIcon, FilePlusCornerIcon, FolderPlusIcon } from "lucide-react";
import { useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Id } from "@convex/_generated/dataModel";
import { useProject } from "../../hooks/use-projects";
import { useCreateFile, useCreateFolder, useFolderContents } from "../../hooks/use-files";
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
        <div className="bg-sidebar h-full">
            <ScrollArea>
                <div className="group/project bg-accent flex h-5.5 w-full items-center font-bold">
                    <button
                        type="button"
                        onClick={() => setIsOpen((value) => !value)}
                        className="focus-visible:ring-ring flex h-full min-w-0 flex-1 cursor-pointer items-center gap-0.5 text-left focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-inset"
                        aria-expanded={isOpen}
                    >
                        <ChevronRightIcon
                            className={cn(
                                "text-muted-foreground size-4 shrink-0",
                                isOpen && "rotate-90",
                            )}
                        />
                        <p className="line-clamp-1 text-xs uppercase">
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
