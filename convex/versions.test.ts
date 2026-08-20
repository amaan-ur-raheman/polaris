import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./_generated/server", () => ({
    mutation: (fn: any) => fn,
    query: (fn: any) => fn,
}));

vi.mock("./auth", () => ({
    verifyAuth: vi.fn(),
}));

import * as system from "./system";

const VALID_KEY = "test-internal-key";

function makeQueryChain(results: any = []) {
    const chain: any = {};
    chain.withIndex = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.order = vi.fn().mockReturnValue(chain);
    chain.collect = vi.fn().mockResolvedValue(results);
    chain.take = vi.fn().mockResolvedValue(results);
    return chain;
}

function createMockCtx(overrides: Partial<any> = {}) {
    return {
        db: {
            insert: vi.fn().mockResolvedValue("new-id"),
            get: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
            query: vi.fn().mockImplementation(() => makeQueryChain()),
        },
        storage: {
            getUrl: vi.fn().mockResolvedValue(null),
            delete: vi.fn(),
            generateUploadUrl: vi.fn(),
        },
        ...overrides,
    };
}

describe("Version Management", () => {
    beforeEach(() => {
        process.env.POLARIS_CONVEX_INTERNAL_KEY = VALID_KEY;
        vi.clearAllMocks();
    });

    describe("getVersions", () => {
        it("returns versions for a project", async () => {
            const ctx = createMockCtx();
            const versions = [
                { _id: "v1", label: "First", createdAt: 1000 },
                { _id: "v2", label: "Second", createdAt: 2000 },
            ];

            ctx.db.query.mockReturnValue(makeQueryChain(versions));

            const handler = (system as any).getVersions.handler;
            const result = await handler(ctx, {
                internalKey: VALID_KEY,
                projectId: "proj-1",
            });

            expect(result).toEqual(versions);
        });
    });

    describe("createVersion", () => {
        it("creates a version with file snapshot", async () => {
            const ctx = createMockCtx();

            const mockFiles = [
                {
                    _id: "file-1",
                    projectId: "proj-1",
                    name: "index.tsx",
                    content: "console.log('hello')",
                    type: "file",
                    parentId: undefined,
                },
                {
                    _id: "folder-1",
                    projectId: "proj-1",
                    name: "src",
                    type: "folder",
                    parentId: undefined,
                },
            ];

            // First call to query: get files for snapshot
            ctx.db.query
                .mockReturnValueOnce(makeQueryChain(mockFiles))
                // Second call to query: get existing versions (empty)
                .mockReturnValueOnce(makeQueryChain([]));

            ctx.db.insert.mockResolvedValue("version-1");

            const handler = (system as any).createVersion.handler;
            const result = await handler(ctx, {
                internalKey: VALID_KEY,
                projectId: "proj-1",
                label: "Test version",
                description: "A test snapshot",
            });

            expect(result).toBe("version-1");
            expect(ctx.db.insert).toHaveBeenCalledWith("versions", {
                projectId: "proj-1",
                label: "Test version",
                description: "A test snapshot",
                files: expect.arrayContaining([
                    {
                        path: "index.tsx",
                        content: "console.log('hello')",
                        type: "file",
                    },
                ]),
                createdAt: expect.any(Number),
            });
        });

        it("enforces MAX_VERSIONS limit of 10", async () => {
            const ctx = createMockCtx();

            // 12 existing versions
            const existingVersions = Array.from({ length: 12 }, (_, i) => ({
                _id: `version-${i}`,
                projectId: "proj-1",
                createdAt: i * 1000,
            }));

            // First call: get files (empty)
            // Second call: get existing versions
            ctx.db.query
                .mockReturnValueOnce(makeQueryChain([]))
                .mockReturnValueOnce(makeQueryChain(existingVersions));

            ctx.db.insert.mockResolvedValue("version-new");

            const handler = (system as any).createVersion.handler;
            await handler(ctx, {
                internalKey: VALID_KEY,
                projectId: "proj-1",
                label: "New version",
            });

            // Should delete the 2 oldest versions (12 - 10 = 2)
            expect(ctx.db.delete).toHaveBeenCalledTimes(2);
            expect(ctx.db.delete).toHaveBeenCalledWith("version-0");
            expect(ctx.db.delete).toHaveBeenCalledWith("version-1");
        });
    });

    describe("restoreVersion", () => {
        it("restores files from a version snapshot", async () => {
            const ctx = createMockCtx();

            const mockVersion = {
                _id: "version-1",
                projectId: "proj-1",
                label: "Test version",
                files: [
                    { path: "src/index.tsx", content: "code", type: "file" },
                    { path: "src/utils.ts", content: "utils", type: "file" },
                ],
                createdAt: Date.now(),
            };

            const mockCurrentFiles = [
                {
                    _id: "old-file-1",
                    projectId: "proj-1",
                    name: "old.tsx",
                    type: "file",
                },
            ];

            ctx.db.get.mockResolvedValue(mockVersion);
            ctx.db.query.mockReturnValue(makeQueryChain(mockCurrentFiles));
            ctx.db.insert.mockResolvedValue("new-file-id");

            const handler = (system as any).restoreVersion.handler;
            const result = await handler(ctx, {
                internalKey: VALID_KEY,
                versionId: "version-1" as any,
            });

            expect(result).toEqual({
                success: true,
                filesRestored: 2,
            });
            expect(ctx.db.delete).toHaveBeenCalledWith("old-file-1");
        });

        it("rejects invalid version", async () => {
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue(null);

            const handler = (system as any).restoreVersion.handler;
            await expect(
                handler(ctx, {
                    internalKey: VALID_KEY,
                    versionId: "nonexistent" as any,
                })
            ).rejects.toThrow("Version not found");
        });
    });

    describe("deleteVersion", () => {
        it("deletes a version", async () => {
            const ctx = createMockCtx();

            ctx.db.get.mockResolvedValue({
                _id: "version-1",
                projectId: "proj-1",
            });

            const handler = (system as any).deleteVersion.handler;
            const result = await handler(ctx, {
                internalKey: VALID_KEY,
                versionId: "version-1" as any,
            });

            expect(result).toEqual({ success: true });
            expect(ctx.db.delete).toHaveBeenCalledWith("version-1");
        });

        it("rejects invalid version", async () => {
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue(null);

            const handler = (system as any).deleteVersion.handler;
            await expect(
                handler(ctx, {
                    internalKey: VALID_KEY,
                    versionId: "nonexistent" as any,
                })
            ).rejects.toThrow("Version not found");
        });
    });
});
