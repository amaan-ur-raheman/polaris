import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

export const aiModel = groq("openai/gpt-oss-20b");
