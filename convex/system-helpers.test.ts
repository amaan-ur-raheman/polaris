import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildFilePath, buildFileSnapshot, collectDescendantIds, nameExists } from "./system-files";
import { versionsToDelete } from "./system-versions";
import type { Doc, Id } from "./_generated/dataModel";

// ─── system-files.ts tests ───

describe("buildFilePath", () => {
    it("returns root file name when no parent", () => {
        const filesMap = new Map<string, Doc<"files">>();
        const result = buildFilePath({ name: "index.ts" }, filesMap);
        expect(result).toBe("index.ts");
    });

    it("builds nested path from parent chain", () => {
        const parentId = "abc123" as Id<"files">;
        const filesMap = new Map<string, Doc<"files">>([
            [
                parentId,
                {
                    _id: parentId,
                    _creationTime: 1,
                    projectId: "proj" as Id<"projects">,
                    name: "src",
                    type: "folder",
                    updatedAt: 1,
                },
            ],
        ]);
        const result = buildFilePath({ name: "index.ts", parentId }, filesMap);
        expect(result).toBe("src/index.ts");
    });

    it("builds deeply nested path", () => {
        const id1 = "a" as Id<"files">;
        const id2 = "b" as Id<"files">;
        const filesMap = new Map<string, Doc<"files">>([
            [
                id1,
                {
                    _id: id1,
                    _creationTime: 1,
                    projectId: "proj" as Id<"projects">,
                    name: "src",
                    type: "folder",
                    updatedAt: 1,
                },
            ],
            [
                id2,
                {
                    _id: id2,
                    _creationTime: 1,
                    projectId: "proj" as Id<"projects">,
                    name: "components",
                    type: "folder",
                    parentId: id1,
                    updatedAt: 1,
                },
            ],
        ]);
        const result = buildFilePath({ name: "Button.tsx", parentId: id2 }, filesMap);
        expect(result).toBe("src/components/Button.tsx");
    });
});

describe("buildFileSnapshot", () => {
    it("returns empty array for no files", () => {
        expect(buildFileSnapshot([])).toEqual([]);
    });

    it("filters out folders and binary files", () => {
        const files = [
            { _id: "1" as Id<"files">, _creationTime: 1, projectId: "p" as Id<"projects">, name: "src", type: "folder" as const, updatedAt: 1 },
            { _id: "2" as Id<"files">, _creationTime: 1, projectId: "p" as Id<"projects">, name: "img.png", type: "file" as const, storageId: "s" as Id<"_storage">, updatedAt: 1 },
        ] as Doc<"files">[];
        expect(buildFileSnapshot(files)).toEqual([]);
    });

    it("builds snapshot with correct paths", () => {
        const parentId = "p1" as Id<"files">;
        const files = [
            { _id: parentId, _creationTime: 1, projectId: "proj" as Id<"projects">, name: "src", type: "folder" as const, updatedAt: 1 },
            { _id: "f1" as Id<"files">, _creationTime: 1, projectId: "proj" as Id<"projects">, name: "index.ts", type: "file" as const, content: "const x = 1;", parentId, updatedAt: 1 },
        ] as Doc<"files">[];
        const snapshot = buildFileSnapshot(files);
        expect(snapshot).toHaveLength(1);
        expect(snapshot[0].path).toBe("src/index.ts");
        expect(snapshot[0].content).toBe("const x = 1;");
    });
});

describe("collectDescendantIds", () => {
    it("returns empty array for folder with no children", () => {
        const files = [
            { _id: "root" as Id<"files">, type: "folder" as const, parentId: undefined },
        ] as Doc<"files">[];
        expect(collectDescendantIds("root" as Id<"files">, files)).toEqual([]);
    });

    it("collects direct children", () => {
        const files = [
            { _id: "root" as Id<"files">, type: "folder" as const },
            { _id: "child1" as Id<"files">, type: "file" as const, parentId: "root" as Id<"files"> },
            { _id: "child2" as Id<"files">, type: "file" as const, parentId: "root" as Id<"files"> },
        ] as Doc<"files">[];
        const ids = collectDescendantIds("root" as Id<"files">, files);
        expect(ids).toContain("child1");
        expect(ids).toContain("child2");
    });

    it("collects nested descendants recursively", () => {
        const files = [
            { _id: "root" as Id<"files">, type: "folder" as const },
            { _id: "sub" as Id<"files">, type: "folder" as const, parentId: "root" as Id<"files"> },
            { _id: "deep" as Id<"files">, type: "file" as const, parentId: "sub" as Id<"files"> },
        ] as Doc<"files">[];
        const ids = collectDescendantIds("root" as Id<"files">, files);
        expect(ids).toContain("sub");
        expect(ids).toContain("deep");
    });
});

describe("nameExists", () => {
    const siblings = [
        { _id: "1" as Id<"files">, name: "index.ts", type: "file" as const },
        { _id: "2" as Id<"files">, name: "src", type: "folder" as const },
    ] as Doc<"files">[];

    it("returns true when name exists with same type", () => {
        expect(nameExists("index.ts", "file", siblings)).toBe(true);
    });

    it("returns false when name exists with different type", () => {
        expect(nameExists("index.ts", "folder", siblings)).toBe(false);
    });

    it("returns false when name does not exist", () => {
        expect(nameExists("new.ts", "file", siblings)).toBe(false);
    });

    it("excludes specified ID", () => {
        expect(nameExists("index.ts", "file", siblings, "1" as Id<"files">)).toBe(false);
    });
});

// ─── system-versions.ts tests ───

describe("versionsToDelete", () => {
    it("returns empty when under limit", () => {
        const versions = Array.from({ length: 5 }, (_, i) => ({
            _id: `v${i}` as Id<"versions">,
        }));
        expect(versionsToDelete(versions as any, 10)).toEqual([]);
    });

    it("returns oldest versions when over limit", () => {
        const versions = Array.from({ length: 12 }, (_, i) => ({
            _id: `v${i}` as Id<"versions">,
        }));
        const toDelete = versionsToDelete(versions as any, 10);
        expect(toDelete).toHaveLength(2);
        expect(toDelete).toContain("v0");
        expect(toDelete).toContain("v1");
    });

    it("returns exact count when at limit", () => {
        const versions = Array.from({ length: 10 }, (_, i) => ({
            _id: `v${i}` as Id<"versions">,
        }));
        expect(versionsToDelete(versions as any, 10)).toEqual([]);
    });
});
