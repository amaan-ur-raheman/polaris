"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EASE } from "./constants";

const CODE = [
    [
        ["import", "text-ring"],
        [" { Pricing } ", "text-white/80"],
        ["from", "text-ring"],
        [' "@/components/pricing"', "text-emerald-400"],
        [";", "text-white/60"],
    ],
    [
        ["export default function", "text-ring"],
        [" Page", "text-yellow-200/90"],
        ["() {", "text-white/60"],
    ],
    [
        ["  return", "text-ring"],
        [" (", "text-white/60"],
    ],
    [
        ["    <", "text-white/60"],
        ["div", "text-sky-300"],
        [" className", "text-yellow-200/90"],
        ["=", "text-white/60"],
        ['"mx-auto py-24"', "text-emerald-400"],
        [">", "text-white/60"],
    ],
    [
        ["      <", "text-white/60"],
        ["Pricing", "text-sky-300"],
        [" tiers", "text-yellow-200/90"],
        ["=", "text-white/60"],
        [" {[", "text-white/60"],
        ['"free"', "text-emerald-400"],
        [", ", "text-white/60"],
        ['"pro"', "text-emerald-400"],
        [", ", "text-white/60"],
        ['"team"', "text-emerald-400"],
        ["]} ", "text-white/60"],
        ["/>", "text-white/60"],
    ],
    [
        ["    </", "text-white/60"],
        ["div", "text-sky-300"],
        [">", "text-white/60"],
    ],
    [["  );", "text-white/60"]],
    [["}", "text-white/60"]],
];

function ProductWindow() {
    return (
        <div className="relative" style={{ perspective: 1400 }}>
            <motion.div
                initial={{ opacity: 0, y: 80, rotateX: 18 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 6 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1, ease: EASE }}
                style={{ transformStyle: "preserve-3d" }}
                className="border-border bg-card relative overflow-hidden rounded-xl border shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
            >
                <div className="border-border bg-background/60 flex h-11 items-center gap-3 border-b px-4">
                    <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    </div>
                    <div className="flex flex-1 justify-center gap-2">
                        <span className="bg-accent text-foreground/80 border-border rounded-md border px-2 py-1 font-mono text-[10px]">
                            page.tsx
                        </span>
                        <span className="text-muted-foreground rounded-md border border-transparent px-2 py-1 font-mono text-[10px]">
                            layout.tsx
                        </span>
                    </div>
                    <span className="text-muted-foreground border-border rounded-full border px-2.5 py-1 font-mono text-[10px]">
                        localhost:3000
                    </span>
                </div>

                <div className="divide-border grid divide-y md:grid-cols-[220px_1.1fr_1fr] md:divide-x md:divide-y-0">
                    <div className="space-y-3 p-4">
                        <p className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
                            Chat
                        </p>
                        <div className="bg-accent border-border text-foreground/90 rounded-lg border p-2.5 text-xs">
                            Add a pricing section with three tiers.
                        </div>
                        <div className="border-border space-y-2 rounded-lg border p-2.5">
                            <div className="text-ring flex items-center gap-1.5">
                                <span className="font-mono text-[10px] tracking-widest uppercase">
                                    Polaris
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-1.5 w-full rounded-full bg-white/[0.07]" />
                                <div className="h-1.5 w-5/6 rounded-full bg-white/[0.07]" />
                                <div className="h-1.5 w-2/3 rounded-full bg-white/[0.07]" />
                            </div>
                            <div className="text-ring/90 pt-1 font-mono text-[10px]">
                                + pricing.tsx · + tiers.ts · ~ page.tsx
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden p-4">
                        <p className="text-muted-foreground mb-3 font-mono text-[10px] tracking-[0.2em] uppercase">
                            Editor
                        </p>
                        <pre className="overflow-hidden font-mono text-[11px] leading-5">
                            {CODE.map((tokens, i) => (
                                <div key={i} className="flex gap-4">
                                    <span className="w-4 text-right text-white/15 select-none">
                                        {i + 1}
                                    </span>
                                    <code className="whitespace-pre">
                                        {tokens.map(([text, cls], j) => (
                                            <span key={j} className={cls}>
                                                {text}
                                            </span>
                                        ))}
                                    </code>
                                </div>
                            ))}
                        </pre>
                    </div>

                    <div className="p-4">
                        <p className="text-muted-foreground mb-3 font-mono text-[10px] tracking-[0.2em] uppercase">
                            Preview
                        </p>
                        <div className="border-border space-y-2.5 rounded-lg border bg-white/[0.02] p-3">
                            <div className="h-2 w-1/3 rounded-full bg-white/10" />
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`space-y-1.5 rounded-md border p-2.5 ${
                                        i === 1 ? "border-ring/50 bg-ring/[0.06]" : "border-border"
                                    }`}
                                >
                                    <div className="h-1.5 w-8 rounded-full bg-white/15" />
                                    <div className="h-3 w-14 rounded-sm bg-white/25" />
                                    <div className="h-1 w-full rounded-full bg-white/[0.08]" />
                                    <div className="h-1 w-2/3 rounded-full bg-white/[0.08]" />
                                    <div
                                        className={`mt-1 h-4 w-16 rounded-md ${
                                            i === 1 ? "bg-ring/70" : "bg-white/10"
                                        }`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-border bg-background/60 text-muted-foreground flex h-7 items-center justify-between border-t px-4 font-mono text-[10px]">
                    <span>* WebContainer — ready</span>
                    <span>main* ↑2</span>
                </div>
            </motion.div>
        </div>
    );
}

export function HeroSection() {
    const ref = useRef<HTMLDivElement>(null);
    const { isSignedIn } = useAuth();

    return (
        <section ref={ref} className="relative overflow-hidden px-6 pt-40 pb-24">
            <div
                aria-hidden
                className="absolute inset-0 -z-10 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_75%)] [background-size:72px_72px]"
            />
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_55%_60%_at_50%_-10%,var(--ring),transparent_65%)] opacity-[0.14]"
            />

            <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                        className="mb-8"
                    >
                        <span className="border-ring/30 bg-ring/[0.06] text-ring inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-[0.14em] uppercase">
                            <span className="bg-ring h-1.5 w-1.5 animate-pulse rounded-full" />
                            Public beta
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                        className="text-5xl leading-[0.95] font-semibold tracking-[-0.04em] text-balance md:text-7xl lg:text-[5.5rem]"
                    >
                        Describe it.
                        <br />
                        <span className="text-muted-foreground">Watch it run.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                        className="text-muted-foreground mx-auto mt-7 max-w-xl text-lg leading-relaxed text-pretty"
                    >
                        Polaris turns plain English into complete, running web apps — editor,
                        terminal, and live preview in one browser tab.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
                        className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                    >
                        {isSignedIn ? (
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="border-border text-foreground hover:bg-accent hover:text-foreground h-12 px-7 font-medium"
                            >
                                <Link href="/projects">
                                    Dashboard
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </Button>
                        ) : (
                            <SignUpButton mode="modal">
                                <Button
                                    size="lg"
                                    className="bg-foreground text-background hover:bg-foreground/90 group h-12 px-7 font-medium transition-transform active:scale-[0.98]"
                                >
                                    Start building free
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Button>
                            </SignUpButton>
                        )}
                        <Button
                            variant="outline"
                            size="lg"
                            asChild
                            className="border-border text-foreground hover:bg-accent hover:text-foreground h-12 px-7 font-mono text-sm"
                        >
                            <Link href="#process">See how it works</Link>
                        </Button>
                    </motion.div>
                </div>

                <div className="mt-20">
                    <ProductWindow />
                </div>
            </div>
        </section>
    );
}
