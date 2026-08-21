import Link from "next/link";
import { AlertCircleIcon, ArrowRightIcon, GlobeIcon, Loader2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { FaGithub } from "react-icons/fa";

import { Spinner } from "@/components/ui/spinner";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";

import { Doc } from "@convex/_generated/dataModel";
import { useProjectsPartial } from "../hooks/use-projects";

const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(timestamp, {
        addSuffix: true,
    });
};

const getProjectIcon = (project: Doc<"projects">) => {
    if (project.importStatus === "completed") {
        return <FaGithub className="text-muted-foreground size-3.5" />;
    }

    if (project.importStatus === "failed") {
        return <AlertCircleIcon className="text-muted-foreground size-3.5" />;
    }

    if (project.importStatus === "importing") {
        return <Loader2Icon className="text-muted-foreground size-3.5 animate-spin" />;
    }

    return <GlobeIcon className="text-muted-foreground size-3.5" />;
};

interface ProjectsListProps {
    onViewAll: () => void;
}

const ContinueCard = ({ data }: { data: Doc<"projects"> }) => {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs">Last Updated</span>
            <Button
                variant={"outline"}
                className="bg-background flex h-auto flex-col items-start justify-start gap-2 rounded-lg p-4"
                asChild
            >
                <Link href={`/projects/${data._id}`} className="group">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getProjectIcon(data)}
                            <span className="truncate font-medium">{data.name}</span>
                        </div>
                        <ArrowRightIcon className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <span className="text-muted-foreground text-xs">
                        {formatTimestamp(data.updatedAt)}
                    </span>
                </Link>
            </Button>
        </div>
    );
};

const ProjectItem = ({ data }: { data: Doc<"projects"> }) => {
    return (
        <Link
            href={`/projects/${data._id}`}
            className="text-foreground/60 hover:text-foreground group flex w-full items-center justify-between py-1 text-sm font-medium"
        >
            <div className="flex items-center gap-2">
                {getProjectIcon(data)}
                <span className="truncate">{data.name}</span>
            </div>
            <span className="text-muted-foreground group-hover:text-foreground/60 text-xs transition-colors">
                {formatTimestamp(data.updatedAt)}
            </span>
        </Link>
    );
};

export const ProjectsList = ({ onViewAll }: ProjectsListProps) => {
    const projects = useProjectsPartial(6);

    if (projects === undefined) {
        return <Spinner className="size-6" />;
    }

    if (projects.length === 0) {
        return (
            <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs">No projects yet</span>
                <p className="text-muted-foreground/70 text-xs">
                    Create a new project or import from GitHub to get started.
                </p>
            </div>
        );
    }

    const [mostRecent, ...rest] = projects;

    return (
        <div className="flex flex-col gap-4">
            {mostRecent ? <ContinueCard data={mostRecent} /> : null}

            {rest.length > 0 && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-xs">Recent Projects</span>
                        <button
                            onClick={onViewAll}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs transition-colors"
                        >
                            <span>View All</span>
                            <Kbd className="bg-accent border">⌘K</Kbd>
                        </button>
                    </div>
                    <ul className="flex flex-col">
                        {rest.map((project) => (
                            <ProjectItem key={project._id} data={project} />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
