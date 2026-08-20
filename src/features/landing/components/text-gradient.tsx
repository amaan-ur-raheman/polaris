"use client";

import { cn } from "@/lib/utils";

export function TextGradient({
  children,
  className,
  from = "from-blue-400",
  via = "via-cyan-400",
  to = "to-blue-500",
}: {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
}) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        from,
        via,
        to,
        className
      )}
    >
      {children}
    </span>
  );
}
