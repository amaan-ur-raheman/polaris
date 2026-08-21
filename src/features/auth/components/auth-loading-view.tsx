import { Spinner } from "@/components/ui/spinner";

export const AuthLoadingView = () => {
    return (
        <div
            className="bg-background flex h-screen items-center justify-center"
            role="status"
            aria-live="polite"
            aria-label="Loading authentication"
        >
            <Spinner className="text-ring size-6" />
            <span className="sr-only">Loading authentication, please wait…</span>
        </div>
    );
};
