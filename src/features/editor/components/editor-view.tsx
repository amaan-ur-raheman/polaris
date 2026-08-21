import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AlertTriangleIcon } from "lucide-react";

import { useFile, useUpdateFile } from "@/features/projects/hooks/use-files";

import { useEditor } from "../hooks/use-editor";
import { useCodeReview } from "../hooks/use-code-review";
import { FileBreadCrumbs } from "./file-breadcrumbs";
import { TopNavigation } from "./top-navigation";
import { CodeEditor } from "./code-editor";
import { ReviewPanel } from "./review-panel";
import { Id } from "@convex/_generated/dataModel";

const SAVE_DEBOUNCE_MS = 1500;
const REVIEW_DEBOUNCE_MS = 2000;

/**
 * Custom hook for debounced file saving.
 * Separated from code review to allow independent debounce timers.
 */
function useDebouncedSave(updateFile: (args: { id: Id<"files">; content: string }) => void) {
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const debouncedSave = useCallback(
        (fileId: Id<"files">, content: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                updateFile({ id: fileId, content });
            }, SAVE_DEBOUNCE_MS);
        },
        [updateFile],
    );

    return debouncedSave;
}

export const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { activeTabId } = useEditor(projectId);
    const activeFile = useFile(activeTabId);
    const updateFile = useUpdateFile();
    const debouncedSave = useDebouncedSave(updateFile);
    const { suggestions, isReviewing, reviewedFile, requestReview, clearReview } = useCodeReview({
        debounceMs: REVIEW_DEBOUNCE_MS,
    });

    const isActiveBinaryFile = activeFile && activeFile.storageId;
    const isActiveTextFile = activeFile && !activeFile.storageId;

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center">
                <TopNavigation projectId={projectId} />
            </div>
            {activeTabId && <FileBreadCrumbs projectId={projectId} />}
            {!activeFile && (
                <div className="flex size-full items-center justify-center">
                    <Image
                        src={"/logo-alt.svg"}
                        alt="Polaris"
                        width={50}
                        height={50}
                        className="opacity-25"
                    />
                </div>
            )}
            {isActiveTextFile && (
                <CodeEditor
                    key={activeFile._id}
                    fileName={activeFile.name}
                    initialValue={activeFile.content}
                    onChange={(content: string) => {
                        debouncedSave(activeFile._id, content);
                        requestReview(activeFile.name, content);
                    }}
                />
            )}
            {isActiveBinaryFile && (
                <div className="flex size-full items-center justify-center">
                    <div className="flex max-w-md flex-col items-center gap-2.5 text-center">
                        <AlertTriangleIcon className="size-10 text-yellow-500" />
                        <p className="text-sm">
                            The file is not displayed in the text editor because it is either binary
                            or uses unsupported text encoding.
                        </p>
                    </div>
                </div>
            )}
            <ReviewPanel
                suggestions={suggestions}
                isReviewing={isReviewing}
                reviewedFile={reviewedFile}
                onDismiss={clearReview}
            />
        </div>
    );
};
