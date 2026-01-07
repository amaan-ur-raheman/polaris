"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const Page = () => {
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

    return (
        <div className="p-8 space-x-4">
            <Button onClick={handleBlocking} disabled={loading}>
                {loading ? "Loading..." : "Blocking"}
            </Button>
            <Button onClick={handleBackground} disabled={loadingBackground}>
                {loadingBackground ? "Loading..." : "Background"}
            </Button>
        </div>
    );
};

export default Page;
