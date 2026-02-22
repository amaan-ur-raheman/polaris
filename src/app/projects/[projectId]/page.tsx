import { ProjectIdView } from "@/features/projects/components/project-id-view";

import { Id } from "../../../../convex/_generated/dataModel";

interface ProjectIdPageProps {
    params: Promise<{ projectId: string }>;
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
    const { projectId } = await params;
    return <ProjectIdView projectId={projectId as Id<"projects">} />;
};

export default ProjectIdPage;
