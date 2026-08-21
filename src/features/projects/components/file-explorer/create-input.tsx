import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";

import { getItemPadding } from "./constants";

export const CreateInput = ({
    type,
    level,
    onSubmit,
    onCancel,
}: {
    type: "file" | "folder";
    level: number;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}) => {
    const [value, setValue] = useState("");

    const handleSubmit = () => {
        const trimmedValue = value.trim();
        if (trimmedValue) {
            onSubmit(trimmedValue);
        } else {
            onCancel();
        }
    };

    return (
        <div
            className="bg-accent/30 flex h-5.5 w-full items-center gap-1"
            style={{ paddingLeft: getItemPadding(level, type === "file") }}
        >
            <div className="flex items-center gap-0.5">
                {type === "folder" && (
                    <ChevronRightIcon className="text-muted-foreground size-4 shrink-0" />
                )}
                {type === "file" && <FileIcon className="size-4" fileName={value} autoAssign />}
                {type === "folder" && <FolderIcon className="size-4" folderName={value} />}
            </div>
            <input
                autoFocus
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="focus:ring-ring flex-1 bg-transparent text-sm outline-none focus:ring-1 focus:ring-inset"
                onBlur={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSubmit();
                    } else if (e.key === "Escape") {
                        onCancel();
                    }
                }}
            />
        </div>
    );
};
