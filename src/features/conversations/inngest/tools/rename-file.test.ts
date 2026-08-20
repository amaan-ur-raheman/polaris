import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/convex-client", () => ({
    convex: {
        query: vi.fn(),
        mutation: vi.fn(),
    },
}));

import { convex } from "@/lib/convex-client";
import { createRenameFileTool } from "./rename-file";

const mockConvex = vi.mocked(convex);

describe("renameFile tool", () => {
    const internalKey = "test-key";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns error for empty fileId", async () => {
        const tool = createRenameFileTool({ internalKey });

        const result = await (tool as any).handler(
            { fileId: "", newName: "new" },
            { step: { run: vi.fn((_n: string, fn: () => Promise<any>) => fn()) } },
        );

        expect(result).toContain("Error");
    });

    it("returns error for empty newName", async () => {
        const tool = createRenameFileTool({ internalKey });

        const result = await (tool as any).handler(
            { fileId: "f1", newName: "" },
            { step: { run: vi.fn((_n: string, fn: () => Promise<any>) => fn()) } },
        );

        expect(result).toContain("Error");
    });

    it("renames a file successfully", async () => {
        mockConvex.query.mockResolvedValue({
            _id: "f1",
            name: "old.ts",
            type: "file",
        });
        mockConvex.mutation.mockResolvedValue(undefined);

        const tool = createRenameFileTool({ internalKey });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { fileId: "f1", newName: "new.ts" },
            { step: { run: stepRun } },
        );

        expect(result).toContain("old.ts");
        expect(result).toContain("new.ts");
        expect(result).toContain("successfully");
    });

    it("renames a folder", async () => {
        mockConvex.query.mockResolvedValue({
            _id: "d1",
            name: "utils",
            type: "folder",
        });
        mockConvex.mutation.mockResolvedValue(undefined);

        const tool = createRenameFileTool({ internalKey });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { fileId: "d1", newName: "helpers" },
            { step: { run: stepRun } },
        );

        expect(result).toContain("utils");
        expect(result).toContain("helpers");
    });

    it("returns error when file not found", async () => {
        mockConvex.query.mockResolvedValue(null);

        const tool = createRenameFileTool({ internalKey });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { fileId: "nonexistent", newName: "new" },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Error");
        expect(result).toContain("not found");
    });

    it("handles mutation errors gracefully", async () => {
        mockConvex.query.mockResolvedValue({
            _id: "f1",
            name: "test.ts",
            type: "file",
        });
        mockConvex.mutation.mockRejectedValue(new Error("Permission denied"));

        const tool = createRenameFileTool({ internalKey });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { fileId: "f1", newName: "new.ts" },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Error");
        expect(result).toContain("Permission denied");
    });
});
