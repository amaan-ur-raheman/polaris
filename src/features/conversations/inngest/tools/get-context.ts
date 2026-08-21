import { z } from "zod";

import { createTool } from "@inngest/agent-kit";
import { convex } from "@/lib/convex-client";

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

interface GetContextToolParams {
    internalKey: string;
    projectId: Id<"projects">;
}

/**
 * Config files to always include in context when they exist.
 * These give the AI critical information about the project setup.
 */
const CONFIG_FILES = [
    "package.json",
    "tsconfig.json",
    "next.config.ts",
    "next.config.js",
    "next.config.mjs",
    "tailwind.config.ts",
    "tailwind.config.js",
    "vite.config.ts",
    "vite.config.js",
    "vitest.config.ts",
    "components.json",
    ".env.example",
];

export const createGetContextTool = ({ internalKey, projectId }: GetContextToolParams) => {
    return createTool({
        name: "getContext",
        description:
            "Automatically gather project context including file tree and key config files. Call this first to understand the project structure before making changes.",
        parameters: z.object({}),
        handler: async (_, { step: toolStep }) => {
            try {
                return await toolStep?.run("get-context", async () => {
                    // Get the full file tree
                    const files = await convex.query(api.system.getProjectFiles, {
                        internalKey,
                        projectId,
                    });

                    if (!files || files.length === 0) {
                        return JSON.stringify({
                            fileTree: [],
                            configFiles: {},
                            message: "This is an empty project. No files exist yet.",
                        });
                    }

                    // Build file tree summary
                    const fileTree = files
                        .sort((a, b) => {
                            if (a.type !== b.type) {
                                return a.type === "folder" ? -1 : 1;
                            }
                            return a.name.localeCompare(b.name);
                        })
                        .map((f) => ({
                            id: f._id,
                            name: f.name,
                            type: f.type,
                            parentId: f.parentId ?? null,
                        }));

                    // Read config files
                    const configFiles: Record<string, string> = {};

                    for (const configName of CONFIG_FILES) {
                        const configFile = files.find(
                            (f) => f.name === configName && f.type === "file" && f.content,
                        );

                        if (configFile && configFile.content) {
                            // Truncate very large config files
                            configFiles[configName] =
                                configFile.content.length > 5000
                                    ? configFile.content.slice(0, 5000) + "\n... (truncated)"
                                    : configFile.content;
                        }
                    }

                    return JSON.stringify({
                        fileTree,
                        configFiles,
                        totalFiles: files.length,
                        totalFolders: files.filter((f) => f.type === "folder").length,
                    });
                });
            } catch (error) {
                return `Error getting context: ${error instanceof Error ? error.message : "Unknown error"}`;
            }
        },
    });
};
