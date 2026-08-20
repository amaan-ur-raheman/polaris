"use client";

import { useMutation, useQuery } from "convex/react";
import { useCallback, useState } from "react";

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export const useVersions = (projectId: Id<"projects">) => {
    const versions = useQuery(api.system.getVersions, {
        internalKey: process.env.NEXT_PUBLIC_CONVEX_INTERNAL_KEY ?? "",
        projectId,
    });

    return {
        versions: versions ?? [],
        isLoading: versions === undefined,
    };
};

export const useCreateVersion = () => {
    const createVersion = useMutation(api.system.createVersion);
    const [isCreating, setIsCreating] = useState(false);

    const create = useCallback(
        async (
            projectId: Id<"projects">,
            label: string,
            description?: string,
        ) => {
            setIsCreating(true);
            try {
                const versionId = await createVersion({
                    internalKey:
                        process.env.NEXT_PUBLIC_CONVEX_INTERNAL_KEY ?? "",
                    projectId,
                    label,
                    description,
                });
                return versionId;
            } finally {
                setIsCreating(false);
            }
        },
        [createVersion],
    );

    return { create, isCreating };
};

export const useRestoreVersion = () => {
    const restoreVersion = useMutation(api.system.restoreVersion);
    const [isRestoring, setIsRestoring] = useState(false);

    const restore = useCallback(
        async (versionId: Id<"versions">) => {
            setIsRestoring(true);
            try {
                const result = await restoreVersion({
                    internalKey:
                        process.env.NEXT_PUBLIC_CONVEX_INTERNAL_KEY ?? "",
                    versionId,
                });
                return result;
            } finally {
                setIsRestoring(false);
            }
        },
        [restoreVersion],
    );

    return { restore, isRestoring };
};

export const useDeleteVersion = () => {
    const deleteVersion = useMutation(api.system.deleteVersion);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteVersionById = useCallback(
        async (versionId: Id<"versions">) => {
            setIsDeleting(true);
            try {
                await deleteVersion({
                    internalKey:
                        process.env.NEXT_PUBLIC_CONVEX_INTERNAL_KEY ?? "",
                    versionId,
                });
            } finally {
                setIsDeleting(false);
            }
        },
        [deleteVersion],
    );

    return { deleteVersionById, isDeleting };
};
