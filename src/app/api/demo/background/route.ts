import { inngest } from "@/inngest/client";

export async function POST() {
    await inngest.send({
        name: "test/demo.generate-text",
        data: {},
    });

    return Response.json({ status: "Started" });
}
