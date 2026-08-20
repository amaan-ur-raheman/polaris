"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LandingPage } from "@/features/landing/components";
import { Loader2 } from "lucide-react";

export const UnauthenticatedView = () => {
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Redirect to projects if already signed in
        if (isLoaded && isSignedIn) {
            router.push("/projects");
        }
    }, [isLoaded, isSignedIn, router]);

    // Show loading state while checking auth
    if (!mounted || !isLoaded) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Show landing page for unauthenticated users
    return <LandingPage />;
};
