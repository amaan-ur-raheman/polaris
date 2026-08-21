import React from "react";
import { FileIcon } from "@react-symbols/icons/utils";

import { useFilePath } from "@/features/projects/hooks/use-files";
import { useEditor } from "../hooks/use-editor";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Id } from "@convex/_generated/dataModel";

export const FileBreadCrumbs = ({ projectId }: { projectId: Id<"projects"> }) => {
    const { activeTabId } = useEditor(projectId);
    const filePath = useFilePath(activeTabId);

    if (filePath === undefined || !activeTabId) {
        return (
            <div className="bg-background border-b p-2 pl-4">
                <Breadcrumb>
                    <BreadcrumbList className="gap-0.5 sm:gap-0.5">
                        <BreadcrumbItem className="text-sm">
                            <BreadcrumbPage>&nbsp;</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        );
    }

    return (
        <div className="bg-background border-b p-2 pl-4">
            <Breadcrumb>
                <BreadcrumbList className="gap-0.5 sm:gap-0.5">
                    {filePath.map((item, index) => {
                        const isLast = index === filePath.length - 1;

                        return (
                            <React.Fragment key={item._id}>
                                <BreadcrumbItem className="text-sm">
                                    {isLast ? (
                                        <BreadcrumbPage className="flex items-center gap-1">
                                            <FileIcon
                                                fileName={item.name}
                                                autoAssign
                                                className="size-4"
                                            />
                                            {item.name}
                                        </BreadcrumbPage>
                                    ) : (
                                        <span className="text-muted-foreground">{item.name}</span>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator />}
                            </React.Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};
