"use client";

import Link from "next/link";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import { LogoMark } from "./navigation";

export function Footer() {
  const { isSignedIn } = useAuth();

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
          {isSignedIn ? (
            <Link
              href="/projects"
              className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <SignUpButton mode="modal">
              <button className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Create account
              </button>
            </SignUpButton>
          )}
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} Polaris
        </p>
      </div>
    </footer>
  );
}
