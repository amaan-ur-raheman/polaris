"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll } from "motion/react";
import { SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "./spotlight-card";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EASE = [0.16, 1, 0.3, 1] as const;

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: EASE },
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image src="/logo.svg" alt="Polaris logo" width={28} height={28} priority />
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Polaris
      </span>
    </div>
  );
}

// ---------------------------------------------------------------- Navigation

function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Polaris home">
          <LogoMark />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            ["Features", "#features"],
            ["Process", "#process"],
            ["Pricing", "#pricing"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SignUpButton mode="modal">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Button>
          </SignUpButton>
          <SignUpButton mode="modal">
            <Button className="bg-foreground text-background hover:bg-foreground/90 h-9 px-4 text-sm font-medium">
              Get started
            </Button>
          </SignUpButton>
        </div>
      </div>
    </motion.nav>
  );
}

// --------------------------------------------------------------- Hero window

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
        {/* Title bar */}
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

        {/* Body */}
        <div className="grid md:grid-cols-[220px_1.1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Chat */}
          <div className="p-4 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Chat
            </p>
            <div className="rounded-lg bg-accent border border-border p-2.5 text-xs text-foreground/90">
              Add a pricing section with three tiers.
            </div>
            <div className="rounded-lg border border-border p-2.5 space-y-2">
              <div className="flex items-center gap-1.5 text-ring">
                <Sparkles className="w-3 h-3" />
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

          {/* Editor */}
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

          {/* Preview */}
          <div className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Preview
            </p>
            <div className="rounded-lg border border-border bg-white/[0.02] p-3 space-y-2.5">
              <div className="h-2 w-1/3 rounded-full bg-white/10" />
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-md border p-2.5 space-y-1.5",
                    i === 1 ? "border-ring/50 bg-ring/[0.06]" : "border-border"
                  )}
                >
                  <div className="h-1.5 w-8 rounded-full bg-white/15" />
                  <div className="h-3 w-14 rounded-sm bg-white/25" />
                  <div className="h-1 w-full rounded-full bg-white/[0.08]" />
                  <div className="h-1 w-2/3 rounded-full bg-white/[0.08]" />
                  <div
                    className={cn(
                      "h-4 w-16 rounded-md mt-1",
                      i === 1 ? "bg-ring/70" : "bg-white/10"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 h-7 border-t border-border bg-background/60 font-mono text-[10px] text-muted-foreground">
          <span>* WebContainer — ready</span>
          <span>main* ↑2</span>
        </div>
      </motion.div>
    </div>
  );
}

// --------------------------------------------------------------------- Hero

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-40 pb-24 px-6"
    >
      {/* Grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_75%)]"
      />
      {/* Accent glow */}
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
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 h-12 px-7 font-medium group active:scale-[0.98] transition-transform"
              >
                Start building free
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </SignUpButton>
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

// ------------------------------------------------------------------- Marquee

const MARQUEE_ITEMS = [
  "AI code generation",
  "WebContainer runtime",
  "CodeMirror 6 editor",
  "xterm.js terminal",
  "GitHub import / export",
  "One-click deploy",
];

function Marquee() {
  const row = (hidden: boolean) => (
    <div
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-10">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground whitespace-nowrap">
            {item}
          </span>
          <span className="text-ring text-[10px]">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="border-y border-border py-4 overflow-hidden">
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------- Features

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

function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
        <motion.div {...reveal} className="lg:sticky lg:top-32 self-start">
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

// -------------------------------------------------------------- How it works

const STEPS = [
  {
    step: "01",
    title: "Describe",
    description: "Tell the AI what you want to build in plain English.",
  },
  {
    step: "02",
    title: "Watch",
    description: "See the agent create every file, component, and route.",
  },
  {
    step: "03",
    title: "Preview",
    description: "Your app boots instantly in the browser with hot reload.",
  },
  {
    step: "04",
    title: "Iterate",
    description: "Chat to refine, add features, or fix issues as it runs.",
  },
  {
    step: "05",
    title: "Ship",
    description: "Deploy or export to GitHub when it's ready.",
  },
];

function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const distance = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.fromTo(
        ".process-progress",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${distance}`,
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="process"
      className="relative h-[100dvh] overflow-hidden bg-card"
    >
      <div ref={trackRef} className="flex h-full items-center px-8 gap-16 md:gap-24">
        <div className="w-[70vw] md:w-[42vw] shrink-0 flex items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-ring mb-5">
              Process
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.02] text-balance">
              Idea to app in five moves.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground max-w-md">
              Keep scrolling — the whole workflow fits on one screen.
            </p>
          </div>
        </div>

        {STEPS.map((step) => (
          <div
            key={step.step}
            className="w-[78vw] md:w-[32vw] shrink-0 flex flex-col justify-center"
          >
            <span
              className="block text-8xl md:text-[10rem] font-semibold leading-none mb-6 text-transparent select-none"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.16)" }}
            >
              {step.step}
            </span>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Step {step.step}
            </p>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              {step.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Progress hairline */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-px bg-border overflow-hidden">
        <div className="process-progress h-full w-full bg-ring origin-left" />
      </div>
    </section>
  );
}

// ----------------------------------------------------------------- Under the hood

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

function StackSection() {
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

// ------------------------------------------------------------------ Pricing

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

function PricingSection() {
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------- CTA

function CTASection() {
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
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 h-14 px-9 text-base font-medium group active:scale-[0.98] transition-transform"
            >
              Start building free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
        </div>
      </motion.div>
    </section>
  );
}

// ------------------------------------------------------------------- Footer

function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" aria-label="Polaris home">
          <LogoMark />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/projects"
            className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Open app
          </Link>
          <SignUpButton mode="modal">
            <button className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Create account
            </button>
          </SignUpButton>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} Polaris
        </p>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------- Page

export function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans antialiased select-text overflow-x-clip">
      {/* Film grain */}
      <div
        aria-hidden
        className="fixed inset-0 z-[100] pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />
      <Navigation />
      <main>
        <HeroSection />
        <Marquee />
        <FeaturesSection />
        <HowItWorksSection />
        <StackSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
