import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/convex-client", () => ({
    convex: {
        query: vi.fn(),
        mutation: vi.fn(),
    },
}));

import { convex } from "@/lib/convex-client";
import { createDeleteFilesTool } from "./delete-files";

const mockConvex = vi.mocked(convex);

describe("deleteFiles tool", () => {
    const internalKey = "test-key";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns error for empty fileIds", async () => {
        const tool = createDeleteFilesTool({ internalKey });

        const result = await (tool as any).handler(
            { fileIds: [] },
            { step: { run: vi.fn((_n: string, fn: () => Promise<any>) => fn()) } },
        );

        expect(result).toContain("Error");
    });

    it("deletes a single file", async () => {
        mockConvex.query.mockResolvedValue({
            _id: "f1",
            name: "test.ts",
            type: "file",
        });
        mockConvex.mutation.mockResolvedValue(undefined);

        const tool = createDeleteFilesTool({ internalKey });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { fileIds: ["f1"] },
            { step: { run: stepRun } },
        );

        expect(result).toContain('Deleted file "test.ts"');
    });

    it("deletes multiple files", async () => {
        mockConvex.query
            .mockResolvedValueOnce({ _id: "f1", name: "a.ts", type: "file" })
            .mockResolvedValueOnce({ _id: "f2", name: "b.ts", type: "file" });
        mockConvex.mutation.mockResolvedValue(undefined);

        const tool = createDeleteFilesTool({ internalKey });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { fileIds: ["f1", "f2"] },
            { step: { run: stepRun } },
        );

        expect(result).toContain("a.ts");
        expect(result).toContain("b.ts");
    });

    it("returns error when file not found", async () => {
        mockConvex.query.mockResolvedValue(null);

        const tool = createDeleteFilesTool({ internalKey });
        const stepRun = vi.fn((_n: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            { fileIds: ["nonexistent"] },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Error");
        expect(result).toContain("not found");
    });
});
