"use client";

import { useAuth } from "@clerk/nextjs";

import { LandingPage } from "@/features/landing/components";
import { Loader2 } from "lucide-react";

export const UnauthenticatedView = () => {
    const { isLoaded } = useAuth();

    // Show loading state while checking auth
    if (!isLoaded) {
        return (
            <div className="bg-background flex min-h-screen items-center justify-center">
                <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Show landing page for unauthenticated users
    return <LandingPage />;
};
