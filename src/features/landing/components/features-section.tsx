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
    description:
      "Ship to Vercel with one click and share a live URL in seconds — not minutes.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="lg:sticky lg:top-32 self-start"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ring mb-5">
            Capabilities
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-balance">
            Everything a full build needs.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed max-w-sm">
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
              className="group grid grid-cols-[3rem_1fr] gap-4 md:gap-6 border-t border-border last:border-b py-7 md:py-8 hover:bg-white/[0.02] transition-colors"
            >
              <span className="font-mono text-sm text-muted-foreground group-hover:text-ring transition-colors pt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg md:text-xl font-medium tracking-tight">
                    {feature.title}
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-[opacity,transform]" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-lg">
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
