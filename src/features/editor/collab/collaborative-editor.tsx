"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { EditorView } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";

import { customTheme } from "../extensions/theme";
import { getLanguageExtension } from "../extensions/language-extension";
import { minimap } from "../extensions/minimap";
import { customSetup } from "../extensions/custom-setup";
import { suggestion } from "../extensions/suggestion";
import { quickEdit } from "../extensions/quick-edit";
import { selectionTooltip } from "../extensions/selection-tooltip";
import { ConvexSyncProvider } from "./convex-provider";
import { PresenceOverlay } from "./presence-overlay";

interface CollaborativeEditorProps {
    fileName: string;
    fileId: string;
    projectId: string;
    initialContent: string;
    onContentChange?: (content: string) => void;
}

export const CollaborativeEditor = ({
    fileName,
    fileId,
    projectId,
    initialContent,
    onContentChange,
}: CollaborativeEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const yDocRef = useRef<Y.Doc | null>(null);
    const providerRef = useRef<ConvexSyncProvider | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [peerCount, setPeerCount] = useState(0);

    const languageExtension = getLanguageExtension(fileName);

    const initEditor = useCallback(async () => {
        if (!editorRef.current || viewRef.current) return;

        // Create Yjs document
        const yDoc = new Y.Doc();
        yDocRef.current = yDoc;

        // Create provider
        const provider = new ConvexSyncProvider({
            fileId,
            projectId,
            convexClient: null, // Will be set by parent
            api: null, // Will be set by parent
        });
        providerRef.current = provider;

        // Create Yjs text type
        const yText = yDoc.getText("content");

        // Initialize with content if document is new
        if (yText.length === 0 && initialContent) {
            yText.insert(0, initialContent);
        }

        // Create y-codemirror binding
        const binding = yCollab(yText, provider);

        // Create editor
        const view = new EditorView({
            parent: editorRef.current,
            extensions: [
                oneDark,
                customTheme,
                customSetup,
                languageExtension,
                suggestion(fileName),
                quickEdit(fileName),
                selectionTooltip(),
                keymap.of([indentWithTab]),
                minimap(),
                indentationMarkers(),
                binding,
                // Listen for changes
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        const content = update.state.doc.toString();
                        onContentChange?.(content);
                    }
                }),
            ],
        });

        viewRef.current = view;
        setIsReady(true);

        return () => {
            view.destroy();
            yDoc.destroy();
            provider.destroy();
        };
    }, [fileId, projectId, initialContent, fileName, languageExtension, onContentChange]);

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        initEditor().then((cleanupFn) => {
            cleanup = cleanupFn;
        });

        return () => {
            cleanup?.();
        };
    }, [initEditor]);

    return (
        <div className="relative size-full">
            <div ref={editorRef} className="bg-background size-full pl-4" />
            {isReady && (
                <PresenceOverlay
                    fileId={fileId}
                    projectId={projectId}
                    onPeerCountChange={setPeerCount}
                />
            )}
            {peerCount > 0 && (
                <div className="text-muted-foreground bg-background/80 absolute top-2 right-4 rounded px-2 py-1 text-xs">
                    {peerCount + 1} editors
                </div>
            )}
        </div>
    );
};
