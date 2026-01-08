"use client";

import { useState } from "react";

import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

const Page = () => {
    const { userId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingBackground, setLoadingBackground] = useState(false);

    const handleBlocking = async () => {
        setLoading(true);
        await fetch("/api/demo/blocking", { method: "POST" });
        setLoading(false);
    };

    const handleBackground = async () => {
        setLoadingBackground(true);
        await fetch("/api/demo/background", { method: "POST" });
        setLoadingBackground(false);
    };

    const handleClientError = () => {
        Sentry.logger.info("User trying to click on client function", {
            userId,
        });
        throw new Error("Client error: Something went wrong in the browser!");
    };

    const handleAPIError = async () => {
        await fetch("/api/demo/error", { method: "POST" });
    };

    const handleInngestError = async () => {
        await fetch("/api/demo/inngest-error", { method: "POST" });
    };

    return (
        <div className="p-8 space-x-4">
            <Button onClick={handleBlocking} disabled={loading}>
                {loading ? "Loading..." : "Blocking"}
            </Button>
            <Button onClick={handleBackground} disabled={loadingBackground}>
                {loadingBackground ? "Loading..." : "Background"}
            </Button>
            <Button variant={"destructive"} onClick={handleClientError}>
                Client Error
            </Button>
            <Button variant={"destructive"} onClick={handleAPIError}>
                API Error
            </Button>
            <Button variant={"destructive"} onClick={handleInngestError}>
                Inngest Error
            </Button>
        </div>
    );
};

export default Page;
