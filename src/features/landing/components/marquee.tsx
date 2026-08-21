"use client";

const MARQUEE_ITEMS = [
  "AI code generation",
  "WebContainer runtime",
  "CodeMirror 6 editor",
  "xterm.js terminal",
  "GitHub import / export",
  "One-click deploy",
];

export function Marquee() {
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
