import { ConvexHttpClient } from "convex/browser";

// Fallback allows `next build` to succeed in CI without secrets;
// runtime calls will still require a valid CONVEX_URL.
export const convex = new ConvexHttpClient(
    process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud",
);
