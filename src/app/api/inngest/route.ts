import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { processMessage } from "@/features/conversations/inngest/process-message";
import { exportToGithub } from "@/features/projects/inngest/export-to-github";
import { importGithubRepo } from "@/features/projects/inngest/import-github-repo";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [processMessage, exportToGithub, importGithubRepo],
});
