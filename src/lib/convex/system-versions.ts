import { Doc, Id } from "../../../convex/_generated/dataModel";

export const MAX_VERSIONS = 10;

/**
 * Determine which versions to delete to enforce the MAX_VERSIONS limit.
 * Pure function — takes sorted versions (asc), returns IDs to delete.
 */
export function versionsToDelete(
    allVersions: Doc<"versions">[],
    max: number = MAX_VERSIONS,
): Id<"versions">[] {
    if (allVersions.length <= max) {
        return [];
    }
    return allVersions.slice(0, allVersions.length - max).map((v) => v._id);
}
