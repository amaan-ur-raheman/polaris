# 0003. Feature based module structure

**Status:** Accepted

## Context

The project has multiple distinct concerns (authentication, conversations with AI, code editor, file preview, project management, landing page) that need to coexist in a single Next.js app. Without clear boundaries, related code (components, hooks, backend tools, constants) tends to scatter across the codebase, making it hard to find and maintain.

## Decision

Organize domain logic under `src/features/` with one directory per feature:

```
src/features/
  auth/           # Clerk authentication views
  conversations/  # AI chat, message processing, Inngest tools
  editor/         # CodeMirror editor, tabs, extensions
  preview/        # WebContainer preview, file tree utils
  projects/       # Project management, file explorer, GitHub import/export
  landing/        # Landing page
```

Each feature is self contained with its own `components/`, `hooks/`, `inngest/` (for backend workflows), and `constants.ts`. Shared UI components live in `src/components/ui/` (shadcn) and `src/components/ai-elements/` (AI specific). Utility functions live in `src/lib/`.

The `@/*` path alias maps to `./src/*` so imports never climb above the feature directory.

## Consequences

### Positive

- Each feature is easy to locate and understand in isolation
- Backend tools (Inngest) live alongside the feature that uses them
- Adding a new feature means creating one directory with a predictable layout
- No circular dependencies between features (they only import from shared directories)

### Negative

- Some duplication of imports across features (each imports from `convex/_generated/api` independently)
- New developers need to learn the convention (feature directory structure vs flat component folder)

### Risks

- If a feature grows very large, it may need sub feature decomposition (none currently do)
