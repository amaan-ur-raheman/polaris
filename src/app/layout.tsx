import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { Providers } from "@/components/providers";

import "allotment/dist/style.css";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
    variable: "--font-plex-mono",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: {
        default: "Polaris - AI-Powered Full-Stack Development Environment",
        template: "%s | Polaris",
    },
    description:
        "Build, edit, and preview web applications with intelligent AI assistance. Powered by multi-model AI support including Groq, OpenAI, and Anthropic.",
    keywords: [
        "AI code editor",
        "web development",
        "code generation",
        "AI assistant",
        "WebContainer",
        "online IDE",
        "full-stack development",
        "AI coding",
        "browser IDE",
        "code editor",
    ],
    authors: [{ name: "Amaan Ur Raheman" }],
    creator: "Amaan Ur Raheman",
    metadataBase: new URL("https://polaris-jade-three.vercel.app"),
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://polaris-jade-three.vercel.app",
        siteName: "Polaris",
        title: "Polaris - AI-Powered Full-Stack Development Environment",
        description:
            "Build, edit, and preview web applications with intelligent AI assistance—all in your browser.",
        images: [
            {
                url: "/readme/poster.png",
                width: 1280,
                height: 720,
                alt: "Polaris - AI Development Environment",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Polaris - AI-Powered Full-Stack Development Environment",
        description: "Build, edit, and preview web applications with intelligent AI assistance.",
        images: ["/readme/poster.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/logo.svg",
        shortcut: "/logo.svg",
        apple: "/logo.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${plexMono.variable} antialiased`}>
                <Providers>
                    {children}
                    <Toaster richColors />
                </Providers>
            </body>
        </html>
    );
}
