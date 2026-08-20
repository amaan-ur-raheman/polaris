import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
    it("merges class names", () => {
        const result = cn("text-red-500", "text-blue-500");
        expect(result).toBe("text-blue-500");
    });

    it("handles conditional classes", () => {
        const result = cn("base", false && "hidden", "extra");
        expect(result).toContain("base");
        expect(result).toContain("extra");
        expect(result).not.toContain("hidden");
    });

    it("handles undefined and null", () => {
        const result = cn("base", undefined, null);
        expect(result).toBe("base");
    });

    it("handles empty input", () => {
        const result = cn();
        expect(result).toBe("");
    });

    it("merges tailwind classes correctly", () => {
        const result = cn("px-4 py-2", "px-6");
        expect(result).toContain("px-6");
        expect(result).toContain("py-2");
        expect(result).not.toContain("px-4");
    });
});
