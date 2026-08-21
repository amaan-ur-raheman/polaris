import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "convex/_generated/**",
    ]),
    {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    {
        files: ["src/components/ai-elements/**/*.tsx"],
        rules: {
            "@next/next/no-img-element": "off",
        },
    },
    {
        files: [
            "convex/system.ts",
            "src/app/api/projects/create-with-prompt/route.ts",
            "src/features/conversations/inngest/helpers.ts",
            "src/features/editor/collab/convex-provider.ts",
            "src/components/ai-elements/prompt-input.tsx",
        ],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
]);

export default eslintConfig;
