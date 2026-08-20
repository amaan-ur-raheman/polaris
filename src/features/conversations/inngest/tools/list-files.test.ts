import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/convex-client", () => ({
    convex: {
        query: vi.fn(),
        mutation: vi.fn(),
    },
}));

import { convex } from "@/lib/convex-client";
import { createListFilesTool } from "./list-files";

const mockConvex = vi.mocked(convex);

describe("listFiles tool", () => {
    const internalKey = "test-key";
    const projectId = "proj-1" as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns sorted file list (folders first)", async () => {
        mockConvex.query.mockResolvedValue([
            { _id: "f1", name: "b.ts", type: "file", parentId: null },
            { _id: "d1", name: "src", type: "folder", parentId: null },
            { _id: "f2", name: "a.ts", type: "file", parentId: "d1" },
        ]);

        const tool = createListFilesTool({ internalKey, projectId });
        const stepRun = vi.fn((_name: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            {},
            { step: { run: stepRun } },
        );

        const parsed = JSON.parse(result);
        expect(parsed[0].type).toBe("folder");
        expect(parsed[0].name).toBe("src");
        expect(parsed[1].name).toBe("a.ts");
        expect(parsed[2].name).toBe("b.ts");
    });

    it("returns empty array for empty project", async () => {
        mockConvex.query.mockResolvedValue([]);

        const tool = createListFilesTool({ internalKey, projectId });
        const stepRun = vi.fn((_name: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            {},
            { step: { run: stepRun } },
        );

        expect(JSON.parse(result)).toEqual([]);
    });

    it("handles query errors gracefully", async () => {
        mockConvex.query.mockRejectedValue(new Error("DB connection failed"));

        const tool = createListFilesTool({ internalKey, projectId });
        const stepRun = vi.fn((_name: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            {},
            { step: { run: stepRun } },
        );

        expect(result).toContain("Error");
        expect(result).toContain("DB connection failed");
    });
});
