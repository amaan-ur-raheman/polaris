"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function SpotlightCard({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const rect = divRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group bg-background border-border relative flex flex-col overflow-hidden rounded-xl border transition-colors hover:border-white/20",
                className,
            )}
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                    background: `radial-gradient(480px circle at ${position.x}px ${position.y}px, var(--ring), transparent 40%)`,
                    opacity: opacity * 0.08,
                }}
            />
            {children}
        </div>
    );
}
