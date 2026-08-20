import { LandingPage } from "@/features/landing/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Polaris - AI-Powered Development Environment",
    description: "Build complete web applications with AI in your browser. No setup, no configuration, just code.",
};

const Home = () => {
    return <LandingPage />;
};

export default Home;