"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    feature?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(
            `[ErrorBoundary${this.props.feature ? `: ${this.props.feature}` : ""}]`,
            error,
            errorInfo,
        );
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <AlertTriangle className="text-destructive size-8" />
                    <div>
                        <h3 className="text-lg font-semibold">
                            {this.props.feature
                                ? `${this.props.feature} crashed`
                                : "Something went wrong"}
                        </h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {this.state.error?.message || "An unexpected error occurred"}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={this.handleReset}>
                        <RefreshCw className="mr-2 size-4" />
                        Try again
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
