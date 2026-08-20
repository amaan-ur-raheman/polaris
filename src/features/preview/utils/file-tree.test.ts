import { describe, it, expect } from "vitest";
import { buildFileTree, getFilePath } from "./file-tree";

// Minimal mock of Convex Doc<"files">
function makeFile(overrides: Partial<any> = {}) {
    return {
        _id: "id-" + Math.random().toString(36).slice(2, 8),
        _creationTime: Date.now(),
        projectId: "proj-1",
        name: "file.ts",
        type: "file" as const,
        content: "",
        parentId: undefined,
        updatedAt: Date.now(),
        ...overrides,
    };
}

describe("buildFileTree", () => {
    it("returns empty tree for empty input", () => {
        expect(buildFileTree([])).toEqual({});
    });

    it("builds a single root file", () => {
        const files = [makeFile({ name: "index.ts", content: "hello" })];
        const tree = buildFileTree(files);
        expect(tree).toEqual({
            "index.ts": { file: { contents: "hello" } },
        });
    });

    it("builds a nested file inside a folder", () => {
        const folder = makeFile({
            _id: "folder-1",
            name: "src",
            type: "folder",
        });
        const file = makeFile({
            name: "main.ts",
            content: "code",
            parentId: "folder-1",
        });

        const tree = buildFileTree([folder, file]);
        expect(tree).toEqual({
            src: {
                directory: {
                    "main.ts": { file: { contents: "code" } },
                },
            },
        });
    });

    it("builds deeply nested paths", () => {
        const root = makeFile({
            _id: "f1",
            name: "src",
            type: "folder",
        });
        const mid = makeFile({
            _id: "f2",
            name: "components",
            type: "folder",
            parentId: "f1",
        });
        const leaf = makeFile({
            name: "Button.tsx",
            content: "export default () => null",
            parentId: "f2",
        });

        const tree = buildFileTree([root, mid, leaf]);
        expect(tree).toEqual({
            src: {
                directory: {
                    components: {
                        directory: {
                            "Button.tsx": {
                                file: {
                                    contents: "export default () => null",
                                },
                            },
                        },
                    },
                },
            },
        });
    });

    it("handles multiple files in the same folder", () => {
        const folder = makeFile({
            _id: "f1",
            name: "utils",
            type: "folder",
        });
        const file1 = makeFile({
            name: "a.ts",
            content: "a",
            parentId: "f1",
        });
        const file2 = makeFile({
            name: "b.ts",
            content: "b",
            parentId: "f1",
        });

        const tree = buildFileTree([folder, file1, file2]);
        expect(tree).toEqual({
            utils: {
                directory: {
                    "a.ts": { file: { contents: "a" } },
                    "b.ts": { file: { contents: "b" } },
                },
            },
        });
    });

    it("skips files with storageId (binary files)", () => {
        const file = makeFile({
            name: "image.png",
            storageId: "storage-123",
        });
        const tree = buildFileTree([file]);
        expect(tree).toEqual({});
    });
});

describe("getFilePath", () => {
    it("returns just the filename for root files", () => {
        const files = new Map();
        const file = makeFile({ name: "index.ts" });
        expect(getFilePath(file, files)).toBe("index.ts");
    });

    it("returns full path for nested files", () => {
        const folder = makeFile({
            _id: "f1",
            name: "src",
            type: "folder",
        });
        const file = makeFile({
            name: "main.ts",
            parentId: "f1",
        });
        const files = new Map([
            ["f1", folder],
        ]);

        expect(getFilePath(file, files)).toBe("src/main.ts");
    });

    it("handles deeply nested paths", () => {
        const f1 = makeFile({ _id: "f1", name: "a", type: "folder" });
        const f2 = makeFile({ _id: "f2", name: "b", type: "folder", parentId: "f1" });
        const file = makeFile({ name: "c.ts", parentId: "f2" });
        const files = new Map([
            ["f1", f1],
            ["f2", f2],
        ]);

        expect(getFilePath(file, files)).toBe("a/b/c.ts");
    });

    it("stops at missing parent", () => {
        const file = makeFile({ name: "orphan.ts", parentId: "missing" });
        const files = new Map();

        expect(getFilePath(file, files)).toBe("orphan.ts");
    });
});
