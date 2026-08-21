# Polaris

AI powered full stack development environment. Users chat with an AI coding agent that creates, edits, and manages files in browser based projects. Built with Next.js, Convex, Clerk, Inngest, and WebContainer.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for this repo. See `docs/agents/issue-tracker.md`.

### Domain docs

Single context layout. One `CONTEXT.md` at the repo root covers the entire project. See `docs/agents/domain.md`.

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4, shadcn/ui (new york style, neutral base color, Lucide icons)
- **Backend**: Convex (realtime database, queries, mutations, file storage)
- **Auth**: Clerk (dark theme, ConvexProviderWithClerk integration)
- **Background jobs**: Inngest (AI agent workflows, with Sentry middleware)
- **AI agent**: Inngest Agent Kit (createAgent, createNetwork, tool based)
- **AI models**: Groq (llama 3.1 8b for title generation), NVIDIA API (stepfun ai step 3.5 flash for coding agent), Groq (openai gpt oss 20b for main model)
- **Code editor**: CodeMirror 6 (20 plus languages, minimap, indentation markers)
- **Preview**: WebContainer API (browser Node.js), xterm.js terminal
- **State**: Zustand (editor tabs), Convex React hooks with optimistic updates
- **Error tracking**: Sentry (with tunnel route at /monitoring)
- **Dev runner**: mprocs (runs Next.js, Convex dev, Inngest dev together)
- **Package manager**: bun

## Project structure

```
polaris/
  src/
    app/                    # Next.js App Router
      api/                  # API routes (messages, github, suggestion, quick edit)
      projects/             # Project pages with dynamic [projectId] routes
    components/
      ui/                   # shadcn/ui components (new york style)
      ai-elements/          # AI specific components from ai-sdk registry
    features/               # Feature based modules
      auth/                 # Clerk authentication views
      conversations/        # AI chat, message processing, Inngest tools
        inngest/            # AI agent system prompt, tools (create, read, update, delete, list, rename files, scrape URLs)
      editor/               # CodeMirror editor, tabs, extensions
      preview/              # WebContainer preview, file tree utils
      projects/             # Project management, file explorer, GitHub import/export
      landing/              # Landing page
    lib/                    # Utilities (cn helper, Convex client, AI model config, Firecrawl client)
    hooks/                  # Shared hooks (useMobile)
    inngest/                # Inngest client and functions
  convex/                   # Convex backend
    schema.ts               # Database schema (projects, files, conversations, messages)
    projects.ts             # Project queries and mutations
    files.ts                # File operations (CRUD, tree building)
    conversations.ts        # Conversation queries and mutations
    auth.ts                 # Convex auth config
    system.ts               # Internal mutations (called by Inngest via server client)
    _generated/             # Auto generated Convex types and API
  public/                   # Static assets
```

## Key conventions

### Path aliases

`@/*` maps to `./src/*`. Always use the alias in source code, never relative imports that climb above the feature directory.

### Feature modules

Each feature under `src/features/` is self contained with its own `components/`, `hooks/`, `inngest/` (for backend workflows), and `constants.ts`. Keep feature logic within its module. Shared UI goes in `src/components/ui/` or `src/components/ai-elements/`.

### Convex patterns

- Server side mutations called by Inngest use a `POLARIS_CONVEX_INTERNAL_KEY` for authorization (see `convex/system.ts`).
- Client side hooks import from `convex/_generated/api` and `convex/_generated/dataModel`.
- Use `useQuery` for reads, `useMutation` for writes. Apply `.withOptimisticUpdate()` for user facing mutations (create, rename).
- Schema uses typed validators from `convex/values` (v.string, v.id, v.union, v.optional, v.object).

### Inngest agent tools

Tools live in `src/features/conversations/inngest/tools/`. Each tool is a factory function that takes `{ internalKey }` (and optionally `{ projectId }`) and returns a `createTool` call with a Zod params schema. The agent uses these to create, read, update, delete, list, and rename files in the project.

### AI element components

The project uses AI specific components from the ai-sdk component registry. These are imported from `src/components/ai-elements/` and include conversation, message, artifact, plan, controls, suggestion, and others. The `components.json` configures the registry at `https://registry.ai-sdk.dev/`.

### Styling

- Tailwind CSS v4 with `@tailwindcss/postcss`.
- shadcn/ui components in `src/components/ui/` (new york style, Lucide icons).
- Global styles in `src/app/globals.css`.
- Use the `cn()` utility from `src/lib/utils.ts` for merging class names (clsx + tailwind-merge).
- Dark mode is the default theme.

### Environment variables

Required: `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`, `POLARIS_CONVEX_INTERNAL_KEY`, Clerk keys, at least one AI API key (GROQ, NVIDIA, GOOGLE, or ANTHROPIC), Inngest keys.

Optional: `FIRECRAWL_API_KEY` (web scraping), Sentry keys (error tracking).

See `.env.example` for the full list.

### API routes

All API routes are in `src/app/api/`. Key routes:

- `POST /api/messages` - Send a message to the AI agent
- `POST /api/messages/cancel` - Cancel an in progress message
- `GET /api/suggestion` - Get code suggestions
- `POST /api/quick-edit` - Quick edit a file
- `POST /api/projects/create-with-prompt` - Create a project with AI prompt
- `POST /api/github/import` - Import from GitHub
- `POST /api/github/export` - Export to GitHub (with cancel/reset routes)

### WebContainer

The preview uses WebContainer API which sets COOP and COEP headers in `next.config.ts` (Cross-Origin-Opener-Policy: same-origin, Cross-Origin-Embedder-Policy: credentialless). These headers are required for SharedArrayBuffer support.

## Getting started

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local

# Run all services (Next.js + Convex + Inngest)
bun run dev:all

# Or run individually
bun run dev          # Next.js
bun run convex:dev   # Convex
bun run inngest:dev  # Inngest
```

## Git conventions

- Branch naming: `feature/<name>`, `feat/<name>`
- Commit messages: conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)
- PR titles: descriptive with feature/fix prefix
