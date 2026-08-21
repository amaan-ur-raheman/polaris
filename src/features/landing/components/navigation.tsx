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
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Polaris
      </span>
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
          {isSignedIn ? (
            <Link
              href="/projects"
              className="inline-flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 h-9 px-4 text-sm font-medium rounded-md transition-colors"
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
