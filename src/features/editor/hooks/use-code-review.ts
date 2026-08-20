"use client";

import { useCallback, useRef, useState } from "react";
import ky from "ky";

export interface CodeReviewSuggestion {
    line: number | null;
    severity: "error" | "warning" | "info";
    message: string;
}

interface UseCodeReviewOptions {
    debounceMs?: number;
}

export function useCodeReview(options: UseCodeReviewOptions = {}) {
    const { debounceMs = 2000 } = options;
    const [suggestions, setSuggestions] = useState<CodeReviewSuggestion[]>([]);
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewedFile, setReviewedFile] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const requestReview = useCallback(
        (filename: string, content: string, language?: string) => {
            // Clear previous timer
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Don't review empty files
            if (!content.trim()) {
                setSuggestions([]);
                setReviewedFile(null);
                return;
            }

            setReviewedFile(filename);
            setIsReviewing(true);

            timerRef.current = setTimeout(async () => {
                try {
                    const { suggestions } = await ky
                        .post("/api/review", {
                            json: { filename, content, language },
                        })
                        .json<{ suggestions: CodeReviewSuggestion[] }>();

                    setSuggestions(suggestions);
                } catch {
                    setSuggestions([]);
                } finally {
                    setIsReviewing(false);
                }
            }, debounceMs);
        },
        [debounceMs],
    );

    const clearReview = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setSuggestions([]);
        setReviewedFile(null);
        setIsReviewing(false);
    }, []);

    return {
        suggestions,
        isReviewing,
        reviewedFile,
        requestReview,
        clearReview,
    };
}
