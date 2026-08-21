import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Polaris - AI Development Environment",
        short_name: "Polaris",
        description: "AI-powered full-stack development environment",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0a0f",
        theme_color: "#6366f1",
        icons: [
            {
                src: "/logo.svg",
                sizes: "any",
                type: "image/svg+xml",
            },
            {
                src: "/logo-alt.svg",
                sizes: "any",
                type: "image/svg+xml",
            },
        ],
    };
}
