"use client";

import { Poppins } from "next/font/google";
import { SparkleIcon } from "lucide-react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

import { ProjectsList } from "./projects-list";
import { ProjectsCommandDialog } from "./projects-command-dialog";
import { ImportGithubDialog } from "./import-github-dialog";
import { NewProjectDialog } from "./new-project-dialog";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const ProjectsView = () => {
    const [commandDialogOpen, setCommandDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey) {
                if (e.key === "k") {
                    e.preventDefault();
                    setCommandDialogOpen(true);
                }
                if (e.key === "i") {
                    e.preventDefault();
                    setImportDialogOpen(true);
                }
                if (e.key === "j") {
                    e.preventDefault();
                    setNewProjectDialogOpen(true);
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <ProjectsCommandDialog open={commandDialogOpen} onOpenChange={setCommandDialogOpen} />

            <ImportGithubDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />

            <NewProjectDialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen} />

            <div className="bg-sidebar flex min-h-screen flex-col items-center justify-center p-6 md:p-16">
                <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4">
                    <div className="flex w-full items-center justify-between gap-4">
                        <div className="group/logo flex w-full items-center gap-2">
                            <Image
                                src={"/logo.svg"}
                                alt="Polaris"
                                width={32}
                                height={32}
                                className="size-[32px] md:size-[46px]"
                            />
                            <h1
                                className={cn("text-4xl font-semibold md:text-5xl", font.className)}
                            >
                                Polaris
                            </h1>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-4">
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={"outline"}
                                onClick={() => setNewProjectDialogOpen(true)}
                                className="bg-background flex h-full flex-col items-start justify-start gap-6 rounded-lg border p-4"
                            >
                                <div className="flex w-full items-center justify-between">
                                    <SparkleIcon className="size-4" />
                                    <Kbd className="bg-accent border">⌘J</Kbd>
                                </div>
                                <div>
                                    <span className="text-sm">New Project</span>
                                </div>
                            </Button>
                            <Button
                                variant={"outline"}
                                onClick={() => setImportDialogOpen(true)}
                                className="bg-background flex h-full flex-col items-start justify-start gap-6 rounded-lg border p-4"
                            >
                                <div className="flex w-full items-center justify-between">
                                    <FaGithub className="size-4" />
                                    <Kbd className="bg-accent border">⌘I</Kbd>
                                </div>
                                <div>
                                    <span className="text-sm">Import Project</span>
                                </div>
                            </Button>
                        </div>

                        <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />
                    </div>
                </div>
            </div>
        </>
    );
};
