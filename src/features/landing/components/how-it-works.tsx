"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
                },
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            id="process"
            className="bg-card relative h-[100dvh] overflow-hidden"
        >
            <div ref={trackRef} className="flex h-full items-center gap-16 px-8 md:gap-24">
                <div className="flex w-[70vw] shrink-0 items-center md:w-[42vw]">
                    <div>
                        <p className="text-ring mb-5 font-mono text-xs tracking-[0.25em] uppercase">
                            Process
                        </p>
                        <h2 className="text-4xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance md:text-6xl">
                            Idea to app in five moves.
                        </h2>
                        <p className="text-muted-foreground mt-5 max-w-md text-lg">
                            Keep scrolling — the whole workflow fits on one screen.
                        </p>
                    </div>
                </div>

                {STEPS.map((step) => (
                    <div
                        key={step.step}
                        className="flex w-[78vw] shrink-0 flex-col justify-center md:w-[32vw]"
                    >
                        <span
                            className="mb-6 block text-8xl leading-none font-semibold text-transparent select-none md:text-[10rem]"
                            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.16)" }}
                        >
                            {step.step}
                        </span>
                        <p className="text-muted-foreground mb-3 font-mono text-xs tracking-[0.25em] uppercase">
                            Step {step.step}
                        </p>
                        <h3 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
                            {step.title}
                        </h3>
                        <p className="text-muted-foreground max-w-sm text-lg leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-border absolute bottom-10 left-1/2 h-px w-48 -translate-x-1/2 overflow-hidden">
                <div className="process-progress bg-ring h-full w-full origin-left" />
            </div>
        </section>
    );
}
