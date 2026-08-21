"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthRedirect({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.replace("/projects");
        }
    }, [isSignedIn, isLoaded, router]);

    if (isLoaded && isSignedIn) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-sm text-muted-foreground">Redirecting…</p>
            </div>
        );
    }

    return <>{children}</>;
}
