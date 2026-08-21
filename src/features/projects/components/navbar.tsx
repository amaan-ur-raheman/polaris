"use client";

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { CloudCheckIcon, History, LoaderIcon } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

import { Id } from "@convex/_generated/dataModel";
import { useProject, useRenameProject } from "../hooks/use-projects";
import { VersionHistory } from "./version-history";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {
    const project = useProject(projectId);
    const renameProject = useRenameProject();
    const [isRenaming, setIsRenaming] = useState(false);
    const [name, setName] = useState("");
    const [showVersionHistory, setShowVersionHistory] = useState(false);

    const handleRenameStart = () => {
        if (!project) return;
        setName(project.name);
        setIsRenaming(true);
    };

    const handleSubmit = () => {
        if (!project) return;
        setIsRenaming(false);

        const trimmedName = name.trim();
        if (!trimmedName || trimmedName === project.name) return;

        renameProject({ id: projectId, name: trimmedName });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        } else if (e.key === "Escape") {
            setIsRenaming(false);
        }
    };

    return (
        <nav className="bg-sidebar flex items-center justify-between gap-x-2 border-b p-2">
            <div className="flex items-center gap-x-2">
                <Breadcrumb>
                    <BreadcrumbList className="gap-0!">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="flex items-center gap-1.5">
                                <Button variant={"ghost"} className="h-7! w-fit! p-1.5!" asChild>
                                    <Link href={"/"}>
                                        <Image
                                            src="/logo.svg"
                                            alt="Polaris"
                                            width={20}
                                            height={20}
                                        />
                                        <span
                                            className={cn(
                                                "text-primary text-sm font-medium",
                                                font.className,
                                            )}
                                        >
                                            Polaris
                                        </span>
                                    </Link>
                                </Button>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="mr-1 ml-0!" />
                        <BreadcrumbItem>
                            {isRenaming ? (
                                <input
                                    autoFocus
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={(e) => e.currentTarget.select()}
                                    onBlur={handleSubmit}
                                    onKeyDown={handleKeyDown}
                                    className="text-foreground focus:ring-ring max-w-40 truncate bg-transparent text-sm font-medium outline-none focus:ring-1 focus:ring-inset"
                                />
                            ) : (
                                <BreadcrumbPage
                                    onClick={handleRenameStart}
                                    className="hover:text-primary max-w-40 cursor-pointer truncate text-sm font-medium"
                                >
                                    {project?.name ?? "Loading…"}
                                </BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {project?.importStatus === "importing" ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <LoaderIcon className="text-muted-foreground size-4 animate-spin" />
                        </TooltipTrigger>
                        <TooltipContent>Importing project…</TooltipContent>
                    </Tooltip>
                ) : (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CloudCheckIcon className="text-muted-foreground size-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Saved{" "}
                            {project?.updatedAt
                                ? formatDistanceToNow(project.updatedAt, {
                                      addSuffix: true,
                                  })
                                : "Loading…"}
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Sheet open={showVersionHistory} onOpenChange={setShowVersionHistory}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    aria-label="Version history"
                                >
                                    <History className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Version History</TooltipContent>
                    </Tooltip>
                    <SheetContent className="w-[400px] p-0 sm:w-[540px]">
                        <VersionHistory projectId={projectId} />
                    </SheetContent>
                </Sheet>
                <UserButton />
            </div>
        </nav>
    );
};
