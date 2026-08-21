import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

import { getItemPadding } from "./constants";

export const LoadingRow = ({ className, level = 0 }: { className?: string; level?: number }) => {
    return (
        <div
            className={cn("text-muted-foreground flex h-5.5 items-center", className)}
            style={{ paddingLeft: getItemPadding(level, true) }}
        >
            <Spinner className="text-ring ml-0.5 size-4" />
        </div>
    );
};
