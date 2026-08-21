import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./_generated/server", () => ({
    mutation: (fn: any) => fn,
    query: (fn: any) => fn,
}));

vi.mock("./auth", () => ({
    verifyAuth: vi.fn(),
}));

import { verifyAuth } from "./auth";
import * as files from "./files";

const mockVerifyAuth = vi.mocked(verifyAuth);
const MOCK_IDENTITY = {
    tokenIdentifier: "token-test",
    subject: "user-1",
    issuer: "https://test.clerk.accounts.dev",
} as any;
const MOCK_IDENTITY_2 = {
    ...MOCK_IDENTITY,
    subject: "user-2",
};

function createMockCtx(overrides: Partial<any> = {}) {
    const mockQueryChain = {
        withIndex: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        collect: vi.fn().mockResolvedValue([]),
        take: vi.fn().mockResolvedValue([]),
        order: vi.fn().mockReturnThis(),
    };

    return {
        db: {
            insert: vi.fn().mockResolvedValue("new-file-id"),
            get: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
            query: vi.fn().mockReturnValue(mockQueryChain),
        },
        storage: {
            delete: vi.fn(),
        },
        ...overrides,
    };
}

describe("files", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("createFile", () => {
        it("creates a file in a project", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue({
                _id: "proj-1",
                ownerId: "user-1",
            });

            const handler = (files as any).createFile.handler;
            await handler(ctx, {
                projectId: "proj-1",
                name: "index.ts",
                content: "export {}",
            });

            expect(ctx.db.insert).toHaveBeenCalledWith(
                "files",
                expect.objectContaining({
                    name: "index.ts",
                    content: "export {}",
                    type: "file",
                }),
            );
        });

        it("throws when file with same name exists", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue({
                _id: "proj-1",
                ownerId: "user-1",
            });
            // Mock existing file
            const mockQuery = ctx.db.query();
            mockQuery.withIndex().collect.mockResolvedValue([{ name: "index.ts", type: "file" }]);

            const handler = (files as any).createFile.handler;
            await expect(
                handler(ctx, {
                    projectId: "proj-1",
                    name: "index.ts",
                    content: "",
                }),
            ).rejects.toThrow("File with same name already exists");
        });

        it("throws when not authenticated", async () => {
            mockVerifyAuth.mockRejectedValue(new Error("Not authenticated"));
            const ctx = createMockCtx();

            const handler = (files as any).createFile.handler;
            await expect(
                handler(ctx, {
                    projectId: "proj-1",
                    name: "test.ts",
                    content: "",
                }),
            ).rejects.toThrow("Not authenticated");
        });
    });

    describe("createFolder", () => {
        it("creates a folder", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue({
                _id: "proj-1",
                ownerId: "user-1",
            });

            const handler = (files as any).createFolder.handler;
            await handler(ctx, { projectId: "proj-1", name: "src" });

            expect(ctx.db.insert).toHaveBeenCalledWith(
                "files",
                expect.objectContaining({
                    name: "src",
                    type: "folder",
                }),
            );
        });

        it("throws when folder with same name exists", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue({
                _id: "proj-1",
                ownerId: "user-1",
            });
            const mockQuery = ctx.db.query();
            mockQuery.withIndex().collect.mockResolvedValue([{ name: "src", type: "folder" }]);

            const handler = (files as any).createFolder.handler;
            await expect(handler(ctx, { projectId: "proj-1", name: "src" })).rejects.toThrow(
                "Folder with same name already exists",
            );
        });
    });

    describe("updateFile", () => {
        it("updates file content", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get
                .mockResolvedValueOnce({ _id: "file-1", projectId: "proj-1" })
                .mockResolvedValueOnce({ _id: "proj-1", ownerId: "user-1" });

            const handler = (files as any).updateFile.handler;
            await handler(ctx, { id: "file-1", content: "new content" });

            expect(ctx.db.patch).toHaveBeenCalledWith(
                "files",
                "file-1",
                expect.objectContaining({ content: "new content" }),
            );
        });

        it("throws when file not found", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue(null);

            const handler = (files as any).updateFile.handler;
            await expect(handler(ctx, { id: "file-1", content: "" })).rejects.toThrow(
                "File not found",
            );
        });
    });

    describe("deleteFile", () => {
        it("deletes a file", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            const fileDoc = { _id: "file-1", projectId: "proj-1", type: "file" };
            const projectDoc = { _id: "proj-1", ownerId: "user-1" };
            // 1st: get file for ownership check
            // 2nd: get project for ownership check
            // 3rd: get file inside deleteRecursively
            ctx.db.get
                .mockResolvedValueOnce(fileDoc)
                .mockResolvedValueOnce(projectDoc)
                .mockResolvedValueOnce(fileDoc);

            const handler = (files as any).deleteFile.handler;
            await handler(ctx, { id: "file-1" });

            expect(ctx.db.delete).toHaveBeenCalled();
        });

        it("throws when not owner", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY_2);
            const ctx = createMockCtx();
            ctx.db.get
                .mockResolvedValueOnce({
                    _id: "file-1",
                    projectId: "proj-1",
                })
                .mockResolvedValueOnce({ _id: "proj-1", ownerId: "user-1" });

            const handler = (files as any).deleteFile.handler;
            await expect(handler(ctx, { id: "file-1" })).rejects.toThrow("Unauthorized");
        });
    });

    describe("renameFile", () => {
        it("renames a file", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get
                .mockResolvedValueOnce({
                    _id: "file-1",
                    projectId: "proj-1",
                    type: "file",
                    parentId: null,
                })
                .mockResolvedValueOnce({ _id: "proj-1", ownerId: "user-1" });

            const handler = (files as any).renameFile.handler;
            await handler(ctx, { id: "file-1", newName: "new-name.ts" });

            expect(ctx.db.patch).toHaveBeenCalledWith(
                "files",
                "file-1",
                expect.objectContaining({ name: "new-name.ts" }),
            );
        });

        it("throws when sibling with same name exists", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get
                .mockResolvedValueOnce({
                    _id: "file-1",
                    projectId: "proj-1",
                    type: "file",
                    parentId: null,
                })
                .mockResolvedValueOnce({ _id: "proj-1", ownerId: "user-1" });

            const mockQuery = ctx.db.query();
            mockQuery
                .withIndex()
                .collect.mockResolvedValue([{ _id: "file-2", name: "taken.ts", type: "file" }]);

            const handler = (files as any).renameFile.handler;
            await expect(handler(ctx, { id: "file-1", newName: "taken.ts" })).rejects.toThrow(
                "already exists",
            );
        });
    });
});
