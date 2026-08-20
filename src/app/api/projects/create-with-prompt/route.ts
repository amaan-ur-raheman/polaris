import { z } from "zod";
import { NextResponse } from "next/server";
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator";

import { auth } from "@clerk/nextjs/server";
import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { DEFAULT_CONVERSATION_TITLE } from "@/features/conversations/constants";

import { api } from "@convex/_generated/api";
import { getTemplateById } from "@/features/projects/templates";

const requestSchema = z.object({
    prompt: z.string().min(1),
    templateId: z.string().optional(),
});

export async function POST(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
    if (!internalKey) {
        return NextResponse.json(
            { error: "Internal key not configured" },
            { status: 500 },
        );
    }

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 },
        );
    }

    const { prompt, templateId } = parsed.data;

    // Generate a random project name
    const projectName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors],
        separator: "-",
        length: 3,
    });

    // Create both project and conversation together
    const { projectId, conversationId } = await convex.mutation(
        api.system.createProjectWithConversation,
        {
            internalKey,
            projectName,
            conversationTitle: DEFAULT_CONVERSATION_TITLE,
            ownerId: userId,
        },
    );

    // Create template files if a template was selected
    const template = templateId ? getTemplateById(templateId) : undefined;
    if (template && template.files.length > 0) {
        // Create folders first, then files
        const folderCache = new Map<string, string>();

        for (const file of template.files) {
            const parts = file.path.split("/");
            let parentId: string | undefined;

            // Create intermediate folders
            for (let i = 0; i < parts.length - 1; i++) {
                const folderPath = parts.slice(0, i + 1).join("/");
                if (folderCache.has(folderPath)) {
                    parentId = folderCache.get(folderPath);
                } else {
                    const folderId = await convex.mutation(
                        api.system.createFolder,
                        {
                            internalKey,
                            projectId,
                            name: parts[i],
                            parentId: parentId as any,
                        },
                    );
                    folderCache.set(folderPath, folderId);
                    parentId = folderId;
                }
            }

            // Create the file
            await convex.mutation(api.system.createFile, {
                internalKey,
                projectId,
                name: parts[parts.length - 1],
                content: file.content,
                parentId: parentId as any,
            });
        }
    }

    // Create a user message
    await convex.mutation(api.system.createMessage, {
        internalKey,
        conversationId,
        projectId,
        role: "user",
        content: prompt,
    });

    // Create assistant message placeholder with processing status
    const assistantMessageId = await convex.mutation(api.system.createMessage, {
        internalKey,
        conversationId,
        projectId,
        role: "assistant",
        content: "",
        status: "processing",
    });

    // Trigger Inngest background job to process message
    await inngest.send({
        name: "message/sent",
        data: {
            messageId: assistantMessageId,
            conversationId,
            projectId,
            message: prompt,
        },
    });

    return NextResponse.json({
        projectId,
    });
}
