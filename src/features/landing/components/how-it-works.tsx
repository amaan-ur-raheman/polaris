"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE } from "./constants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

export function HowItWorksSection() {
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

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-px bg-border overflow-hidden">
        <div className="process-progress h-full w-full bg-ring origin-left" />
      </div>
    </section>
  );
}
