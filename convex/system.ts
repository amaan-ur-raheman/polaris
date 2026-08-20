import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const validateInternalKey = (key: string) => {
    const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
    if (!internalKey) {
        throw new Error("POLARIS_CONVEX_INTERNAL_KEY not configured");
    }

    if (key !== internalKey) {
        throw new Error("Invalid internal key");
    }
};

export const getConversationById = query({
    args: {
        conversationId: v.id("conversations"),
        internalKey: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);
        return await ctx.db.get(args.conversationId);
    },
});

export const createMessage = mutation({
    args: {
        internalKey: v.string(),
        conversationId: v.id("conversations"),
        projectId: v.id("projects"),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        status: v.optional(
            v.union(
                v.literal("processing"),
                v.literal("completed"),
                v.literal("cancelled"),
            ),
        ),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) {
            throw new Error("Conversation not found");
        }

        const messageId = await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            projectId: args.projectId,
            role: args.role,
            content: args.content,
            status: args.status,
        });

        // Update conversation updatedAt
        await ctx.db.patch(args.conversationId, {
            updatedAt: Date.now(),
        });

        return messageId;
    },
});

export const updateMessageContent = mutation({
    args: {
        internalKey: v.string(),
        messageId: v.id("messages"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        await ctx.db.patch(args.messageId, {
            content: args.content,
            status: "completed" as const,
        });
    },
});

export const updateMessageStatus = mutation({
    args: {
        internalKey: v.string(),
        messageId: v.id("messages"),
        status: v.union(
            v.literal("processing"),
            v.literal("completed"),
            v.literal("cancelled"),
        ),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        await ctx.db.patch(args.messageId, {
            status: args.status,
        });
    },
});

export const getProcessingMessages = query({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        return await ctx.db
            .query("messages")
            .withIndex("by_project_status", (q) =>
                q.eq("projectId", args.projectId).eq("status", "processing"),
            )
            .collect();
    },
});

export const getRecentMessages = query({
    args: {
        internalKey: v.string(),
        conversationId: v.id("conversations"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", args.conversationId),
            )
            .order("asc")
            .collect();

        const limit = args.limit ?? 10;
        return messages.slice(-limit);
    },
});

export const updateConversationTitle = mutation({
    args: {
        internalKey: v.string(),
        conversationId: v.id("conversations"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) {
            throw new Error("Conversation not found");
        }

        await ctx.db.patch(args.conversationId, {
            title: args.title,
            updatedAt: Date.now(),
        });
    },
});

export const getProjectFiles = query({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        return await ctx.db
            .query("files")
            .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
            .collect();
    },
});

export const getFileById = query({
    args: {
        internalKey: v.string(),
        fileId: v.id("files"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        return await ctx.db.get(args.fileId);
    },
});

export const updateFile = mutation({
    args: {
        internalKey: v.string(),
        fileId: v.id("files"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const file = await ctx.db.get(args.fileId);
        if (!file) {
            throw new Error("File not found");
        }

        await ctx.db.patch(args.fileId, {
            content: args.content,
            updatedAt: Date.now(),
        });
    },
});

export const createFile = mutation({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
        name: v.string(),
        content: v.string(),
        parentId: v.optional(v.id("files")),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const files = await ctx.db
            .query("files")
            .withIndex("by_project_parent", (q) =>
                q.eq("projectId", args.projectId).eq("parentId", args.parentId),
            )
            .collect();

        const existing = files.find(
            (file) => file.name === args.name && file.type === "file",
        );

        if (existing) {
            throw new Error("File already exists");
        }

        const fileId = await ctx.db.insert("files", {
            projectId: args.projectId,
            name: args.name,
            content: args.content,
            type: "file",
            parentId: args.parentId,
            updatedAt: Date.now(),
        });

        return fileId;
    },
});

export const createFiles = mutation({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
        parentId: v.optional(v.id("files")),
        files: v.array(
            v.object({
                name: v.string(),
                content: v.string(),
            }),
        ),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const existingFiles = await ctx.db
            .query("files")
            .withIndex("by_project_parent", (q) =>
                q.eq("projectId", args.projectId).eq("parentId", args.parentId),
            )
            .collect();

        const results: { name: string; fileId: string; error?: string }[] = [];

        for (const file of args.files) {
            const existing = existingFiles.find(
                (f) => f.name === file.name && f.type === "file",
            );

            if (existing) {
                results.push({
                    name: file.name,
                    fileId: existing._id,
                    error: "File already exists",
                });

                continue;
            }

            const fileId = await ctx.db.insert("files", {
                projectId: args.projectId,
                name: file.name,
                content: file.content,
                type: "file",
                parentId: args.parentId,
                updatedAt: Date.now(),
            });

            results.push({ name: file.name, fileId });
        }

        return results;
    },
});

