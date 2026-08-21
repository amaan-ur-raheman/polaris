import { useEffect, useMemo, useRef } from "react";

import { oneDark } from "@codemirror/theme-one-dark";
import { indentWithTab } from "@codemirror/commands";
import { keymap, EditorView } from "@codemirror/view";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";

import { customTheme } from "../extensions/theme";
import { getLanguageExtension } from "../extensions/language-extension";
import { minimap } from "../extensions/minimap";
import { customSetup } from "../extensions/custom-setup";
import { suggestion } from "../extensions/suggestion";
import { quickEdit } from "../extensions/quick-edit";
import { selectionTooltip } from "../extensions/selection-tooltip";

interface CodeEditorProps {
    fileName: string;
    initialValue?: string;
    onChange: (value: string) => void;
}

export const CodeEditor = ({ fileName, initialValue = "", onChange }: CodeEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);

    const languageExtension = useMemo(() => getLanguageExtension(fileName), [fileName]);

    useEffect(() => {
        if (!editorRef.current) return;

        const view = new EditorView({
            doc: initialValue,
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
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                }),
            ],
        });

        viewRef.current = view;

        return () => {
            view.destroy();
        };
    }, [languageExtension]);

    return <div ref={editorRef} className="bg-background size-full pl-4" />;
};
