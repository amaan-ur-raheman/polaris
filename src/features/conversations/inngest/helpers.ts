import { createAgent, createNetwork, openai } from "@inngest/agent-kit";

import { TITLE_GENERATOR_SYSTEM_PROMPT } from "./constant";
import { DEFAULT_CONVERSATION_TITLE } from "../constants";
import { createReadFilesTool } from "./tools/read-file";
import { createListFilesTool } from "./tools/list-files";
import { createUpdateFileTool } from "./tools/update-file";
import { createCreateFilesTool } from "./tools/create-files";
import { createCreateFolderTool } from "./tools/create-folder";
import { createDeleteFilesTool } from "./tools/delete-files";
import { createScrapeUrlsTool } from "./tools/scrape-urls";
import { createRenameFileTool } from "./tools/rename-file";
import { createGetContextTool } from "./tools/get-context";
import { Id } from "@convex/_generated/dataModel";

/**
 * Build the system prompt by appending conversation history context.
 */
export function buildSystemPrompt(
    basePrompt: string,
    recentMessages: Array<{ role: string; content: string; _id: any }>,
    currentMessageId: string,
): string {
    const contextMessages = recentMessages.filter(
        (msg) => msg._id !== currentMessageId && msg.content.trim() !== "",
    );

    if (contextMessages.length === 0) {
        return basePrompt;
    }

    const historyText = contextMessages
        .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n\n");

    return `${basePrompt}\n\n## Previous Conversation (for context only - do NOT repeat these responses):\n${historyText}\n\n## Current Request:\nRespond ONLY to the user's new message below. Do not repeat or reference your previous responses.`;
}

/**
 * Create the title generation agent.
 */
export function createTitleAgent(groqApiKey: string) {
    return createAgent({
        name: "title-generator",
        system: TITLE_GENERATOR_SYSTEM_PROMPT,
        model: openai({
            model: "openai/gpt-oss-20b",
            apiKey: groqApiKey,
            baseUrl: "https://api.groq.com/openai/v1",
        }),
    });
}

/**
 * Extract the title from agent output.
 */
export function extractTitle(output: any[]): string | null {
    const textMessage = output.find((m: any) => m.type === "text" && m.role === "assistant");

    if (!textMessage || textMessage.type !== "text") {
        return null;
    }

    const title =
        typeof textMessage.content === "string"
            ? textMessage.content.trim()
            : textMessage.content
                  .map((c: any) => c.text)
                  .join("")
                  .trim();

    return title || null;
}

/**
 * Create the coding agent with all file tools.
 */
export function createCodingAgent(
    systemPrompt: string,
    nvidiaApiKey: string,
    projectId: Id<"projects">,
    internalKey: string,
) {
    return createAgent({
        name: "polaris",
        description: "An expert AI coding assistant",
        system: systemPrompt,
        model: openai({
            model: "stepfun-ai/step-3.5-flash",
            apiKey: nvidiaApiKey,
            baseUrl: "https://integrate.api.nvidia.com/v1",
        }),
        tools: [
            createGetContextTool({ projectId, internalKey }),
            createListFilesTool({ projectId, internalKey }),
            createReadFilesTool({ internalKey }),
            createUpdateFileTool({ internalKey }),
            createCreateFilesTool({ projectId, internalKey }),
            createCreateFolderTool({ projectId, internalKey }),
            createRenameFileTool({ internalKey }),
            createDeleteFilesTool({ internalKey }),
            createScrapeUrlsTool(),
        ],
    });
}

/**
 * Create the agent network with routing logic.
 */
export function createAgentNetwork(codingAgent: ReturnType<typeof createAgent>) {
    return createNetwork({
        name: "polaris-network",
        agents: [codingAgent],
        maxIter: 75,
        router: ({ network }) => {
            const lastResult = network.state.results.at(-1);

            const hasTextResponse = lastResult?.output.some(
                (m) => m.type === "text" && m.role === "assistant",
            );

            const hasToolCall = lastResult?.output.some((m) => m.type === "tool_call");

            if (hasTextResponse && !hasToolCall) {
                return undefined;
            }

            return codingAgent;
        },
    });
}

/**
 * Extract the assistant's final text response from agent results.
 */
export function extractAssistantResponse(results: any[]): string {
    const lastResult = results.at(-1);
    const textMessage = lastResult?.output.find(
        (m: any) => m.type === "text" && m.role === "assistant",
    );

    if (!textMessage || textMessage.type !== "text") {
        return "I processed your request. Let me know if you need anything else!";
    }

    const rawContent =
        typeof textMessage.content === "string"
            ? textMessage.content
            : textMessage.content.map((c: any) => c.text).join("");

    // Remove <think> tags from reasoning models
    return rawContent.replace(/<think>[\s\S]*?<\/think>\s*/g, "").trim();
}

/**
 * Check if a conversation needs a new title.
 */
export function shouldGenerateTitle(title: string): boolean {
    return title === DEFAULT_CONVERSATION_TITLE;
}
