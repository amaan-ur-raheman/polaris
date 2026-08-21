import * as Y from "yjs";

const CONVEX_INTERNAL_KEY = process.env.NEXT_PUBLIC_CONVEX_INTERNAL_KEY ?? "";

export interface ConvexSyncOptions {
    fileId: string;
    projectId: string;
    convexClient: any;
    api: any;
    onUpdate?: (update: Uint8Array) => void;
}

export class ConvexSyncProvider {
    private doc: Y.Doc;
    private fileId: string;
    private projectId: string;
    private convexClient: any;
    private api: any;
    private clock: number = 0;
    private updateQueue: Uint8Array[] = [];
    private isSyncing: boolean = false;
    private updateHandler: (update: Uint8Array) => void;

    constructor(options: ConvexSyncOptions) {
        this.doc = new Y.Doc();
        this.fileId = options.fileId;
        this.projectId = options.projectId;
        this.convexClient = options.convexClient;
        this.api = options.api;
        this.updateHandler = options.onUpdate ?? (() => {});

        // Listen for local updates
        this.doc.on("update", (update: Uint8Array) => {
            this.updateQueue.push(update);
            this.flushUpdates();
        });
    }

    get document(): Y.Doc {
        return this.doc;
    }

    async loadDocument(): Promise<boolean> {
        try {
            // Try to load existing document state
            const doc = await this.convexClient.query(this.api.system.getCollaborativeDocument, {
                internalKey: CONVEX_INTERNAL_KEY,
                fileId: this.fileId as any,
            });

            if (doc && doc.state) {
                const state = new Uint8Array(doc.state);
                Y.applyUpdate(this.doc, state);
                this.clock = doc.clock ?? 0;
                return true;
            }

            return false;
        } catch (error) {
            console.error("Failed to load collaborative document:", error);
            return false;
        }
    }

    async saveDocument(): Promise<void> {
        const state = Y.encodeStateAsUpdate(this.doc);

        try {
            await this.convexClient.mutation(this.api.system.upsertCollaborativeDocument, {
                internalKey: CONVEX_INTERNAL_KEY,
                fileId: this.fileId as any,
                projectId: this.projectId as any,
                state,
                clock: this.clock,
            });
        } catch (error) {
            console.error("Failed to save collaborative document:", error);
        }
    }

    private async flushUpdates(): Promise<void> {
        if (this.isSyncing || this.updateQueue.length === 0) return;

        this.isSyncing = true;
        const updates = this.updateQueue.splice(0);

        try {
            for (const update of updates) {
                this.clock++;
                await this.convexClient.mutation(this.api.system.createCollaborativeUpdate, {
                    internalKey: CONVEX_INTERNAL_KEY,
                    fileId: this.fileId as any,
                    projectId: this.projectId as any,
                    update,
                    clock: this.clock,
                });
            }

            // After syncing updates, save the full state
            await this.saveDocument();
        } catch (error) {
            console.error("Failed to flush updates:", error);
            // Re-queue failed updates
            this.updateQueue.unshift(...updates);
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Subscribe to remote updates (polling-based for now)
     * In a production system, this would use WebSockets
     */
    async pollUpdates(): Promise<void> {
        try {
            const updates = await this.convexClient.query(
                this.api.system.getCollaborativeUpdatesSince,
                {
                    internalKey: CONVEX_INTERNAL_KEY,
                    fileId: this.fileId as any,
                    sinceClock: this.clock,
                },
            );

            for (const update of updates) {
                const data = new Uint8Array(update.update);
                Y.applyUpdate(this.doc, data);
                this.clock = Math.max(this.clock, update.clock);
            }
        } catch (error) {
            console.error("Failed to poll updates:", error);
        }
    }

    destroy(): void {
        this.doc.destroy();
    }
}

/**
 * Initialize a Yjs document for collaborative editing
 */
export function createCollaborativeDoc(): Y.Doc {
    return new Y.Doc();
}

/**
 * Convert a Yjs document to a plain string
 */
export function yDocToString(doc: Y.Doc, fieldName: string = "content"): string {
    const text = doc.getText(fieldName);
    return text.toString();
}

/**
 * Apply a string update to a Yjs document
 */
export function stringToYDoc(doc: Y.Doc, content: string, fieldName: string = "content"): void {
    const text = doc.getText(fieldName);
    text.delete(0, text.length);
    text.insert(0, content);
}
