import { useMutation } from "convex/react";

import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";

/**
 * Creates a mutation with automatic optimistic cache updates for file operations.
 * Encapsulates the read→sort→write pattern shared by all file mutations.
 */
export function useOptimisticFileMutation(
    mutation: any,
    transform: (existing: Doc<"files">[], args: any) => Doc<"files">[],
) {
    return useMutation(mutation).withOptimisticUpdate((localStore, args) => {
        const existingFiles = localStore.getQuery(api.files.getFolderContents, {
            projectId: args.projectId,
            parentId: args.parentId,
        });

        if (existingFiles !== undefined) {
            const updated = transform(existingFiles, args);
            localStore.setQuery(
                api.files.getFolderContents,
                { projectId: args.projectId, parentId: args.parentId },
                [...updated].sort((a, b) => {
                    if (a.type === "folder" && b.type === "file") return -1;
                    if (a.type === "file" && b.type === "folder") return 1;
                    return a.name.localeCompare(b.name);
                }),
            );
        }
    });
}
