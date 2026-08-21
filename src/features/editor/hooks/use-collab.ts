"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

const CONVEX_INTERNAL_KEY = process.env.NEXT_PUBLIC_CONVEX_INTERNAL_KEY ?? "";

interface UseCollabOptions {
    fileId: Id<"files">;
    projectId: Id<"projects">;
}

interface UseCollabResult {
    isLoading: boolean;
    isReady: boolean;
    documentState: Uint8Array | null;
    peerCount: number;
    updatePeerCount: (count: number) => void;
}

export const useCollab = ({ fileId, projectId }: UseCollabOptions): UseCollabResult => {
    const [isReady, setIsReady] = useState(false);
    const [peerCount, setPeerCount] = useState(0);
    const [documentState, setDocumentState] = useState<Uint8Array | null>(null);

    // Query the collaborative document
    const collaborativeDoc = useQuery(api.system.getCollaborativeDocument, {
        internalKey: CONVEX_INTERNAL_KEY,
        fileId,
    });

    useEffect(() => {
        if (collaborativeDoc && collaborativeDoc.state) {
            setDocumentState(new Uint8Array(collaborativeDoc.state));
        }
        setIsReady(true);
    }, [collaborativeDoc]);

    const updatePeerCount = useCallback((count: number) => {
        setPeerCount(count);
    }, []);

    return {
        isLoading: collaborativeDoc === undefined,
        isReady,
        documentState,
        peerCount,
        updatePeerCount,
    };
};
