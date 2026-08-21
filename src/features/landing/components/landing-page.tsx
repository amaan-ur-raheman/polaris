"use client";

import { AuthRedirect } from "@/features/auth/components/auth-redirect";
import { Navigation } from "./navigation";
import { HeroSection } from "./hero-section";
import { Marquee } from "./marquee";
import { FeaturesSection } from "./features-section";
import { HowItWorksSection } from "./how-it-works";
import { StackSection } from "./stack-section";
import { PricingSection } from "./pricing-section";
import { CTASection } from "./cta-section";
import { Footer } from "./footer";
import { NOISE } from "./constants";

export function LandingPage() {
    return (
        <AuthRedirect>
            <div className="dark bg-background text-foreground min-h-screen overflow-x-clip font-sans antialiased select-text">
                <div
                    aria-hidden
                    className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035] mix-blend-overlay"
                    style={{ backgroundImage: NOISE }}
                />
                <Navigation />
                <main>
                    <HeroSection />
                    <Marquee />
                    <FeaturesSection />
                    <HowItWorksSection />
                    <StackSection />
                    <PricingSection />
                    <CTASection />
                </main>
                <Footer />
            </div>
        </AuthRedirect>
    );
}
