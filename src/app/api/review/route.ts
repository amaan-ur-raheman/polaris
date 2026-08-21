import { z } from "zod";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { aiModel } from "@/lib/ai-model";

const requestSchema = z.object({
    filename: z.string(),
    content: z.string(),
    language: z.string().optional(),
});

const reviewSchema = z.object({
    suggestions: z.array(
        z.object({
            line: z.number().nullable(),
            severity: z.enum(["error", "warning", "info"]),
            message: z.string(),
        }),
    ),
});

const REVIEW_PROMPT = `You are a code review assistant. Analyze the given code and provide brief, actionable suggestions.

Focus on:
1. Bugs or potential errors
2. Performance issues
3. Security concerns
4. Code clarity and readability

Rules:
- Be concise. Each suggestion should be 1-2 sentences max.
- Only mention real issues, not style preferences.
- If the code looks good, say so briefly with an empty suggestions array.
- Each suggestion must have: line (approximate line number or null), severity ("error" | "warning" | "info"), and message.
- If no issues found, return empty suggestions array.`;

export async function POST(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { filename, content, language } = parsed.data;

    if (content.length > 10000) {
        return NextResponse.json(
            { error: "File too large for review (max 10KB)" },
            { status: 400 },
        );
    }

    try {
        const langHint = language ? ` (language: ${language})` : "";
        const prompt = `Review this file: ${filename}${langHint}\n\n\`\`\`\n${content}\n\`\`\``;

        const { output } = await generateText({
            model: aiModel,
            output: Output.object({ schema: reviewSchema }),
            system: REVIEW_PROMPT,
            prompt,
        });

        return NextResponse.json({ suggestions: output.suggestions });
    } catch {
        return NextResponse.json({ suggestions: [] });
    }
}
