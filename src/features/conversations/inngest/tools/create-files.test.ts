import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// Mock the convex client before importing the tool
vi.mock("@/lib/convex-client", () => ({
    convex: {
        query: vi.fn(),
        mutation: vi.fn(),
    },
}));

import { convex } from "@/lib/convex-client";
import { createCreateFilesTool } from "./create-files";

const mockConvex = vi.mocked(convex);

describe("createFiles tool", () => {
    const internalKey = "test-internal-key";
    const projectId = "test-project-id" as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns error for empty files array", async () => {
        const tool = createCreateFilesTool({ internalKey, projectId });

        const result = await (tool as any).handler(
            { parentId: "", files: [] },
            { step: { run: vi.fn((_name, fn) => fn()) } },
        );

        expect(result).toContain("Error");
    });

    it("returns error for empty file name", async () => {
        const tool = createCreateFilesTool({ internalKey, projectId });

        const result = await (tool as any).handler(
            { parentId: "", files: [{ name: "", content: "hello" }] },
            { step: { run: vi.fn((_name, fn) => fn()) } },
        );

        expect(result).toContain("Error");
    });

    it("creates files at root level", async () => {
        mockConvex.mutation.mockResolvedValue([
            { name: "index.ts", error: null },
            { name: "app.ts", error: null },
        ]);

        const tool = createCreateFilesTool({ internalKey, projectId });
        const stepRun = vi.fn((_name: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            {
                parentId: "",
                files: [
                    { name: "index.ts", content: "export {}" },
                    { name: "app.ts", content: "console.log('hi')" },
                ],
            },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Created 2 file(s)");
        expect(result).toContain("index.ts");
        expect(result).toContain("app.ts");
        expect(mockConvex.mutation).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                internalKey,
                projectId,
                parentId: undefined,
            }),
        );
    });

    it("creates files in a parent folder", async () => {
        mockConvex.query.mockResolvedValue({
            _id: "folder-123",
            type: "folder",
            name: "src",
        });
        mockConvex.mutation.mockResolvedValue([
            { name: "main.ts", error: null },
        ]);

        const tool = createCreateFilesTool({ internalKey, projectId });
        const stepRun = vi.fn((_name: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            {
                parentId: "folder-123",
                files: [{ name: "main.ts", content: "import {}" }],
            },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Created 1 file(s)");
        expect(mockConvex.mutation).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                parentId: "folder-123",
            }),
        );
    });

    it("returns error when parent folder not found", async () => {
        mockConvex.query.mockResolvedValue(null);

        const tool = createCreateFilesTool({ internalKey, projectId });
        const stepRun = vi.fn((_name: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            {
                parentId: "nonexistent-id",
                files: [{ name: "test.ts", content: "" }],
            },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Error");
        expect(result).toContain("not found");
    });

    it("returns error when parentId is a file, not a folder", async () => {
        mockConvex.query.mockResolvedValue({
            _id: "file-123",
            type: "file",
            name: "README.md",
        });

        const tool = createCreateFilesTool({ internalKey, projectId });
        const stepRun = vi.fn((_name: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            {
                parentId: "file-123",
                files: [{ name: "test.ts", content: "" }],
            },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Error");
        expect(result).toContain("not a folder");
    });

    it("reports partial failures", async () => {
        mockConvex.mutation.mockResolvedValue([
            { name: "good.ts", error: null },
            { name: "bad.ts", error: "Permission denied" },
        ]);

        const tool = createCreateFilesTool({ internalKey, projectId });
        const stepRun = vi.fn((_name: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            {
                parentId: "",
                files: [
                    { name: "good.ts", content: "ok" },
                    { name: "bad.ts", content: "fail" },
                ],
            },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Created 1 file(s)");
        expect(result).toContain("Failed to create 1 file(s)");
    });

    it("handles mutation errors gracefully", async () => {
        mockConvex.mutation.mockRejectedValue(new Error("Network error"));

        const tool = createCreateFilesTool({ internalKey, projectId });
        const stepRun = vi.fn((_name: string, fn: () => Promise<any>) => fn());

        const result = await (tool as any).handler(
            {
                parentId: "",
                files: [{ name: "test.ts", content: "" }],
            },
            { step: { run: stepRun } },
        );

        expect(result).toContain("Error");
        expect(result).toContain("Network error");
    });
});