export const createFolder = mutation({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
        name: v.string(),
        parentId: v.optional(v.id("files")),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const files = await ctx.db
            .query("files")
            .withIndex("by_project_parent", (q) =>
                q.eq("projectId", args.projectId).eq("parentId", args.parentId),
            )
            .collect();

        const existing = files.find(
            (file) => file.name === args.name && file.type === "folder",
        );

        if (existing) {
            throw new Error("Folder already exists");
        }

        const folderId = await ctx.db.insert("files", {
            projectId: args.projectId,
            name: args.name,
            type: "folder",
            parentId: args.parentId,
            updatedAt: Date.now(),
        });

        return folderId;
    },
});

export const renameFile = mutation({
    args: {
        internalKey: v.string(),
        fileId: v.id("files"),
        newName: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const file = await ctx.db.get(args.fileId);
        if (!file) {
            throw new Error("File not found");
        }

        // Check if the file with the new name already exists in the same parent folder
        const siblings = await ctx.db
            .query("files")
            .withIndex("by_project_parent", (q) =>
                q.eq("projectId", file.projectId).eq("parentId", file.parentId),
            )
            .collect();

        const existing = siblings.find(
            (sibling) =>
                sibling.name === args.newName &&
                sibling.type === file.type &&
                sibling._id !== args.fileId,
        );

        if (existing) {
            throw new Error(
                `A ${file.type} with the name ${args.newName} already exists`,
            );
        }

        await ctx.db.patch(args.fileId, {
            name: args.newName,
            updatedAt: Date.now(),
        });

        return args.fileId;
    },
});

export const deleteFile = mutation({
    args: {
        internalKey: v.string(),
        fileId: v.id("files"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const file = await ctx.db.get(args.fileId);
        if (!file) {
            throw new Error("File not found");
        }

        // Recursively delete file / folder and all descendants
        const deleteRecursive = async (fileId: typeof args.fileId) => {
            const item = await ctx.db.get(fileId);

            if (!item) {
                return;
            }

            // If its a folder delete all its children first
            if (item.type === "folder") {
                const children = await ctx.db
                    .query("files")
                    .withIndex("by_project_parent", (q) =>
                        q
                            .eq("projectId", item.projectId)
                            .eq("parentId", fileId),
                    )
                    .collect();

                for (const child of children) {
                    await deleteRecursive(child._id);
                }
            }

            // Delete storage file if its exists
            if (item.storageId) {
                await ctx.storage.delete(item.storageId);
            }

            // Delete the file / folder itself
            await ctx.db.delete(fileId);
        };

        await deleteRecursive(args.fileId);

        return args.fileId;
    },
});

export const cleanup = mutation({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const files = await ctx.db
            .query("files")
            .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
            .collect();

        for (const file of files) {
            // Delete storage file if its exists
            if (file.storageId) {
                await ctx.storage.delete(file.storageId);
            }

            // Delete the file / folder itself
            await ctx.db.delete(file._id);
        }

        return { deleted: files.length };
    },
});

export const generateUploadUrl = mutation({
    args: {
        internalKey: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);
        return await ctx.storage.generateUploadUrl();
    },
});

export const createBinaryFile = mutation({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
        name: v.string(),
        storageId: v.id("_storage"),
        parentId: v.optional(v.id("files")),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const files = await ctx.db
            .query("files")
            .withIndex("by_project_parent", (q) =>
                q.eq("projectId", args.projectId).eq("parentId", args.parentId),
            )
            .collect();

        const existing = files.find(
            (file) => file.name === args.name && file.type === "file",
        );

        if (existing) {
            throw new Error("File already exists");
        }

        const fileId = await ctx.db.insert("files", {
            projectId: args.projectId,
            name: args.name,
            type: "file",
            storageId: args.storageId,
            parentId: args.parentId,
            updatedAt: Date.now(),
        });

        return fileId;
    },
});

export const updateImportStatus = mutation({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
        status: v.optional(
            v.union(
                v.literal("importing"),
                v.literal("completed"),
                v.literal("failed"),
            ),
        ),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        await ctx.db.patch("projects", args.projectId, {
            importStatus: args.status,
            updatedAt: Date.now(),
        });
    },
});

export const updateExportStatus = mutation({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
        status: v.optional(
            v.union(
                v.literal("exporting"),
                v.literal("completed"),
                v.literal("failed"),
                v.literal("cancelled"),
            ),
        ),
        repoUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        await ctx.db.patch("projects", args.projectId, {
            exportStatus: args.status,
            exportRepoUrl: args.repoUrl,
            updatedAt: Date.now(),
        });
    },
});

export const getProjectFilesWithUrls = query({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const files = await ctx.db
            .query("files")
            .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
            .collect();

        return await Promise.all(
            files.map(async (file) => {
                if (file.storageId) {
                    const url = await ctx.storage.getUrl(file.storageId);
                    return { ...file, storageUrl: url };
                }

                return { ...file, storageUrl: null };
            }),
        );
    },
});

