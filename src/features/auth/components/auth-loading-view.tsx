import { Spinner } from "@/components/ui/spinner";

export const AuthLoadingView = () => {
    return (
        <div 
            className="flex items-center justify-center h-screen bg-background"
            role="status"
            aria-live="polite"
            aria-label="Loading authentication"
        >
            <Spinner className="size-6 text-ring" />
            <span className="sr-only">Loading authentication, please wait…</span>
        </div>
    );
};
