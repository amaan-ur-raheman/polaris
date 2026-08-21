import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Convex generated modules
vi.mock("./_generated/server", () => ({
    mutation: (fn: any) => fn,
    query: (fn: any) => fn,
}));

vi.mock("./auth", () => ({
    verifyAuth: vi.fn(),
}));

import { verifyAuth } from "./auth";

// Import handlers directly (they are plain objects after mock)
import * as projects from "./projects";

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
    return {
        db: {
            insert: vi.fn().mockResolvedValue("new-id"),
            get: vi.fn(),
            patch: vi.fn(),
            query: vi.fn().mockReturnValue({
                withIndex: vi.fn().mockReturnValue({
                    order: vi.fn().mockReturnValue({
                        collect: vi.fn().mockResolvedValue([]),
                        take: vi.fn().mockResolvedValue([]),
                    }),
                    eq: vi.fn().mockReturnThis(),
                }),
            }),
        },
        storage: {
            delete: vi.fn(),
        },
        ...overrides,
    };
}

describe("projects", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("create", () => {
        it("creates a project with authenticated user", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();

            const handler = (projects as any).create.handler;
            const result = await handler(ctx, { name: "My Project" });

            expect(result).toBe("new-id");
            expect(ctx.db.insert).toHaveBeenCalledWith("projects", {
                name: "My Project",
                ownerId: "user-1",
                updatedAt: expect.any(Number),
            });
        });

        it("throws when not authenticated", async () => {
            mockVerifyAuth.mockRejectedValue(new Error("Not authenticated"));
            const ctx = createMockCtx();

            const handler = (projects as any).create.handler;
            await expect(
                handler(ctx, { name: "My Project" }),
            ).rejects.toThrow("Not authenticated");
        });
    });

    describe("getById", () => {
        it("returns project when owner matches", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue({
                _id: "proj-1",
                ownerId: "user-1",
                name: "Test",
            });

            const handler = (projects as any).getById.handler;
            const result = await handler(ctx, { id: "proj-1" });

            expect(result.name).toBe("Test");
        });

        it("throws when project not found", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue(null);

            const handler = (projects as any).getById.handler;
            await expect(handler(ctx, { id: "proj-1" })).rejects.toThrow(
                "Project not found",
            );
        });

        it("throws when user is not owner", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY_2);
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue({
                _id: "proj-1",
                ownerId: "user-1",
                name: "Test",
            });

            const handler = (projects as any).getById.handler;
            await expect(handler(ctx, { id: "proj-1" })).rejects.toThrow(
                "Unauthorized",
            );
        });
    });

    describe("rename", () => {
        it("renames project when owner matches", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY);
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue({
                _id: "proj-1",
                ownerId: "user-1",
            });

            const handler = (projects as any).rename.handler;
            await handler(ctx, { id: "proj-1", name: "New Name" });

            expect(ctx.db.patch).toHaveBeenCalledWith(
                "projects",
                "proj-1",
                expect.objectContaining({ name: "New Name" }),
            );
        });

        it("throws when not owner", async () => {
            mockVerifyAuth.mockResolvedValue(MOCK_IDENTITY_2);
            const ctx = createMockCtx();
            ctx.db.get.mockResolvedValue({
                _id: "proj-1",
                ownerId: "user-1",
            });

            const handler = (projects as any).rename.handler;
            await expect(
                handler(ctx, { id: "proj-1", name: "New" }),
            ).rejects.toThrow("Unauthorized");
        });
    });
});
