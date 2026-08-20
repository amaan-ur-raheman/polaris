import { useEffect, useRef } from "react";
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

const DEBOUNCE_MS = 1500;

export const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { activeTabId } = useEditor(projectId);
    const activeFile = useFile(activeTabId);
    const updateFile = useUpdateFile();
    const timeoutRef = useRef<NodeJS.Timeout>(null);
    const {
        suggestions,
        isReviewing,
        reviewedFile,
        requestReview,
        clearReview,
    } = useCodeReview({ debounceMs: 2000 });

    const isActiveBinaryFile = activeFile && activeFile.storageId;
    const isActiveTextFile = activeFile && !activeFile.storageId;

    // Cleanup pending debounced updates on unmount or file change
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [activeTabId]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center">
                <TopNavigation projectId={projectId} />
            </div>
            {activeTabId && <FileBreadCrumbs projectId={projectId} />}
            {!activeFile && (
                <div className="size-full flex items-center justify-center">
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
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }

                        timeoutRef.current = setTimeout(() => {
                            updateFile({ id: activeFile._id, content });
                            requestReview(
                                activeFile.name,
                                content,
                            );
                        }, DEBOUNCE_MS);
                    }}
                />
            )}
            {isActiveBinaryFile && (
                <div className="size-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2.5 max-w-md text-center">
                        <AlertTriangleIcon className="size-10 text-yellow-500" />
                        <p className="text-sm">
                            The file is not displayed in the text editor because
                            it is either binary or uses unsupported text
                            encoding.
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
