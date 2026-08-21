"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { reveal } from "./constants";

export function CTASection() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative py-32 md:py-44 px-6 overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_50%_70%_at_50%_110%,var(--ring),transparent_65%)] opacity-[0.16]"
      />
      <motion.div {...reveal} className="max-w-4xl mx-auto text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ring mb-6">
          Get started
        </p>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.04em] leading-[0.98] text-balance">
          One prompt from a running app.
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
          Free to start. No credit card, no setup — just describe what you want
          to build.
        </p>
        <div className="mt-10">
          {isSignedIn ? (
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-border text-foreground hover:bg-accent hover:text-foreground h-14 px-9 text-base font-medium"
            >
              <Link href="/projects">
                Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          ) : (
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 h-14 px-9 text-base font-medium group active:scale-[0.98] transition-transform"
              >
                Start building free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButton>
          )}
        </div>
      </motion.div>
    </section>
  );
}
