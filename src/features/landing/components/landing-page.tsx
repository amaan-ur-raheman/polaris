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
      <div className="dark min-h-screen bg-background text-foreground font-sans antialiased select-text overflow-x-clip">
        <div
          aria-hidden
          className="fixed inset-0 z-[100] pointer-events-none opacity-[0.035] mix-blend-overlay"
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
