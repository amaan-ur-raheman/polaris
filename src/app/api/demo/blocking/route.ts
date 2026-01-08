import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST() {
    const response = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: "Write a vegetarian lasagna recipe for 4 people.",
        experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
        },
    });

    return Response.json({
        response,
    });
}
