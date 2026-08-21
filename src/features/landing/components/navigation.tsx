"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useAuth, SignUpButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EASE } from "./constants";

export function LogoMark({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2.5", className)}>
            <Image src="/logo.svg" alt="Polaris logo" width={28} height={28} priority />
            <span className="text-foreground text-lg font-semibold tracking-tight">Polaris</span>
        </div>
    );
}

export function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const { isSignedIn } = useAuth();

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
                "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
                scrolled
                    ? "bg-background/80 border-border border-b backdrop-blur-xl"
                    : "border-b border-transparent bg-transparent",
            )}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <Link href="/" aria-label="Polaris home">
                    <LogoMark />
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    {[
                        ["Features", "#features"],
                        ["Process", "#process"],
                        ["Pricing", "#pricing"],
                    ].map(([label, href]) => (
                        <Link
                            key={label}
                            href={href}
                            className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-[0.18em] uppercase transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {isSignedIn ? (
                        <Link
                            href="/projects"
                            className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
