"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
    History,
    RotateCcw,
    Trash2,
    Plus,
    Clock,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    useVersions,
    useCreateVersion,
    useRestoreVersion,
    useDeleteVersion,
} from "../hooks/use-versions";
import { Id } from "@convex/_generated/dataModel";

export const VersionHistory = ({
    projectId,
    onClose,
}: {
    projectId: Id<"projects">;
    onClose?: () => void;
}) => {
    const { versions, isLoading } = useVersions(projectId);
    const { create, isCreating } = useCreateVersion();
    const { restore, isRestoring } = useRestoreVersion();
    const { deleteVersionById, isDeleting } = useDeleteVersion();

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showRestoreDialog, setShowRestoreDialog] = useState<
        Id<"versions"> | null
    >(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState<
        Id<"versions"> | null
    >(null);

    const [newLabel, setNewLabel] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const handleCreate = async () => {
        if (!newLabel.trim()) return;

        await create(projectId, newLabel.trim(), newDescription.trim());
        setNewLabel("");
        setNewDescription("");
        setShowCreateDialog(false);
    };

    const handleRestore = async (versionId: Id<"versions">) => {
        await restore(versionId);
        setShowRestoreDialog(null);
    };

    const handleDelete = async (versionId: Id<"versions">) => {
        await deleteVersionById(versionId);
        setShowDeleteDialog(null);
    };

    return (
        <div className="h-full flex flex-col bg-background">
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">Version History</h3>
                </div>
                <Button
                    size="sm"
                    onClick={() => setShowCreateDialog(true)}
                    disabled={isCreating}
                >
                    <Plus className="h-3 w-3 mr-1" />
                    Save Snapshot
                </Button>
            </div>

            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="p-4 text-sm text-muted-foreground">
                        Loading versions...
                    </div>
                ) : versions.length === 0 ? (
                    <div className="p-8 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                            No versions yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Save a snapshot to start tracking changes
                        </p>
                    </div>
                ) : (
                    <div className="p-2">
                        {versions.map((version, index) => (
                            <div
                                key={version._id}
                                className="group relative p-3 rounded-lg hover:bg-accent/50 transition-colors mb-1"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="font-medium text-sm truncate">
                                                {version.label}
                                            </span>
                                        </div>
                                        {version.description && (
                                            <p className="text-xs text-muted-foreground mt-1 ml-4 line-clamp-2">
                                                {version.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-1.5 ml-4">
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(
                                                    version.createdAt,
                                                    { addSuffix: true },
                                                )}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <FileText className="h-3 w-3" />
                                                {version.files.length} files
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() =>
                                                setShowRestoreDialog(
                                                    version._id,
                                                )
                                            }
                                            disabled={isRestoring}
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive hover:text-destructive"
                                            onClick={() =>
                                                setShowDeleteDialog(
                                                    version._id,
                                                )
                                            }
                                            disabled={isDeleting}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Create Version Dialog */}
            <Dialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save Snapshot</DialogTitle>
                        <DialogDescription>
                            Create a snapshot of all current files. You can
                            restore to this version later.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Version label (e.g., 'Added auth flow')"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            autoFocus
                        />
                        <Textarea
                            placeholder="Description (optional)"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={!newLabel.trim() || isCreating}
                        >
                            {isCreating ? "Saving..." : "Save Snapshot"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Restore Version Dialog */}
            {showRestoreDialog && (
                <Dialog
                    open={!!showRestoreDialog}
                    onOpenChange={(open) => {
                        if (!open) setShowRestoreDialog(null);
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Restore Version</DialogTitle>
                            <DialogDescription>
                                This will replace all current files with the
                                snapshot. Your current files will be lost. This
                                action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowRestoreDialog(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    handleRestore(showRestoreDialog)
                                }
                                disabled={isRestoring}
                            >
                                {isRestoring
                                    ? "Restoring..."
                                    : "Restore Version"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Version Dialog */}
            {showDeleteDialog && (
                <Dialog
                    open={!!showDeleteDialog}
                    onOpenChange={(open) => {
                        if (!open) setShowDeleteDialog(null);
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Version</DialogTitle>
                            <DialogDescription>
                                This will permanently delete this version
                                snapshot. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    handleDelete(showDeleteDialog)
                                }
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete Version"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};
