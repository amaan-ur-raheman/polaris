import { useRef } from "react";
import Image from "next/image";

import { useFile, useUpdateFile } from "@/features/projects/hooks/use-files";

import { useEditor } from "../hooks/use-editor";
import { FileBreadCrumbs } from "./file-breadcrumbs";
import { TopNavigation } from "./top-navigation";
import { CodeEditor } from "./code-editor";
import { Id } from "../../../../convex/_generated/dataModel";

const DEBOUNCE_MS = 1500;

export const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { activeTabId } = useEditor(projectId);
    const activeFile = useFile(activeTabId);
    const updateFile = useUpdateFile();
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    const isActiveBinaryFile = activeFile && activeFile.storageId;
    const isActiveTextFile = activeFile && !activeFile.storageId;

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
                        }, DEBOUNCE_MS);
                    }}
                />
            )}
            {isActiveBinaryFile && (
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
        </div>
    );
};
