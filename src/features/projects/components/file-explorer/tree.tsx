import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { cn } from "@/lib/utils";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    useCreateFile,
    useCreateFolder,
    useDeleteFile,
    useFolderContents,
    useRenameFile,
} from "../../hooks/use-files";
import { getItemPadding } from "./constants";
import { LoadingRow } from "./loading-row";
import { CreateInput } from "./create-input";
import { TreeItemWrapper } from "./tree-item-wrapper";
import { RenameInput } from "./rename-input";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useEditor } from "@/features/editor/hooks/use-editor";

export const Tree = ({
    item,
    level = 0,
    projectId,
}: {
    item: Doc<"files">;
    level?: number;
    projectId: Id<"projects">;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [creating, setCreating] = useState<"file" | "folder" | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const renameFile = useRenameFile({
        projectId,
        parentId: item.parentId,
    });
    const deleteFile = useDeleteFile({ projectId, parentId: item.parentId });
    const createFile = useCreateFile();
    const createFolder = useCreateFolder();

    const { openFile, activeTabId, closeTab } = useEditor(projectId);

    const folderContents = useFolderContents({
        projectId,
        parentId: item._id,
        enabled: item.type === "folder" && isOpen,
    });

    const startCreating = (type: "file" | "folder") => {
        setIsOpen(true);
        setCreating(type);
    };

    const handleCreate = (name: string) => {
        setCreating(null);

        if (creating === "file") {
            createFile({
                projectId,
                content: "",
                name,
                parentId: item._id,
            });
        } else if (creating === "folder") {
            createFolder({
                projectId,
                name,
                parentId: item._id,
            });
        }
    };

    const handleRename = (newName: string) => {
        setIsRenaming(false);

        if (newName === item.name) {
            return;
        }

        renameFile({
            id: item._id,
            newName,
        });
    };

    if (item.type === "file") {
        const filename = item.name;
        const isActive = activeTabId === item._id;

        if (isRenaming) {
            return (
                <RenameInput
                    type="file"
                    level={level}
                    defaultValue={filename}
                    onSubmit={handleRename}
                    onCancel={() => setIsRenaming(false)}
                />
            );
        }

        const handleDelete = () => {
            closeTab(item._id);
            deleteFile({ id: item._id });
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Backspace") {
                e.preventDefault();
                setConfirmDelete(true);
            }
        };

        return (
            <>
                <TreeItemWrapper
                    item={item}
                    level={level}
                    isActive={isActive}
                    onClick={() => openFile(item._id, { pinned: false })}
                    onDoubleClick={() => openFile(item._id, { pinned: true })}
                    onRename={() => setIsRenaming(true)}
                    onDelete={() => setConfirmDelete(true)}
                    onKeyDown={handleKeyDown}
                >
                    <FileIcon fileName={filename} autoAssign className="size-4" />
                    <span className="truncate text-sm">{filename}</span>
                </TreeItemWrapper>
                <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete {filename}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This permanently removes the file. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90 text-white"
                                onClick={handleDelete}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        );
    }

    const folderName = item.name;
    const folderRender = (
        <>
            <div className="flex items-center gap-0.5">
                <ChevronRightIcon
                    className={cn("text-muted-foreground size-4 shrink-0", isOpen && "rotate-90")}
                />
                <FolderIcon folderName={folderName} className="size-4" />
                <span className="truncate text-sm">{folderName}</span>
            </div>
        </>
    );

    if (creating) {
        return (
            <>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="group hover:bg-accent/30 flex h-5.5 w-full items-center gap-1"
                    style={{ paddingLeft: getItemPadding(level, false) }}
                >
                    {folderRender}
                </button>
                {isOpen && (
                    <>
                        {folderContents === undefined && <LoadingRow level={level + 1} />}
                        <CreateInput
                            type={creating}
                            level={level + 1}
                            onSubmit={handleCreate}
                            onCancel={() => setCreating(null)}
                        />
                        {folderContents?.map((subItem) => (
                            <Tree
                                key={subItem._id}
                                item={subItem}
                                level={level + 1}
                                projectId={projectId}
                            />
                        ))}
                    </>
                )}
            </>
        );
    }
    if (isRenaming) {
        return (
            <>
                <RenameInput
                    type={item.type}
                    level={level}
                    defaultValue={item.name}
                    onSubmit={handleRename}
                    onCancel={() => setIsRenaming(false)}
                />
                {isOpen && (
                    <>
                        {folderContents === undefined && <LoadingRow level={level + 1} />}
                        {folderContents?.map((subItem) => (
                            <Tree
                                key={subItem._id}
                                item={subItem}
                                level={level + 1}
                                projectId={projectId}
                            />
                        ))}
                    </>
                )}
            </>
        );
    }

    return (
        <>
            <TreeItemWrapper
                item={item}
                level={level}
                isActive={false}
                onClick={() => setIsOpen((prev) => !prev)}
                onDoubleClick={() => {}}
                onRename={() => setIsRenaming(true)}
                onDelete={() => {
                    deleteFile({ id: item._id });
                }}
                onCreateFile={() => {
                    startCreating("file");
                }}
                onCreateFolder={() => {
                    startCreating("folder");
                }}
            >
                {folderRender}
            </TreeItemWrapper>
            {isOpen && (
                <>
                    {folderContents === undefined && <LoadingRow level={level + 1} />}
                    {folderContents?.map((subItem) => (
                        <Tree
                            key={subItem._id}
                            item={subItem}
                            level={level + 1}
                            projectId={projectId}
                        />
                    ))}
                </>
            )}
        </>
    );
};
