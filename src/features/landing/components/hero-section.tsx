"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EASE } from "./constants";

const CODE = [
  [
    ["import", "text-ring"],
    [" { Pricing } ", "text-white/80"],
    ["from", "text-ring"],
    [" \"@/components/pricing\"", "text-emerald-400"],
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
    ["\"mx-auto py-24\"", "text-emerald-400"],
    [">", "text-white/60"],
  ],
  [
    ["      <", "text-white/60"],
    ["Pricing", "text-sky-300"],
    [" tiers", "text-yellow-200/90"],
    ["=", "text-white/60"],
    [" {[", "text-white/60"],
    ["\"free\"", "text-emerald-400"],
    [", ", "text-white/60"],
    ["\"pro\"", "text-emerald-400"],
    [", ", "text-white/60"],
    ["\"team\"", "text-emerald-400"],
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
        className="relative rounded-xl border border-border bg-card shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 h-11 border-b border-border bg-background/60">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <div className="flex-1 flex justify-center gap-2">
            <span className="font-mono text-[10px] px-2 py-1 rounded-md bg-accent text-foreground/80 border border-border">
              page.tsx
            </span>
            <span className="font-mono text-[10px] px-2 py-1 rounded-md text-muted-foreground border border-transparent">
              layout.tsx
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground border border-border rounded-full px-2.5 py-1">
            localhost:3000
          </span>
        </div>

        <div className="grid md:grid-cols-[220px_1.1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="p-4 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Chat
            </p>
            <div className="rounded-lg bg-accent border border-border p-2.5 text-xs text-foreground/90">
              Add a pricing section with three tiers.
            </div>
            <div className="rounded-lg border border-border p-2.5 space-y-2">
              <div className="flex items-center gap-1.5 text-ring">
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  Polaris
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-white/[0.07]" />
                <div className="h-1.5 w-5/6 rounded-full bg-white/[0.07]" />
                <div className="h-1.5 w-2/3 rounded-full bg-white/[0.07]" />
              </div>
              <div className="font-mono text-[10px] text-ring/90 pt-1">
                + pricing.tsx · + tiers.ts · ~ page.tsx
              </div>
            </div>
          </div>

          <div className="p-4 overflow-hidden">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Editor
            </p>
            <pre className="font-mono text-[11px] leading-5 overflow-hidden">
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
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Preview
            </p>
            <div className="rounded-lg border border-border bg-white/[0.02] p-3 space-y-2.5">
              <div className="h-2 w-1/3 rounded-full bg-white/10" />
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`rounded-md border p-2.5 space-y-1.5 ${
                    i === 1 ? "border-ring/50 bg-ring/[0.06]" : "border-border"
                  }`}
                >
                  <div className="h-1.5 w-8 rounded-full bg-white/15" />
                  <div className="h-3 w-14 rounded-sm bg-white/25" />
                  <div className="h-1 w-full rounded-full bg-white/[0.08]" />
                  <div className="h-1 w-2/3 rounded-full bg-white/[0.08]" />
                  <div
                    className={`h-4 w-16 rounded-md mt-1 ${
                      i === 1 ? "bg-ring/70" : "bg-white/10"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 h-7 border-t border-border bg-background/60 font-mono text-[10px] text-muted-foreground">
          <span>* WebContainer — ready</span>
          <span>main* ↑2</span>
        </div>
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const { isSignedIn } = useAuth();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-40 pb-24 px-6"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(ellipse_55%_60%_at_50%_-10%,var(--ring),transparent_65%)] opacity-[0.14]"
      />

      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-ring/30 bg-ring/[0.06] font-mono text-xs tracking-[0.14em] uppercase text-ring">
              <span className="w-1.5 h-1.5 rounded-full bg-ring animate-pulse" />
              Public beta
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[0.95] tracking-[-0.04em] text-balance"
          >
            Describe it.
            <br />
            <span className="text-muted-foreground">Watch it run.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            className="mt-7 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto text-pretty"
          >
            Polaris turns plain English into complete, running web apps —
            editor, terminal, and live preview in one browser tab.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
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
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 h-12 px-7 font-medium group active:scale-[0.98] transition-transform"
                >
                  Start building free
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
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
