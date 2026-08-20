"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { SignUpButton } from "@clerk/nextjs";
import {
  Sparkles,
  Code2,
  Terminal,
  GitBranch,
  Eye,
  Zap,
  ArrowRight,
  Check,
  ChevronRight,
  Play,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "./background-beams";
import { SpotlightCard } from "./spotlight-card";
import { TextGradient } from "./text-gradient";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Lazy load Three.js scene
const HeroScene = dynamic(
  () => import("./hero-scene").then((mod) => ({ default: mod.HeroScene })),
  { ssr: false }
);

// Navigation
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">
            Polaris
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <SignUpButton mode="modal">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              Sign in
            </Button>
          </SignUpButton>
          <SignUpButton mode="modal">
            <Button className="bg-white text-zinc-950 hover:bg-zinc-200 px-4 h-9 text-sm font-medium">
              Get started
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </SignUpButton>
        </div>
      </div>
    </motion.nav>
  );
}

// Hero Section
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Three.js Background */}
      <HeroScene />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-transparent to-zinc-950 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 via-transparent to-zinc-950/40 z-10" />

      {/* Content */}
      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-20 max-w-5xl mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Now in public beta
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-[0.95]"
        >
          Build with
          <br />
          <TextGradient>intelligence</TextGradient>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Describe what you want to build. Watch AI create complete applications
          in your browser with live preview and instant deployment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="bg-white text-zinc-950 hover:bg-zinc-200 px-6 h-12 text-sm font-medium group"
            >
              Start building free
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
          <Button
            variant="outline"
            size="lg"
            className="border-zinc-800 text-zinc-300 hover:bg-zinc-800/50 px-6 h-12 text-sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Watch demo
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-zinc-500"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "AI Code Generation",
      description:
        "Describe features in plain English and watch AI create complete, working code with context awareness.",
    },
    {
      icon: Code2,
      title: "Professional Editor",
      description:
        "CodeMirror 6 with syntax highlighting for 20+ languages, intelligent completions, and error detection.",
    },
    {
      icon: Terminal,
      title: "Integrated Terminal",
      description:
        "Full xterm.js terminal with command history, running npm scripts and build commands directly.",
    },
    {
      icon: Eye,
      title: "Live Preview",
      description:
        "WebContainer-powered in-browser Node.js runtime with hot module reloading and instant feedback.",
    },
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description:
        "Import existing projects from GitHub or push your creations back. Full version control workflow.",
    },
    {
      icon: Zap,
      title: "Instant Deploy",
      description:
        "Deploy to Vercel with one click. Share your creations with the world in seconds.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-32 px-6 bg-zinc-950"
    >
      <BackgroundBeams />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Everything you need
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            A complete development environment that runs in your browser. No
            setup, no configuration, just code.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <SpotlightCard key={feature.title} className="feature-card p-6">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-zinc-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      step: "01",
      title: "Describe",
      description: "Tell the AI what you want to build in plain English.",
    },
    {
      step: "02",
      title: "Watch",
      description: "See AI create all the files, components, and logic.",
    },
    {
      step: "03",
      title: "Preview",
      description: "Your app runs instantly in the browser with hot reload.",
    },
    {
      step: "04",
      title: "Iterate",
      description: "Chat with AI to refine, add features, or fix issues.",
    },
    {
      step: "05",
      title: "Ship",
      description: "Deploy or export to GitHub when you're ready.",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative h-[100dvh] overflow-hidden bg-zinc-900"
    >
      <div ref={trackRef} className="flex h-full items-center px-8 gap-20">
        {/* Section intro */}
        <div className="w-[50vw] shrink-0 flex items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              From idea to app
            </h2>
            <p className="text-xl text-zinc-400 max-w-md">
              Five simple steps to turn your vision into reality.
            </p>
          </div>
        </div>

        {/* Steps */}
        {steps.map((step) => (
          <div
            key={step.step}
            className="w-[35vw] shrink-0 flex flex-col justify-center"
          >
            <span className="text-8xl font-bold text-zinc-800/50 mb-4">
              {step.step}
            </span>
            <h3 className="text-3xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-lg text-zinc-400 max-w-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Bento Grid Section
function BentoSection() {
  const items = [
    {
      title: "AI Code Generation",
      description:
        "Describe features in plain English and watch AI create complete code.",
      icon: Sparkles,
      colSpan: "md:col-span-2",
      gradient: "from-blue-500/20 to-cyan-500/10",
    },
    {
      title: "Live Preview",
      description: "WebContainer-powered runtime with hot module reloading.",
      icon: Eye,
      colSpan: "md:col-span-1",
      rowSpan: "md:row-span-2",
      gradient: "from-purple-500/20 to-pink-500/10",
    },
    {
      title: "Integrated Terminal",
      description: "Full xterm.js terminal with command history.",
      icon: Terminal,
      colSpan: "md:col-span-1",
      gradient: "from-emerald-500/20 to-teal-500/10",
    },
    {
      title: "GitHub Integration",
      description: "Import and export projects with full version control.",
      icon: GitBranch,
      colSpan: "md:col-span-1",
      gradient: "from-orange-500/20 to-amber-500/10",
    },
    {
      title: "Instant Deploy",
      description: "Deploy to Vercel with one click. Share in seconds.",
      icon: Zap,
      colSpan: "md:col-span-2",
      gradient: "from-cyan-500/20 to-blue-500/10",
    },
  ];

  return (
    <section className="relative py-32 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Built for developers
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Every tool you need, integrated seamlessly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                "relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden group hover:border-zinc-700 transition-colors",
                item.colSpan,
                item.rowSpan
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  item.gradient
                )}
              />
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out Polaris.",
      features: [
        "3 projects",
        "AI code generation",
        "Live preview",
        "1 GB storage",
      ],
      cta: "Get started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$20",
      description: "For serious developers.",
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

  return (
    <section id="pricing" className="relative py-32 px-6 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Simple pricing
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Start free, upgrade when you need more.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                "relative p-8 rounded-2xl border transition-colors",
                plan.popular
                  ? "bg-zinc-800 border-blue-500/50"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-xs font-medium text-white">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "$0" && (
                    <span className="text-zinc-500">/month</span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-zinc-300"
                  >
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <SignUpButton mode="modal">
                <Button
                  className={cn(
                    "w-full",
                    plan.popular
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
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

// CTA Section
function CTASection() {
  return (
    <section className="relative py-32 px-6 bg-zinc-950 overflow-hidden">
      <BackgroundBeams />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Ready to build?
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10">
            Join thousands of developers building with AI. Start free, no credit
            card required.
          </p>
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="bg-white text-zinc-950 hover:bg-zinc-200 px-8 h-14 text-base font-medium group"
            >
              Start building free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-6 bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-zinc-400">Polaris</span>
        </div>

        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Contact"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        <p className="text-sm text-zinc-600">
          Built with AI, for developers.
        </p>
      </div>
    </footer>
  );
}

// Main Landing Page
export function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BentoSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
