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
    <section id="pricing" className="relative py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...reveal} className="text-center mb-14 max-w-2xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ring mb-5">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-balance">
            Start free. Scale when you do.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto items-stretch">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className={cn(
                "relative flex flex-col rounded-xl border bg-card p-8",
                plan.popular
                  ? "border-ring/50 shadow-[0_0_80px_-24px_var(--ring)]"
                  : "border-border hover:border-white/20 transition-colors"
              )}
            >
              {plan.popular && (
                <p className="absolute -top-3 left-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ring bg-card border border-ring/40 rounded-full px-3 py-1">
                  Recommended
                </p>
              )}

              <h3 className="font-medium text-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight tabular-nums">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-foreground/85"
                  >
                    <Check className="w-4 h-4 text-ring shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isSignedIn ? (
                <Button
                  className={cn(
                    "mt-8 w-full active:scale-[0.98] transition-transform",
                    plan.popular
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-transparent border border-border text-foreground hover:bg-accent"
                  )}
                  asChild
                >
                  <Link href="/projects">Dashboard</Link>
                </Button>
              ) : (
                <SignUpButton mode="modal">
                  <Button
                    className={cn(
                      "mt-8 w-full active:scale-[0.98] transition-transform",
                      plan.popular
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "bg-transparent border border-border text-foreground hover:bg-accent"
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
