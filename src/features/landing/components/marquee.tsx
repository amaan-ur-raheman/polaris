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
        <div aria-hidden={hidden} className="flex shrink-0 items-center gap-10 pr-10">
            {MARQUEE_ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-10">
                    <span className="text-muted-foreground font-mono text-xs tracking-[0.25em] whitespace-nowrap uppercase">
                        {item}
                    </span>
                    <span className="text-ring text-[10px]">✦</span>
                </span>
            ))}
        </div>
    );

    return (
        <div className="border-border overflow-hidden border-y py-4">
            <div className="animate-marquee flex w-max">
                {row(false)}
                {row(true)}
            </div>
        </div>
    );
}
