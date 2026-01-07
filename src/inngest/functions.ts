import { generateText } from "ai";

import { google } from "@ai-sdk/google";

import { inngest } from "./client";

export const demoGenerateText = inngest.createFunction(
    { id: "demo-generate-text" },
    { event: "test/demo.generate-text" },
    async ({ step }) => {
        await step.run("generate-text", async () => {
            return await generateText({
                model: google("gemini-2.5-flash"),
                prompt: "Write a vegetarian lasagna recipe for 4 people.",
            });
        });
    }
);