export const createProject = mutation({
    args: {
        internalKey: v.string(),
        name: v.string(),
        ownerId: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const projectId = await ctx.db.insert("projects", {
            name: args.name,
            ownerId: args.ownerId,
            updatedAt: Date.now(),
            importStatus: "importing",
        });

        return projectId;
    },
});

export const createProjectWithConversation = mutation({
    args: {
        internalKey: v.string(),
        projectName: v.string(),
        conversationTitle: v.string(),
        ownerId: v.string(),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const now = Date.now();

        const projectId = await ctx.db.insert("projects", {
            name: args.projectName,
            ownerId: args.ownerId,
            updatedAt: now,
        });

        const conversationId = await ctx.db.insert("conversations", {
            projectId,
            title: args.conversationTitle,
            updatedAt: now,
        });

        return { projectId, conversationId };
    },
});

// === Version Management ===

const MAX_VERSIONS = 10;

export const getVersions = query({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        return await ctx.db
            .query("versions")
            .withIndex("by_project", (q) =>
                q.eq("projectId", args.projectId),
            )
            .order("desc")
 .collect();
    },
});

export const createVersion = mutation({
    args: {
        internalKey: v.string(),
        projectId: v.id("projects"),
        label: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        // Get all files for this project
        const files = await ctx.db
            .query("files")
            .withIndex("by_project", (q) =>
                q.eq("projectId", args.projectId),
            )
            .collect();

        // Build file paths by traversing parent chain
        const filesMap = new Map(files.map((f) => [f._id, f]));

        const getFilePath = (file: typeof files[0]): string => {
            const parts: string[] = [file.name];
            let parentId = file.parentId;
            while (parentId) {
                const parent = filesMap.get(parentId);
                if (!parent) break;
                parts.unshift(parent.name);
                parentId = parent.parentId;
            }
            return parts.join("/");
        };

        const snapshot = files
            .filter((f) => f.type === "file" && f.content !== undefined)
            .map((f) => ({
                path: getFilePath(f),
                content: f.content || "",
                type: "file" as const,
            }));

        const versionId = await ctx.db.insert("versions", {
            projectId: args.projectId,
            label: args.label,
            description: args.description,
            files: snapshot,
            createdAt: Date.now(),
        });

        // Enforce MAX_VERSIONS limit
        const allVersions = await ctx.db
            .query("versions")
            .withIndex("by_project", (q) =>
                q.eq("projectId", args.projectId),
            )
            .order("asc")
            .collect();

        if (allVersions.length > MAX_VERSIONS) {
            const toDelete = allVersions.slice(
                0,
                allVersions.length - MAX_VERSIONS,
            );
            for (const v of toDelete) {
                await ctx.db.delete(v._id);
            }
        }

        return versionId;
    },
});

export const restoreVersion = mutation({
    args: {
        internalKey: v.string(),
        versionId: v.id("versions"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const version = await ctx.db.get(args.versionId);
        if (!version) {
            throw new Error("Version not found");
        }

        // Delete all current files in the project
        const currentFiles = await ctx.db
            .query("files")
            .withIndex("by_project", (q) =>
                q.eq("projectId", version.projectId),
            )
            .collect();

        for (const file of currentFiles) {
            if (file.storageId) {
                await ctx.storage.delete(file.storageId);
            }
            await ctx.db.delete(file._id);
        }

        // Recreate files from snapshot
        const folderCache = new Map<string, string>();

        for (const snapshotFile of version.files) {
            const parts = snapshotFile.path.split("/");
            let parentId: string | undefined;

            // Create intermediate folders
            for (let i = 0; i < parts.length - 1; i++) {
                const folderPath = parts.slice(0, i + 1).join("/");
                if (folderCache.has(folderPath)) {
                    parentId = folderCache.get(folderPath);
                } else {
                    const folderId = await ctx.db.insert("files", {
                        projectId: version.projectId,
                        name: parts[i],
                        type: "folder",
                        parentId: parentId as any,
                        updatedAt: Date.now(),
                    });
                    folderCache.set(folderPath, folderId);
                    parentId = folderId;
                }
            }

            await ctx.db.insert("files", {
                projectId: version.projectId,
                name: parts[parts.length - 1],
                content: snapshotFile.content,
                type: "file",
                parentId: parentId as any,
                updatedAt: Date.now(),
            });
        }

        // Update project timestamp
        await ctx.db.patch(version.projectId, {
            updatedAt: Date.now(),
        });

        return { success: true, filesRestored: version.files.length };
    },
});

export const deleteVersion = mutation({
    args: {
        internalKey: v.string(),
        versionId: v.id("versions"),
    },
    handler: async (ctx, args) => {
        validateInternalKey(args.internalKey);

        const version = await ctx.db.get(args.versionId);
        if (!version) {
            throw new Error("Version not found");
        }

        await ctx.db.delete(args.versionId);
        return { success: true };
    },
});
