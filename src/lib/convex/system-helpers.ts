/**
 * Shared helper for internal key validation.
 * Used by all system.ts mutations/queries.
 */
export const validateInternalKey = (key: string) => {
    const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
    if (!internalKey) {
        throw new Error("POLARIS_CONVEX_INTERNAL_KEY not configured");
    }

    if (key !== internalKey) {
        throw new Error("Invalid internal key");
    }
};
