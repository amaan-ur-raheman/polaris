# Polaris

## What it is

Polaris is a browser based AI powered development environment. Users describe what they want to build in a chat, and an AI coding agent creates, edits, and manages files in a project that runs live in the browser via WebContainer.

Think of it as a simplified Replit or CodeSandbox, where the primary interface is conversational AI rather than manual coding. The user talks, the AI writes code, and the result appears instantly in a live preview.

## Who it is for

Non technical users who want to build web applications without learning to code, and developers who want to prototype ideas quickly through conversation rather than writing boilerplate.

## Core user flows

1. **Create a project** — User clicks "New Project", optionally describes what they want, and the AI scaffolds the entire application.
2. **Iterate via chat** — User asks the AI to add features, fix bugs, or change styling. The AI reads existing files, makes changes, and the preview updates in real time.
3. **Edit manually** — User can open files in the CodeMirror editor, make direct changes, and see them reflected in the preview.
4. **Run and debug** — WebContainer runs the project in browser. User can open the terminal, install packages, run commands, and see console output.
5. **Import and export** — User can import an existing GitHub repository, or export their project to a new or existing GitHub repo.

## Architecture

### Frontend (Next.js)

Next.js 16 App Router on Vercel. The app has three main screens:

- **Landing page** (`/`) — Marketing page for unauthenticated visitors.
- **Projects dashboard** (`/projects`) — Lists the user's projects with create, rename, import, and delete actions.
- **Project workspace** (`/projects/[projectId]`) — The main IDE view with three panels: AI chat sidebar, code editor (with file explorer), and live preview with terminal.

Providers wrap the entire app: Clerk (auth) > Convex (data) > Theme (dark mode).

### Backend (Convex)

Convex handles all data and file storage. The schema has four tables:

- **projects** — Name, owner, import/export status, settings (install command, dev command).
- **files** — Hierarchical file tree (parent/child references), file or folder type, content for files, storage ID for binaries.
- **conversations** — Chat threads belong to a project.
- **messages** — User and assistant messages with processing status.

Server side mutations (`convex/system.ts`) are called by Inngest via an internal key, separate from client side hooks.

### AI agent (Inngest)

When a user sends a message, the API route fires a `message/sent` event to Inngest. The `process-message` function runs the AI agent:

1. Generates a conversation title (first message only, via Groq llama 3.1 8b).
2. Builds a system prompt with conversation history context.
3. Runs the coding agent (via NVIDIA API, stepfun ai step 3.5 flash) in a tool loop.
4. The agent calls file tools to create, read, update, delete, and rename files in Convex.
5. The final text response is written back as the assistant message.

The agent can run up to 75 iterations. Users can cancel in progress messages.

### File tools

The AI agent has access to these tools, each implemented as a factory function in `src/features/conversations/inngest/tools/`:

- `listFiles` — Get the full file tree for a project
- `readFiles` — Read content of one or more files by ID
- `createFiles` — Create multiple files in batch (with parent folder)
- `updateFile` — Replace file content
- `deleteFiles` — Remove files or folders
- `createFolder` — Create a new directory
- `renameFile` — Rename a file or folder
- `scrapeUrls` — Fetch web content for context

### Preview (WebContainer)

The preview pane uses the WebContainer API to run the user's project in browser. It:

- Detects the project type from package.json
- Installs dependencies with the configured install command
- Runs the dev server with the configured dev command
- Renders the output in an iframe
- Provides an xterm.js terminal for shell commands

COOP and COEP headers are set in next.config.ts for SharedArrayBuffer support.

## Key patterns

- **Feature modules**: Domain logic lives in `src/features/` with self contained components, hooks, tools, and constants per feature.
- **Optimistic updates**: Convex mutations for user facing actions (create project, rename, create conversation) use `.withOptimisticUpdate()` for instant UI feedback.
- **Tool factory pattern**: Inngest agent tools are factory functions that close over project context and the internal key, returning a `createTool` call.
- **Internal key authorization**: Server side Convex calls from Inngest use `POLARIS_CONVEX_INTERNAL_KEY` instead of user auth, since Inngest functions run outside the browser session.
- **Dark mode default**: The app is dark first. Clerk uses the dark theme. Tailwind is configured for dark mode.
- **AI components**: Chat UI uses components from the ai-sdk component registry (`src/components/ai-elements/`), not standard shadcn chat components.

## Environment variables

**Required for core functionality:**

- `NEXT_PUBLIC_CONVEX_URL` / `CONVEX_DEPLOYMENT` — Convex project
- `POLARIS_CONVEX_INTERNAL_KEY` — Server side Convex access
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` / `CLERK_JWT_ISSUER_DOMAIN` — Authentication
- `GROQ_API_KEY` — AI model access (title generation, main model)
- `NVIDIA_API_KEY` — Coding agent model (stepfun ai step 3.5 flash)
- `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY` — Background jobs

**Optional:**

- `GOOGLE_GENERATIVE_AI_API_KEY` / `ANTHROPIC_API_KEY` — Additional AI model providers
- `FIRECRAWL_API_KEY` — Web scraping for AI context
- `SENTRY_AUTH_TOKEN` — Error tracking

See `.env.example` for the full list.

## What not to change

- The Convex schema is the source of truth for data structure. Never bypass it with direct database calls.
- The internal key pattern for server side mutations must not be exposed to the client.
- WebContainer requires COOP/COEP headers. Removing them will break the preview.
- The agent system prompt in `src/features/conversations/inngest/constant.ts` is tuned for the tool interface. Changing tool names or parameters requires updating it.
- The 75 iteration limit on the agent network is intentional. Do not remove it without understanding the cost implications.

## Related documents

- `AGENTS.md` — Global conventions, tech stack, project structure
- `docs/agents/issue-tracker.md` — GitHub Issues configuration
- `docs/agents/domain.md` — Domain doc layout and consumer rules
- `docs/adr/` — Architecture decision records (Convex, Inngest, feature modules)
