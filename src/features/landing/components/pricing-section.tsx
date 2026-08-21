"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { reveal, EASE } from "./constants";

const PLANS = [
    {
        name: "Free",
        price: "$0",
        period: "",
        description: "For trying things out.",
        features: ["3 projects", "AI code generation", "Live preview", "1 GB storage"],
        cta: "Get started",
        popular: false,
    },
    {
        name: "Pro",
        price: "$20",
        period: "/mo",
        description: "For serious building.",
        features: [
            "Unlimited projects",
            "All AI models",
            "GitHub export",
            "10 GB storage",
            "Priority support",
        ],
        cta: "Start free trial",
        popular: true,
    },
    {
        name: "Team",
        price: "$50",
        period: "/mo",
        description: "For collaborative teams.",
        features: [
            "Everything in Pro",
            "Real-time collaboration",
            "Team management",
            "100 GB storage",
            "Custom domains",
        ],
        cta: "Contact sales",
        popular: false,
    },
];

export function PricingSection() {
    const { isSignedIn } = useAuth();

    return (
        <section id="pricing" className="relative px-6 py-28 md:py-36">
            <div className="mx-auto max-w-6xl">
                <motion.div {...reveal} className="mx-auto mb-14 max-w-2xl text-center">
                    <p className="text-ring mb-5 font-mono text-xs tracking-[0.25em] uppercase">
                        Pricing
                    </p>
                    <h2 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance md:text-5xl">
                        Start free. Scale when you do.
                    </h2>
                </motion.div>

                <div className="mx-auto grid max-w-5xl items-stretch gap-4 md:grid-cols-3">
                    {PLANS.map((plan) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className={cn(
                                "bg-card relative flex flex-col rounded-xl border p-8",
                                plan.popular
                                    ? "border-ring/50 shadow-[0_0_80px_-24px_var(--ring)]"
                                    : "border-border transition-colors hover:border-white/20",
                            )}
                        >
                            {plan.popular && (
                                <p className="text-ring bg-card border-ring/40 absolute -top-3 left-8 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase">
                                    Recommended
                                </p>
                            )}

                            <h3 className="text-foreground font-medium">{plan.name}</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-5xl font-semibold tracking-tight tabular-nums">
                                    {plan.price}
                                </span>
                                {plan.period && (
                                    <span className="text-muted-foreground text-sm">
                                        {plan.period}
                                    </span>
                                )}
                            </div>
                            <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>

                            <ul className="mt-8 flex-1 space-y-3">
                                {plan.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="text-foreground/85 flex items-center gap-2.5 text-sm"
                                    >
                                        <Check className="text-ring h-4 w-4 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {isSignedIn ? (
                                <Button
                                    className={cn(
                                        "mt-8 w-full transition-transform active:scale-[0.98]",
                                        plan.popular
                                            ? "bg-foreground text-background hover:bg-foreground/90"
                                            : "border-border text-foreground hover:bg-accent border bg-transparent",
                                    )}
                                    asChild
                                >
                                    <Link href="/projects">Dashboard</Link>
                                </Button>
                            ) : (
                                <SignUpButton mode="modal">
                                    <Button
                                        className={cn(
                                            "mt-8 w-full transition-transform active:scale-[0.98]",
                                            plan.popular
                                                ? "bg-foreground text-background hover:bg-foreground/90"
                                                : "border-border text-foreground hover:bg-accent border bg-transparent",
                                        )}
                                    >
                                        {plan.cta}
                                    </Button>
                                </SignUpButton>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
