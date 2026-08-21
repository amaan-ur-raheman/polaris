import { useMutation, useQuery } from "convex/react";

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useOptimisticFileMutation } from "./use-optimistic-file-mutation";

export const useFile = (fileId: Id<"files"> | null) => {
    return useQuery(api.files.getFile, fileId ? { id: fileId } : "skip");
};

export const useFiles = (projectId: Id<"projects"> | null) => {
    return useQuery(api.files.getFiles, projectId ? { projectId } : "skip");
};

export const useFilePath = (fileId: Id<"files"> | null) => {
    return useQuery(api.files.getFilePath, fileId ? { id: fileId } : "skip");
};

export const useCreateFile = () => {
    return useOptimisticFileMutation(api.files.createFile, (existing, args) => {
        const now = Date.now();
        return [
            ...existing,
            {
                _id: crypto.randomUUID() as Id<"files">,
                _creationTime: now,
                projectId: args.projectId,
                name: args.name,
                content: args.content,
                type: "file" as const,
                parentId: args.parentId,
                updatedAt: now,
            },
        ];
    });
};

export const useUpdateFile = () => {
    return useMutation(api.files.updateFile);
};

export const useCreateFolder = () => {
    return useOptimisticFileMutation(api.files.createFolder, (existing, args) => {
        const now = Date.now();
        return [
            ...existing,
            {
                _id: crypto.randomUUID() as Id<"files">,
                _creationTime: now,
                projectId: args.projectId,
                name: args.name,
                type: "folder" as const,
                parentId: args.parentId,
                updatedAt: now,
            },
        ];
    });
};

export const useRenameFile = ({
    projectId,
    parentId,
}: {
    projectId: Id<"projects">;
    parentId?: Id<"files">;
}) => {
    return useOptimisticFileMutation(
        api.files.renameFile,
        (existing, args: { id: Id<"files">; newName: string }) =>
            existing.map((file) => (file._id === args.id ? { ...file, name: args.newName } : file)),
        { projectId, parentId },
    );
};

export const useDeleteFile = ({
    projectId,
    parentId,
}: {
    projectId: Id<"projects">;
    parentId?: Id<"files">;
}) => {
    return useOptimisticFileMutation(
        api.files.deleteFile,
        (existing, args: { id: Id<"files"> }) => existing.filter((file) => file._id !== args.id),
        { projectId, parentId },
    );
};

export const useFolderContents = ({
    projectId,
    parentId,
    enabled = true,
}: {
    projectId: Id<"projects">;
    parentId?: Id<"files">;
    enabled?: boolean;
}) => {
    return useQuery(api.files.getFolderContents, enabled ? { projectId, parentId } : "skip");
};
