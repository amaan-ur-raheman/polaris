import Firecrawl from "@mendable/firecrawl-js";

const apiKey = process.env.FIRECRAWL_API_KEY || "placeholder_for_build";

export const firecrawl = new Firecrawl({
    apiKey,
});
