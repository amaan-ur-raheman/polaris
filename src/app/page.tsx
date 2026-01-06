"use client";

import { useMutation, useQuery } from "convex/react";

import { Button } from "@/components/ui/button";

import { api } from "../../convex/_generated/api";

const Page = () => {
    const projects = useQuery(api.projects.get);
    const createProject = useMutation(api.projects.create);

    return (
        <main className="flex flex-col gap-2 p-4">
            <Button
                onClick={() =>
                    createProject({
                        name: "New Project",
                    })
                }
            >
                Add New
            </Button>

            {projects?.map((project) => (
                <div
                    key={project._id}
                    className="flex flex-col border rounded p-2 "
                >
                    <p>{project.name}</p>
                    <p>Owner Id: {project.ownerId}</p>
                </div>
            ))}
        </main>
    );
};

export default Page;
