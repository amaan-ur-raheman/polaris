// Base padding for root level items (after project header)
export const BASE_PADDING = 12;
// Additional padding for each level of nesting
export const NESTING_PADDING = 12;

export const getItemPadding = (level: number, isFile: boolean) => {
    // Files need extra padding since they don't have the chevron
    const fileOffset = isFile ? 16 : 0;
    return BASE_PADDING + level * NESTING_PADDING + fileOffset;
};
