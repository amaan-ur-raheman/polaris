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
        <section className="border-border relative overflow-hidden border-t px-6 py-32 md:py-44">
            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_50%_70%_at_50%_110%,var(--ring),transparent_65%)] opacity-[0.16]"
            />
            <motion.div {...reveal} className="mx-auto max-w-4xl text-center">
                <p className="text-ring mb-6 font-mono text-xs tracking-[0.25em] uppercase">
                    Get started
                </p>
                <h2 className="text-5xl leading-[0.98] font-semibold tracking-[-0.04em] text-balance md:text-7xl lg:text-8xl">
                    One prompt from a running app.
                </h2>
                <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg text-pretty">
                    Free to start. No credit card, no setup — just describe what you want to build.
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
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    ) : (
                        <SignUpButton mode="modal">
                            <Button
                                size="lg"
                                className="bg-foreground text-background hover:bg-foreground/90 group h-14 px-9 text-base font-medium transition-transform active:scale-[0.98]"
                            >
                                Start building free
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </SignUpButton>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
