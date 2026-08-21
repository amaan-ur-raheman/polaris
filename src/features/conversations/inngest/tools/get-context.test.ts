import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/convex-client", () => ({
    convex: {
        query: vi.fn(),
        mutation: vi.fn(),
    },
}));

import { convex } from "@/lib/convex-client";
import { createGetContextTool } from "./get-context";

const mockConvex = vi.mocked(convex);

describe("getContext tool", () => {
    const internalKey = "test-key";
    const projectId = "proj-1" as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns empty project message when no files exist", async () => {
        mockConvex.query.mockResolvedValue([]);

        const tool = createGetContextTool({ internalKey, projectId });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler({}, { step: { run: stepRun } });

        const parsed = JSON.parse(result);
        expect(parsed.message).toContain("empty project");
        expect(parsed.fileTree).toEqual([]);
    });

    it("returns file tree and config files", async () => {
        mockConvex.query.mockResolvedValue([
            {
                _id: "f1",
                name: "package.json",
                type: "file",
                parentId: null,
                content: '{"name": "test"}',
            },
            {
                _id: "d1",
                name: "src",
                type: "folder",
                parentId: null,
            },
            {
                _id: "f2",
                name: "index.ts",
                type: "file",
                parentId: "d1",
                content: "export {}",
            },
        ]);

        const tool = createGetContextTool({ internalKey, projectId });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler({}, { step: { run: stepRun } });

        const parsed = JSON.parse(result);
        expect(parsed.fileTree).toHaveLength(3);
        expect(parsed.configFiles["package.json"]).toBe('{"name": "test"}');
        expect(parsed.totalFiles).toBeGreaterThan(0);
        expect(parsed.totalFolders).toBeGreaterThan(0);
    });

    it("sorts folders before files in file tree", async () => {
        mockConvex.query.mockResolvedValue([
            { _id: "f1", name: "b.ts", type: "file", parentId: null, content: "" },
            { _id: "d1", name: "src", type: "folder", parentId: null },
            { _id: "f2", name: "a.ts", type: "file", parentId: null, content: "" },
        ]);

        const tool = createGetContextTool({ internalKey, projectId });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler({}, { step: { run: stepRun } });

        const parsed = JSON.parse(result);
        expect(parsed.fileTree[0].type).toBe("folder");
        expect(parsed.fileTree[0].name).toBe("src");
        expect(parsed.fileTree[1].name).toBe("a.ts");
        expect(parsed.fileTree[2].name).toBe("b.ts");
    });

    it("truncates large config files", async () => {
        const largeContent = "x".repeat(6000);
        mockConvex.query.mockResolvedValue([
            {
                _id: "f1",
                name: "package.json",
                type: "file",
                parentId: null,
                content: largeContent,
            },
        ]);

        const tool = createGetContextTool({ internalKey, projectId });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler({}, { step: { run: stepRun } });

        const parsed = JSON.parse(result);
        expect(parsed.configFiles["package.json"]).toContain("truncated");
        expect(parsed.configFiles["package.json"].length).toBeLessThan(6000);
    });

    it("handles query errors gracefully", async () => {
        mockConvex.query.mockRejectedValue(new Error("DB connection failed"));

        const tool = createGetContextTool({ internalKey, projectId });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler({}, { step: { run: stepRun } });

        expect(result).toContain("Error");
        expect(result).toContain("DB connection failed");
    });
});
