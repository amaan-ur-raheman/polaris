"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EASE } from "./constants";

const FEATURES = [
    {
        title: "AI code generation",
        description:
            "Describe features in plain English. The agent writes the files, wires the logic, and edits its own work until it runs.",
    },
    {
        title: "Professional editor",
        description:
            "CodeMirror 6 with syntax highlighting for 20+ languages, intelligent completions, and inline error detection.",
    },
    {
        title: "Integrated terminal",
        description:
            "A full xterm.js terminal with command history. Run npm scripts and build commands without leaving the tab.",
    },
    {
        title: "Live preview",
        description:
            "WebContainer runs Node.js in your browser. Hot module reloading gives instant feedback on every change.",
    },
    {
        title: "GitHub integration",
        description:
            "Import existing repositories or push your creations back. Your normal version-control workflow, intact.",
    },
    {
        title: "Instant deploy",
        description: "Ship to Vercel with one click and share a live URL in seconds — not minutes.",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="relative px-6 py-28 md:py-36">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="self-start lg:sticky lg:top-32"
                >
                    <p className="text-ring mb-5 font-mono text-xs tracking-[0.25em] uppercase">
                        Capabilities
                    </p>
                    <h2 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance md:text-5xl">
                        Everything a full build needs.
                    </h2>
                    <p className="text-muted-foreground mt-5 max-w-sm leading-relaxed">
                        A complete development environment in the browser. No setup, no
                        configuration — just a prompt and a running app.
                    </p>
                </motion.div>

                <div>
                    {FEATURES.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                            className="group border-border grid grid-cols-[3rem_1fr] gap-4 border-t py-7 transition-colors last:border-b hover:bg-white/[0.02] md:gap-6 md:py-8"
                        >
                            <span className="text-muted-foreground group-hover:text-ring pt-1 font-mono text-sm transition-colors">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div>
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-lg font-medium tracking-tight md:text-xl">
                                        {feature.title}
                                    </h3>
                                    <ArrowUpRight className="text-muted-foreground h-5 w-5 -translate-x-1 translate-y-1 opacity-0 transition-[opacity,transform] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                                </div>
                                <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
