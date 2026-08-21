"use client";

import { motion } from "motion/react";
import { reveal } from "./constants";
import { SpotlightCard } from "./spotlight-card";

const STACK = [
    {
        tag: "EDIT",
        title: "CodeMirror 6",
        description: "A professional-grade editor core with 20+ language modes.",
        span: "md:col-span-1",
    },
    {
        tag: "RUN",
        title: "WebContainer",
        description:
            "Node.js executed entirely in your browser. The dev server is a tab, not a process.",
        span: "md:col-span-2",
    },
    {
        tag: "EXEC",
        title: "xterm.js",
        description: "A real terminal with command history and streaming output.",
        span: "md:col-span-1",
    },
    {
        tag: "AGENT",
        title: "Inngest Agent Kit",
        description: "Multi-model agent tooling that plans, writes, and verifies its own changes.",
        span: "md:col-span-1",
    },
    {
        tag: "DATA",
        title: "Convex",
        description: "Realtime database with optimistic updates — files sync as you type.",
        span: "md:col-span-2",
    },
];

export function StackSection() {
    return (
        <section className="bg-card border-border relative border-y px-6 py-28 md:py-36">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    {...reveal}
                    className="mb-14 flex flex-wrap items-end justify-between gap-6"
                >
                    <div>
                        <p className="text-ring mb-5 font-mono text-xs tracking-[0.25em] uppercase">
                            Under the hood
                        </p>
                        <h2 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance md:text-5xl">
                            Proven tools, composed into one instrument.
                        </h2>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {STACK.map((item) => (
                        <SpotlightCard key={item.title} className={item.span}>
                            <div className="flex h-full flex-col p-6 md:p-7">
                                <p className="text-muted-foreground mb-6 font-mono text-[10px] tracking-[0.25em]">
                                    {item.tag}
                                </p>
                                <h3 className="mb-2 text-lg font-medium tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
