import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/convex-client", () => ({
    convex: {
        query: vi.fn(),
        mutation: vi.fn(),
    },
}));

import { convex } from "@/lib/convex-client";
import { createCreateFolderTool } from "./create-folder";

const mockConvex = vi.mocked(convex);

describe("createFolder tool", () => {
    const internalKey = "test-key";
    const projectId = "proj-1" as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns error for empty folder name", async () => {
        const tool = createCreateFolderTool({ internalKey, projectId });

        const result = await (tool as any).handler(
            { name: "", parentId: "" },
            { step: { run: vi.fn((_n: string, fn: () => Promise<any>) => fn()) } },
        );

        expect(result).toContain("Error");
    });

    it("creates folder at root level", async () => {
        mockConvex.mutation.mockResolvedValue("folder-123");

        const tool = createCreateFolderTool({ internalKey, projectId });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { name: "components", parentId: "" },
            { step: { run: stepRun } },
        );

        expect(result).toContain("folder-123");
        expect(mockConvex.mutation).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ name: "components" }),
        );
    });

    it("creates folder inside parent", async () => {
        mockConvex.query.mockResolvedValue({
            _id: "parent-1",
            type: "folder",
            name: "src",
        });
        mockConvex.mutation.mockResolvedValue("child-folder");

        const tool = createCreateFolderTool({ internalKey, projectId });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { name: "utils", parentId: "parent-1" },
            { step: { run: stepRun } },
        );

        expect(result).toContain("child-folder");
    });

    it("returns error when parent not found", async () => {
        mockConvex.query.mockResolvedValue(null);

        const tool = createCreateFolderTool({ internalKey, projectId });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { name: "test", parentId: "bad-id" },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Error");
        expect(result).toContain("not found");
    });

    it("returns error when parent is a file, not folder", async () => {
        mockConvex.query.mockResolvedValue({
            _id: "file-1",
            type: "file",
            name: "README.md",
        });

        const tool = createCreateFolderTool({ internalKey, projectId });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { name: "test", parentId: "file-1" },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Error");
        expect(result).toContain("not a folder");
    });
});
