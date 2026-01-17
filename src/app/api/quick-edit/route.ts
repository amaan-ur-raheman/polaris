import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import z from "zod";

import { google } from "@ai-sdk/google";
import { firecrawl } from "@/lib/firecrawl";
import { auth } from "@clerk/nextjs/server";

const quickEditSchema = z.object({
    editedCode: z
        .string()
        .describe(
            "The edited version of the selected code based on the instruction",
        ),
});

const URL_REGEX = /https?:\/\/[^\s]+/g;

const QUICK_EDIT_PROMPT = `You are a code editing assistant. Edit the selected code based on the user's instruction.

<context>
<selected_code>
{selectedCode}
</selected_code>
<full_code_context>
{fullCode}
</full_code_context>
</context>

{documentation}

<instruction>
{instruction}
</instruction>

<instructions>
Return ONLY the edited version of the selected code.
Maintain the same indentation level as the original.
Do not include any explanations or comments unless requested.
If the instruction is unclear or cannot be applied, return the original code unchanged.
</instructions>`;

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { selectedCode, fullCode, instruction } = await request.json();

        if (!selectedCode) {
            return NextResponse.json(
                { error: "Selected code is required" },
                { status: 400 },
            );
        }

        if (!instruction) {
            return NextResponse.json(
                { error: "Instruction is required" },
                { status: 400 },
            );
        }

        const urls: string[] = instruction.match(URL_REGEX) || [];
        let documentation = "";

        if (urls.length > 0) {
            const scrapedResults = await Promise.all(
                urls.map(async (url) => {
                    try {
                        const result = await firecrawl.scrape(url, {
                            formats: ["markdown"],
                        });

                        if (result.markdown) {
                            return `<doc url="${url}">\n${result.markdown}\n</doc>`;
                        }

                        return null;
                    } catch (error) {
                        return null;
                    }
                }),
            );
            const validResults = scrapedResults.filter(Boolean);
            if (validResults.length > 0) {
                documentation = `<documentation>\n${validResults.join("\n\n")}\n</documentation>`;
            }
        }

        const prompt = QUICK_EDIT_PROMPT.replace("{selectedCode}", selectedCode)
            .replace("{fullCode}", fullCode || "")
            .replace("{instruction}", instruction)
            .replace("{documentation}", documentation);

        const { output } = await generateText({
            model: google("gemini-flash-latest"),
            output: Output.object({ schema: quickEditSchema }),
            prompt,
        });

        return NextResponse.json({ editedCode: output.editedCode });
    } catch (error) {
        console.error("Quick edit failed", error);
        return NextResponse.json(
            { error: "Failed to generate edited code" },
            { status: 500 },
        );
    }
}
