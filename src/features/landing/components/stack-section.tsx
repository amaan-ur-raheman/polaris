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
    description:
      "Multi-model agent tooling that plans, writes, and verifies its own changes.",
    span: "md:col-span-1",
  },
  {
    tag: "DATA",
    title: "Convex",
    description:
      "Realtime database with optimistic updates — files sync as you type.",
    span: "md:col-span-2",
  },
];

export function StackSection() {
  return (
    <section className="relative py-28 md:py-36 px-6 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div {...reveal} className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-ring mb-5">
              Under the hood
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-balance">
              Proven tools, composed into one instrument.
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STACK.map((item) => (
            <SpotlightCard key={item.title} className={item.span}>
              <div className="p-6 md:p-7 h-full flex flex-col">
                <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground mb-6">
                  {item.tag}
                </p>
                <h3 className="text-lg font-medium tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
