import { Doc, Id } from "./_generated/dataModel";

/**
 * Build a file path by traversing the parent chain.
 * Pure function — no Convex dependency.
 */
export function buildFilePath(
    file: { name: string; parentId?: Id<"files"> },
    filesMap: Map<string, Doc<"files">>,
): string {
    const parts: string[] = [file.name];
    let parentId = file.parentId;
    while (parentId) {
        const parent = filesMap.get(parentId);
        if (!parent) break;
        parts.unshift(parent.name);
        parentId = parent.parentId;
    }
    return parts.join("/");
}

/**
 * Build a snapshot of all text files in a project.
 * Pure function — takes pre-fetched files, returns snapshot array.
 */
export function buildFileSnapshot(
    files: Doc<"files">[],
): Array<{ path: string; content: string; type: "file" }> {
    const filesMap = new Map(files.map((f) => [f._id, f]));

    return files
        .filter((f) => f.type === "file" && f.content !== undefined)
        .map((f) => ({
            path: buildFilePath(f, filesMap),
            content: f.content || "",
            type: "file" as const,
        }));
}

/**
 * Recursively collect all descendant IDs of a folder.
 * Pure function — takes pre-fetched files, returns IDs to delete.
 */
export function collectDescendantIds(
    folderId: Id<"files">,
    files: Doc<"files">[],
): Id<"files">[] {
    const children = files.filter((f) => f.parentId === folderId);
    const ids: Id<"files">[] = [];

    for (const child of children) {
        if (child.type === "folder") {
            ids.push(...collectDescendantIds(child._id, files));
        }
        ids.push(child._id);
    }

    return ids;
}

/**
 * Check if a name already exists in the same parent folder.
 * Pure function — takes pre-fetched siblings, returns boolean.
 */
export function nameExists(
    name: string,
    type: "file" | "folder",
    siblings: Doc<"files">[],
    excludeId?: Id<"files">,
): boolean {
    return siblings.some(
        (s) => s.name === name && s.type === type && s._id !== excludeId,
    );
}
