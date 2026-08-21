"use client";

import { cn } from "@/lib/utils";
import { PROJECT_TEMPLATES, type ProjectTemplate } from "../templates";

interface TemplateSelectorProps {
    selectedTemplateId: string | null;
    onSelect: (templateId: string | null) => void;
    className?: string;
}

export function TemplateSelector({
    selectedTemplateId,
    onSelect,
    className,
}: TemplateSelectorProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-muted-foreground text-sm font-medium">Start from template</label>
            <div className="grid grid-cols-2 gap-2">
                {PROJECT_TEMPLATES.map((template) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplateId === template.id}
                        onSelect={() =>
                            onSelect(selectedTemplateId === template.id ? null : template.id)
                        }
                    />
                ))}
            </div>
        </div>
    );
}

function TemplateCard({
    template,
    isSelected,
    onSelect,
}: {
    template: ProjectTemplate;
    isSelected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                "hover:bg-accent/50",
                isSelected ? "border-primary bg-primary/5" : "border-border",
            )}
        >
            <div className="flex items-center gap-2">
                <span className="text-lg">{template.icon}</span>
                <span className="text-sm font-medium">{template.name}</span>
            </div>
            <p className="text-muted-foreground line-clamp-2 text-xs">{template.description}</p>
            <div className="mt-1 flex gap-1">
                {template.tags.map((tag) => (
                    <span
                        key={tag}
                        className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px]"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </button>
    );
}
