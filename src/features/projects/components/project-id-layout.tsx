"use client";

import { Allotment } from "allotment";

import { ConversationSidebar } from "@/features/conversations/components/conversation-sidebar";
import { ErrorBoundary } from "@/components/error-boundary";

import { Id } from "@convex/_generated/dataModel";
import { Navbar } from "./navbar";
import "allotment/dist/style.css";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400;
const DEFAULT_MAIN_SIZE = 1000;

export const ProjectIdLayout = ({
    children,
    projectId,
}: {
    children: React.ReactNode;
    projectId: Id<"projects">;
}) => {
    return (
        <div className="flex h-screen w-full flex-col">
            <Navbar projectId={projectId} />
            <div className="flex flex-1 overflow-hidden">
                <Allotment
                    className="flex-1"
                    defaultSizes={[DEFAULT_CONVERSATION_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}
                >
                    <Allotment.Pane
                        snap
                        minSize={MIN_SIDEBAR_WIDTH}
                        maxSize={MAX_SIDEBAR_WIDTH}
                        preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
                    >
                        <ErrorBoundary feature="AI Chat">
                            <ConversationSidebar projectId={projectId} />
                        </ErrorBoundary>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={DEFAULT_MAIN_SIZE}>{children}</Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
};
