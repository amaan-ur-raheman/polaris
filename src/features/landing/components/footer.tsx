"use client";

import Link from "next/link";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import { LogoMark } from "./navigation";

export function Footer() {
    const { isSignedIn } = useAuth();

    return (
        <footer className="border-border border-t px-6 py-10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
                <Link href="/" aria-label="Polaris home">
                    <LogoMark />
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        href="/projects"
                        className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-[0.18em] uppercase transition-colors"
                    >
                        Open app
                    </Link>
                    {isSignedIn ? (
                        <Link
                            href="/projects"
                            className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-[0.18em] uppercase transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <SignUpButton mode="modal">
                            <button className="text-muted-foreground hover:text-foreground cursor-pointer font-mono text-xs tracking-[0.18em] uppercase transition-colors">
                                Create account
                            </button>
                        </SignUpButton>
                    )}
                </div>

                <p className="text-muted-foreground font-mono text-xs">
                    © {new Date().getFullYear()} Polaris
                </p>
            </div>
        </footer>
    );
}
