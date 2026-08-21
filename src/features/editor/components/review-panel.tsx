"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle, X, Loader2 } from "lucide-react";
import type { CodeReviewSuggestion } from "../hooks/use-code-review";

interface ReviewPanelProps {
    suggestions: CodeReviewSuggestion[];
    isReviewing: boolean;
    reviewedFile: string | null;
    onDismiss: () => void;
    onNavigate?: (line: number) => void;
    className?: string;
}

const SEVERITY_CONFIG = {
    error: {
        icon: AlertTriangle,
        color: "text-destructive",
        bg: "bg-destructive/10",
        label: "Error",
    },
    warning: {
        icon: AlertTriangle,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        label: "Warning",
    },
    info: {
        icon: Info,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        label: "Info",
    },
} as const;

export function ReviewPanel({
    suggestions,
    isReviewing,
    reviewedFile,
    onDismiss,
    onNavigate,
    className,
}: ReviewPanelProps) {
    if (!reviewedFile && !isReviewing) {
        return null;
    }

    return (
        <div className={cn("bg-background/95 border-t backdrop-blur", className)}>
            <div className="flex items-center justify-between border-b px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                    {isReviewing ? (
                        <>
                            <Loader2 className="text-muted-foreground size-3.5 animate-spin" />
                            <span className="text-muted-foreground">Reviewing {reviewedFile}…</span>
                        </>
                    ) : suggestions.length === 0 ? (
                        <>
                            <CheckCircle className="size-3.5 text-green-500" />
                            <span className="text-muted-foreground">
                                No issues found in {reviewedFile}
                            </span>
                        </>
                    ) : (
                        <span className="text-muted-foreground">
                            {suggestions.length} suggestion
                            {suggestions.length !== 1 ? "s" : ""} in {reviewedFile}
                        </span>
                    )}
                </div>
                <button
                    onClick={onDismiss}
                    aria-label="Dismiss review panel"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="size-3.5" />
                </button>
            </div>

            {!isReviewing && suggestions.length > 0 && (
                <div className="max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, i) => {
                        const config = SEVERITY_CONFIG[suggestion.severity];
                        const Icon = config.icon;

                        return (
                            <button
                                key={i}
                                onClick={() => suggestion.line && onNavigate?.(suggestion.line)}
                                className={cn(
                                    "hover:bg-accent/50 flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition-colors",
                                    suggestion.line && "cursor-pointer",
                                )}
                            >
                                <Icon className={cn("mt-0.5 size-3.5 shrink-0", config.color)} />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cn(
                                                "text-[10px] font-medium uppercase",
                                                config.color,
                                            )}
                                        >
                                            {config.label}
                                        </span>
                                        {suggestion.line && (
                                            <span className="text-muted-foreground text-[10px]">
                                                Line {suggestion.line}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground mt-0.5 text-xs">
                                        {suggestion.message}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
