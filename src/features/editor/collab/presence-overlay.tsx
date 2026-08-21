"use client";

import { useEffect, useState } from "react";

interface PresenceUser {
    id: string;
    name: string;
    color: string;
    cursor?: {
        line: number;
        column: number;
    };
}

interface PresenceOverlayProps {
    fileId: string;
    projectId: string;
    onPeerCountChange?: (count: number) => void;
}

const PRESENCE_COLORS = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEAA7", // Yellow
    "#DDA0DD", // Plum
    "#98D8C8", // Mint
    "#F7DC6F", // Gold
    "#BB8FCE", // Purple
    "#85C1E9", // Sky
];

export const PresenceOverlay = ({ fileId, projectId, onPeerCountChange }: PresenceOverlayProps) => {
    const [peers, setPeers] = useState<PresenceUser[]>([]);

    // Placeholder for WebSocket-based presence
    // In production, this would connect to a presence server
    useEffect(() => {
        // For now, simulate presence with a random user count
        // In production, this would be WebSocket-based
        const simulatedPeers: PresenceUser[] = [];

        setPeers(simulatedPeers);
        onPeerCountChange?.(simulatedPeers.length);

        return () => {
            setPeers([]);
            onPeerCountChange?.(0);
        };
    }, [fileId, projectId, onPeerCountChange]);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Remote cursors would be rendered here */}
            {peers.map((peer) => (
                <div
                    key={peer.id}
                    className="absolute"
                    style={{
                        // Position would be calculated from cursor location
                        left: 0,
                        top: 0,
                    }}
                >
                    {/* Cursor line */}
                    <div className="h-5 w-0.5" style={{ backgroundColor: peer.color }} />
                    {/* User label */}
                    <div
                        className="-mt-1 rounded-sm px-1 py-0.5 text-xs whitespace-nowrap text-white"
                        style={{ backgroundColor: peer.color }}
                    >
                        {peer.name}
                    </div>
                </div>
            ))}
        </div>
    );
};

export type { PresenceUser };
