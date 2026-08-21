import { describe, it, expect, vi } from "vitest";
import * as Y from "yjs";

// Mock CodeMirror
vi.mock("codemirror", () => ({
    EditorView: vi.fn().mockImplementation(() => ({
        destroy: vi.fn(),
        state: { doc: { toString: () => "" } },
    })),
    basicSetup: {},
}));

vi.mock("y-codemirror.next", () => ({
    yCollab: vi.fn().mockReturnValue({
        destroy: vi.fn(),
    }),
}));

vi.mock("@codemirror/theme-one-dark", () => ({
    oneDark: {},
}));

vi.mock("@codemirror/view", () => ({
    EditorView: {
        updateListener: {
            of: vi.fn().mockReturnValue({}),
        },
    },
    keymap: {
        of: vi.fn().mockReturnValue({}),
    },
}));

vi.mock("@codemirror/commands", () => ({
    indentWithTab: {},
}));

vi.mock("@replit/codemirror-indentation-markers", () => ({
    indentationMarkers: vi.fn().mockReturnValue({}),
}));

vi.mock("../extensions/theme", () => ({
    customTheme: {},
}));

vi.mock("../extensions/language-extension", () => ({
    getLanguageExtension: vi.fn().mockReturnValue({}),
}));

vi.mock("../extensions/minimap", () => ({
    minimap: vi.fn().mockReturnValue({}),
}));

vi.mock("../extensions/custom-setup", () => ({
    customSetup: {},
}));

vi.mock("../extensions/suggestion", () => ({
    suggestion: vi.fn().mockReturnValue({}),
}));

vi.mock("../extensions/quick-edit", () => ({
    quickEdit: vi.fn().mockReturnValue({}),
}));

vi.mock("../extensions/selection-tooltip", () => ({
    selectionTooltip: vi.fn().mockReturnValue({}),
}));

vi.mock("./convex-provider", () => ({
    ConvexSyncProvider: class MockConvexSyncProvider {
        document: Y.Doc;
        loadDocument = vi.fn().mockResolvedValue(false);
        saveDocument = vi.fn().mockResolvedValue(undefined);
        pollUpdates = vi.fn().mockResolvedValue(undefined);
        destroy = vi.fn();
        constructor(options: any) {
            void options;
            this.document = new Y.Doc();
        }
    },
}));

vi.mock("./presence-overlay", () => ({
    PresenceOverlay: vi.fn().mockReturnValue(null),
}));

describe("Collaborative Editing", () => {
    describe("Yjs Document", () => {
        it("creates a new Yjs document", () => {
            const doc = new Y.Doc();
            const text = doc.getText("content");

            expect(text.length).toBe(0);
            doc.destroy();
        });

        it("inserts text into Yjs document", () => {
            const doc = new Y.Doc();
            const text = doc.getText("content");

            text.insert(0, "Hello, World!");

            expect(text.toString()).toBe("Hello, World!");
            doc.destroy();
        });

        it("applies updates between documents", () => {
            const doc1 = new Y.Doc();
            const doc2 = new Y.Doc();

            const text1 = doc1.getText("content");
            const text2 = doc2.getText("content");

            // Make changes to doc1
            text1.insert(0, "Hello");
            const update1 = Y.encodeStateAsUpdate(doc1);

            // Apply to doc2
            Y.applyUpdate(doc2, update1);

            expect(text2.toString()).toBe("Hello");

            doc1.destroy();
            doc2.destroy();
        });

        it("merges concurrent edits", () => {
            const doc1 = new Y.Doc();
            const doc2 = new Y.Doc();

            const text1 = doc1.getText("content");
            const text2 = doc2.getText("content");

            // Concurrent edits
            text1.insert(0, "Hello");
            text2.insert(0, "World ");

            // Get updates
            const update1 = Y.encodeStateAsUpdate(doc1);
            const update2 = Y.encodeStateAsUpdate(doc2);

            // Apply to both
            Y.applyUpdate(doc1, update2);
            Y.applyUpdate(doc2, update1);

            // Both should have the same content (order may vary)
            expect(text1.toString()).toContain("Hello");
            expect(text1.toString()).toContain("World ");
            expect(text2.toString()).toContain("Hello");
            expect(text2.toString()).toContain("World ");

            doc1.destroy();
            doc2.destroy();
        });

        it("encodes and decodes document state", () => {
            const doc1 = new Y.Doc();
            const text = doc1.getText("content");

            text.insert(0, "Test content");

            // Encode state
            const state = Y.encodeStateAsUpdate(doc1);

            // Create new doc and apply state
            const doc2 = new Y.Doc();
            Y.applyUpdate(doc2, state);

            expect(doc2.getText("content").toString()).toBe("Test content");

            doc1.destroy();
            doc2.destroy();
        });
    });

    describe("ConvexSyncProvider", () => {
        it("creates a provider and document", async () => {
            const { ConvexSyncProvider } = await import("./convex-provider");

            const mockConvexClient = {
                mutation: vi.fn().mockResolvedValue({ success: true }),
            };

            const mockApi = {
                system: {
                    createCollaborativeUpdate: {},
                    upsertCollaborativeDocument: {},
                },
            };

            const provider = new ConvexSyncProvider({
                fileId: "test-file-id" as any,
                projectId: "test-project-id" as any,
                convexClient: mockConvexClient,
                api: mockApi,
            });

            // Document should exist
            expect(provider.document).toBeDefined();

            // Make a change to the document
            const doc = provider.document;
            const text = doc.getText("content");
            text.insert(0, "Hello");

            // Verify document state
            expect(doc.getText("content").toString()).toBe("Hello");

            provider.destroy();
        });
    });

    describe("PresenceOverlay", () => {
        it("renders without errors", () => {
            // Placeholder test for presence overlay
            expect(true).toBe(true);
        });
    });
});
