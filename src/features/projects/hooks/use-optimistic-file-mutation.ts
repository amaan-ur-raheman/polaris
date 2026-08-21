import { useMutation } from "convex/react";

import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";

interface CacheContext {
    projectId: Id<"projects">;
    parentId?: Id<"files">;
}

/**
 * Creates a mutation with automatic optimistic cache updates for file operations.
 * Encapsulates the read→sort→write pattern shared by all file mutations.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOptimisticFileMutation<TArgs extends Record<string, any>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutation: any,
    transform: (existing: Doc<"files">[], args: TArgs) => Doc<"files">[],
    cacheContext?: CacheContext,
) {
    return useMutation(mutation).withOptimisticUpdate((localStore, args) => {
        const projectId = cacheContext?.projectId ?? ((args as TArgs).projectId as Id<"projects">);
        const parentId =
            cacheContext?.parentId ?? ((args as TArgs).parentId as Id<"files"> | undefined);

        const existingFiles = localStore.getQuery(api.files.getFolderContents, {
            projectId,
            parentId,
        });

        if (existingFiles !== undefined) {
            const updated = transform(existingFiles, args as TArgs);
            localStore.setQuery(
                api.files.getFolderContents,
                { projectId, parentId },
                [...updated].sort((a, b) => {
                    if (a.type === "folder" && b.type === "file") return -1;
                    if (a.type === "file" && b.type === "folder") return 1;
                    return a.name.localeCompare(b.name);
                }),
            );
        }
    });
}
