# 0002. Use Inngest for AI agent orchestration

**Status:** Accepted

## Context

The AI coding agent needs to handle long running conversations, call multiple tools (create, read, update, delete, rename files), and optionally scrape URLs for context. These operations can take significant time and must be resilient to network failures and user cancellations.

Running this as a synchronous API route would block the request, risk timeouts, and make cancellation difficult.

## Decision

Use Inngest as the background job and AI agent orchestration layer. Specifically:

- Inngest receives `message/sent` events and runs the `process-message` function
- The `Inngest Agent Kit` (`createAgent`, `createNetwork`) orchestrates the AI model and its tools
- The agent runs in a loop (max 75 iterations) until it produces a text response without pending tool calls
- Cancellation is handled via `cancelOn` config listening for `message/cancel` events
- Failure handling updates the message with a user friendly error
- Inngest middleware includes Sentry for error tracking

The agent tools (file CRUD, URL scraping) are factory functions that close over the project context and internal key, then call `convex.mutation` or `convex.query` via the HTTP client.

## Consequences

### Positive

- Requests return immediately while processing happens in the background
- Built in retry logic for transient failures
- User can cancel in progress messages
- Agent loop with tool calls works naturally (Inngest steps manage state)
- Sentry integration catches agent failures automatically

### Negative

- Adds Inngest as an infrastructure dependency (requires running `inngest-cli dev` locally)
- The agent loop has a hard cap of 75 iterations, which may not be enough for very large tasks
- Conversation history is limited to the last 10 messages for context

### Risks

- Inngest pricing scales with function runs and step executions
- The max iteration limit may need tuning as the agent becomes more capable
