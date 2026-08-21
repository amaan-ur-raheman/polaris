import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "./use-editor-store";

describe("useEditorStore", () => {
    beforeEach(() => {
        // Reset the store between tests
        useEditorStore.setState({ tabs: new Map() });
    });

    describe("getTabState", () => {
        it("returns default state for unknown project", () => {
            const state = useEditorStore.getState();
            const tabState = state.getTabState("proj-1" as any);
            expect(tabState).toEqual({
                openTabs: [],
                activeTabId: null,
                previewTabId: null,
            });
        });
    });

    describe("openFile", () => {
        it("opens a file as preview", () => {
            useEditorStore.getState().openFile("proj-1" as any, "file-1" as any, { pinned: false });

            const state = useEditorStore.getState();
            const tabState = state.getTabState("proj-1" as any);
            expect(tabState.openTabs).toEqual(["file-1"]);
            expect(tabState.activeTabId).toBe("file-1");
            expect(tabState.previewTabId).toBe("file-1");
        });

        it("opens a file as pinned tab", () => {
            useEditorStore.getState().openFile("proj-1" as any, "file-1" as any, { pinned: true });

            const state = useEditorStore.getState();
            const tabState = state.getTabState("proj-1" as any);
            expect(tabState.openTabs).toEqual(["file-1"]);
            expect(tabState.activeTabId).toBe("file-1");
            expect(tabState.previewTabId).toBeNull();
        });

        it("replaces preview when opening new preview file", () => {
            const store = useEditorStore.getState();
            store.openFile("proj-1" as any, "file-1" as any, { pinned: false });
            store.openFile("proj-1" as any, "file-2" as any, { pinned: false });

            const state = useEditorStore.getState();
            const tabState = state.getTabState("proj-1" as any);
            expect(tabState.openTabs).toEqual(["file-2"]);
            expect(tabState.activeTabId).toBe("file-2");
            expect(tabState.previewTabId).toBe("file-2");
        });

        it("activates already open file without duplicating", () => {
            const store = useEditorStore.getState();
            store.openFile("proj-1" as any, "file-1" as any, { pinned: true });
            store.openFile("proj-1" as any, "file-1" as any, { pinned: true });

            const state = useEditorStore.getState();
            const tabState = state.getTabState("proj-1" as any);
            expect(tabState.openTabs).toEqual(["file-1"]);
        });
    });

    describe("closeTab", () => {
        it("closes a tab and activates neighbor", () => {
            const store = useEditorStore.getState();
            store.openFile("proj-1" as any, "file-1" as any, { pinned: true });
            store.openFile("proj-1" as any, "file-2" as any, { pinned: true });
            store.closeTab("proj-1" as any, "file-1" as any);

            const state = useEditorStore.getState();
            const tabState = state.getTabState("proj-1" as any);
            expect(tabState.openTabs).toEqual(["file-2"]);
            expect(tabState.activeTabId).toBe("file-2");
        });

        it("clears active tab when last tab closes", () => {
            const store = useEditorStore.getState();
            store.openFile("proj-1" as any, "file-1" as any, { pinned: true });
            store.closeTab("proj-1" as any, "file-1" as any);

            const state = useEditorStore.getState();
            const tabState = state.getTabState("proj-1" as any);
            expect(tabState.openTabs).toEqual([]);
            expect(tabState.activeTabId).toBeNull();
        });

        it("does nothing for unknown file", () => {
            const store = useEditorStore.getState();
            store.openFile("proj-1" as any, "file-1" as any, { pinned: true });
            store.closeTab("proj-1" as any, "file-999" as any);

            const state = useEditorStore.getState();
            const tabState = state.getTabState("proj-1" as any);
            expect(tabState.openTabs).toEqual(["file-1"]);
        });
    });

    describe("closeAllTabs", () => {
        it("clears all tabs for a project", () => {
            const store = useEditorStore.getState();
            store.openFile("proj-1" as any, "file-1" as any, { pinned: true });
            store.openFile("proj-1" as any, "file-2" as any, { pinned: true });
            store.closeAllTabs("proj-1" as any);

            const state = useEditorStore.getState();
            const tabState = state.getTabState("proj-1" as any);
            expect(tabState).toEqual({
                openTabs: [],
                activeTabId: null,
                previewTabId: null,
            });
        });

        it("only affects the target project", () => {
            const store = useEditorStore.getState();
            store.openFile("proj-1" as any, "file-1" as any, { pinned: true });
            store.openFile("proj-2" as any, "file-2" as any, { pinned: true });
            store.closeAllTabs("proj-1" as any);

            const state = useEditorStore.getState();
            expect(state.getTabState("proj-1" as any).openTabs).toEqual([]);
            expect(state.getTabState("proj-2" as any).openTabs).toEqual(["file-2"]);
        });
    });

    describe("setActiveTab", () => {
        it("switches active tab", () => {
            const store = useEditorStore.getState();
            store.openFile("proj-1" as any, "file-1" as any, { pinned: true });
            store.openFile("proj-1" as any, "file-2" as any, { pinned: true });
            store.setActiveTab("proj-1" as any, "file-2" as any);

            const state = useEditorStore.getState();
            expect(state.getTabState("proj-1" as any).activeTabId).toBe("file-2");
        });
    });
});
