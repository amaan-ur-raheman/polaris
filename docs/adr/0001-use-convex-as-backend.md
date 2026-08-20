# 0001. Use Convex as the backend

**Status:** Accepted

## Context

Polaris needs a backend that provides real-time data sync, file storage, and type safe queries without managing server infrastructure. The frontend is a Next.js app running on Vercel, and the AI agent (via Inngest) needs to read and write project data server side.

Traditional options (Firebase, Supabase, custom Express API) each have tradeoffs around real time sync, type safety, and developer experience.

## Decision

Use Convex as the primary backend. Convex provides:

- Realtime queries via `useQuery` hooks that automatically update when data changes
- A schema defined in code (`convex/schema.ts`) with typed validators
- Server side mutations callable from both client hooks and Inngest functions
- File storage via `_storage` for binary file content
- A generated TypeScript API (`convex/_generated/api`) for fully typed access

Server side access from Inngest uses the `ConvexHttpClient` with an internal key (`POLARIS_CONVEX_INTERNAL_KEY`) for authorization, separate from the client side `ConvexReactClient`.

## Consequences

### Positive

- Realtime updates with zero client side polling or websocket setup
- Type safe queries and mutations from schema to frontend
- Inngest can call Convex mutations directly via the HTTP client
- No server to deploy or manage (Vercel + Convex hosted)
- Optimistic updates built into the Convex React client

### Negative

- Vendor lock in to Convex (no easy migration path to another backend)
- Schema changes require running `convex dev` to regenerate types
- The internal key pattern adds a layer of indirection for server side mutations
- Convex pricing scales with database reads and writes

### Risks

- If Convex changes its pricing model or deprecates features, migration cost is high
- The `_generated` directory must be committed or regenerated on every deploy
