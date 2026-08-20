# E2E Testing Strategy with Playwright

Research findings for ticket #40.

## Recommended setup

### Installation

```bash
bun add -d @playwright/test
bunx playwright install
```

### Configuration (`playwright.config.ts`)

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### Scripts (`package.json`)

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:report": "playwright show-report"
}
```

## What to test (priority order)

### Tier 1: Core user flows (must test)

These are the flows that, if broken, make the product unusable.

1. **Landing page renders** — page loads, title visible, CTA clickable
2. **Auth gate** — unauthenticated users see login, authenticated users see dashboard
3. **Project creation** — click "New Project", project appears in list
4. **AI chat flow** — send a message, see assistant response appear
5. **File explorer** — files created by AI appear in the tree
6. **Code editor** — click a file, content loads in CodeMirror

### Tier 2: Important flows (should test)

7. **GitHub import** — enter repo URL, files appear (needs mock)
8. **GitHub export** — export button triggers flow (needs mock)
9. **Project rename** — rename from dashboard
10. **Conversation history** — switch between conversations

### Tier 3: Nice to have (skip for now)

11. **WebContainer preview** — iframe renders (hard to test in CI)
12. **Terminal interactions** — xterm.js input/output
13. **Multi-tab editing** — open multiple files, switch between them

## Mocking strategy

### The problem

The AI agent runs server-side via Inngest, calls NVIDIA/Groq APIs, and writes to Convex. In E2E tests, you cannot let real API calls happen (slow, expensive, flaky). You need to mock at the right layer.

### Recommended approach: Intercept at the API route level

Playwright can intercept network requests. Mock the Inngest event send and the Convex mutations.

```ts
// Mock the messages API route to return immediately
await page.route("**/api/messages", async (route) => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      success: true,
      eventId: "mock-event-id",
      messageId: "mock-msg-id",
    }),
  });
});

// Mock Convex queries to return fixture data
await page.route("**/convex/api/query**", async (route) => {
  // Return mock project data
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ /* mock data */ }),
  });
});
```

### Alternative: Mock at the Inngest level

Use the Inngest dev server's test mode to mock function responses:

```ts
// In a global setup file
import { InngestTestClient } from "inngest/test";

const testClient = new InngestTestClient({
  client: inngest,
  functions: [processMessage],
});

// Mock the processMessage function
testClient.mock(processMessage, () => {
  return { success: true };
});
```

**Recommendation**: Start with API route interception (simpler), move to Inngest test mode if needed for more fidelity.

### Clerk auth mocking

For E2E tests, you need a way to authenticate without going through the real Clerk flow. Options:

1. **Clerk test tokens** — Use Clerk's testing helpers to generate JWT tokens
2. **Bypass auth in test env** — Set a `CLERK_TEST_BYPASS=true` env var that skips auth checks (only in dev/test)
3. **Seed test user** — Create a test user in Clerk's dashboard and log in with credentials

**Recommendation**: Use Clerk's test mode with `CLERK_PUBLISHABLE_KEY` pointing to a test instance. Clerk provides `<SignedIn>` / `<SignedOut>` helpers that work with their test tokens.

## WebContainer testing

### The challenge

WebContainer runs Node.js in a browser via SharedArrayBuffer. It requires:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: credentialless`
- A secure context (HTTPS or localhost)

Playwright runs against localhost, so COOP/COEP headers work. However:
- WebContainer downloads npm packages at runtime (slow, flaky in CI)
- The preview iframe is sandboxed and hard to assert against

### Recommendation

**Do not test WebContainer in E2E tests.** It's too slow and flaky for CI. Instead:
- Test that the preview pane renders (iframe exists, has correct src)
- Test that the terminal component mounts
- Test the actual code generation and file management (which is Convex-backed, not WebContainer-backed)

WebContainer integration should be verified manually or in a separate, slower integration test suite.

## GitHub import/export testing

### The challenge

Both routes require:
1. Clerk OAuth token for GitHub
2. Real GitHub API calls (via Octokit)

### Recommendation

**Mock at the API route level:**

```ts
// Mock GitHub import endpoint
await page.route("**/api/github/import", async (route) => {
  const body = route.request().postDataJSON();
  // Validate the URL format
  // Return mock success
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      success: true,
      projectId: "mock-project-id",
      eventId: "mock-event-id",
    }),
  });
});
```

Do not test the actual GitHub cloning in E2E. That's an integration concern, not a UI concern.

## CI integration (GitHub Actions)

```yaml
name: E2E Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bunx playwright install --with-deps chromium
      - run: bun run test:e2e
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Environment variables for E2E

Create `.env.test` with:
```env
# Use test Clerk instance
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Use test Convex deployment
NEXT_PUBLIC_CONVEX_URL=https://test-xxx.convex.cloud
POLARIS_CONVEX_INTERNAL_KEY=test-key

# Disable Inngest (mock at API level)
INNGEST_EVENT_KEY=test
INNGEST_SIGNING_KEY=test
```

## File structure

```
e2e/
  landing.spec.ts        # Landing page tests
  auth.spec.ts           # Authentication flow tests
  project.spec.ts        # Project CRUD tests
  chat.spec.ts           # AI chat flow tests
  fixtures/
    projects.json        # Mock project data
    messages.json        # Mock message data
  global-setup.ts        # Clerk test user setup
playwright.config.ts     # Playwright configuration
.env.test               # Test environment variables
```

## Summary of decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Test runner | Playwright | Best browser automation, great DX |
| Browser | Chromium only | WebContainer only works in Chromium-based browsers |
| Mocking level | API route interception | Simpler than Inngest test mode, covers the full stack |
| Auth | Clerk test tokens | Official testing support, no bypass hacks |
| WebContainer | Skip in E2E | Too slow/flaky for CI, test file management instead |
| GitHub flows | Mock at API level | Test UI, not third-party API integration |
| CI | GitHub Actions | Matches existing repo setup |
