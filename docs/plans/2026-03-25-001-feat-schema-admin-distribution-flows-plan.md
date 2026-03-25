---
title: "feat: Migrate schema to timestamps, redesign admin UI, implement newsletter/LinkedIn flows"
type: feat
status: active
date: 2026-03-25
origin: docs/brainstorms/2026-03-24-content-distribution-admin-requirements.md
---

# feat: Migrate schema to timestamps, redesign admin UI, implement newsletter/LinkedIn flows

## Overview

Replace boolean distribution flags with timestamps and URLs, redesign the admin page from a table to a list-based UI with a minimal shell layout, implement distinct newsletter actions (test send vs. segment send), implement LinkedIn draft-then-publish flow, and update the CLI script to match.

## Problem Frame

The current admin UI uses boolean flags (`newsletterSent`, `linkedinSent`) and a single "Send" action per channel. This prevents tracking *when* something was sent, linking to previews or posts, sending test emails before real sends, and creating LinkedIn drafts before publishing. The table layout is also harder to scan for a content-focused workflow. (see origin: `docs/brainstorms/2026-03-24-content-distribution-admin-requirements.md`)

## Requirements Trace

- R1. Dev-only admin route at `/admin` (already satisfied, preserved)
- R2. Minimal shell layout: header bar with project name linking to blog, no site chrome
- R3. Posts as `<ul>/<li>` list with title on line 1, status icons + action links on line 2
- R4. Newsletter actions: Send Test / Send / Preview (post-send)
- R5. LinkedIn actions: Draft / Post / View
- R6. Filter toggle for unsent posts (newsletter OR LinkedIn)
- R7. Toast notifications (already exists, preserved)
- R8. Timestamp + URL fields replacing boolean flags
- R9. Marketing content under `marketing` key in frontmatter
- R10. Migration script: boolean `true` to `"legacy"` marker
- R11. Send Test sends to `ADMIN_EMAIL`, does not update frontmatter
- R12. Send sends to Resend segment, stores `newsletterSentAt` + `newsletterPreviewUrl`
- R13. Newsletter email: full post HTML with "Read online" link
- R14. Draft creates LinkedIn draft, stores `linkedinDraftedAt` + `linkedinPostUrl`
- R15. Post publishes existing draft, stores `linkedinPostedAt`
- R16. View links open LinkedIn URL in new tab
- R17. Newsletter service at `NEWSLETTER_SERVICE_URL`
- R18. LinkedIn service at `LINKEDIN_SERVICE_URL`
- R19. Required env vars documented
- R20. Copy-paste between projects, no shared package

## Scope Boundaries

- LinkedIn and Newsletter only; no other social channels
- LinkedIn service and newsletter service are external -- this plan covers Nuxt integration only
- No automation; all actions are manual from admin UI or CLI
- Varro admin UI is a separate project, not covered here
- No shared Nuxt module; files are copy-pasted between CCM Website and AI Content

## Context & Research

### Relevant Code and Patterns

- **Schema**: `content.config.ts` -- blog collection with `z.object()`, currently has `newsletterSent: z.boolean().default(false)` and `linkedinSent: z.boolean().default(false)`
- **Admin page**: `pages/admin/index.vue` -- single-file component with `<script setup>`, uses `queryCollection('blog')`, has toast system, health check, filter toggle
- **Server routes**: `server/routes/api/admin/send-newsletter.post.ts` and `send-linkedin.post.ts` -- Nitro event handlers with `import.meta.dev` guard and optional `ADMIN_API_SECRET` check
- **Utilities**: `server/utils/updateFrontmatter.ts` -- regex-based frontmatter patching with per-file mutex; `server/utils/serviceClient.ts` -- `sendNewsletter()` and `sendLinkedInPost()` functions
- **CLI**: `scripts/distribute.ts` -- uses shared utils, supports `--service`, `--slug`, `--all-unsent`, `--dry-run`, `--status`
- **Migration precedent**: `scripts/backfill-frontmatter.ts` -- uses `gray-matter` for read/write, idempotent
- **Layout**: `layouts/none.vue` exists as a blank layout (just `<slot />`), suitable base for admin shell
- **Nuxt config**: Admin routes already excluded from prerender via `nitro.prerender.ignore` and `routeRules`

### Institutional Learnings

- `docs/solutions/security-issues/admin-health-endpoint-hardening.md`: All admin endpoints must include both `import.meta.dev` guard AND `ADMIN_API_SECRET` check. Copy the full auth preamble, not just the dev guard.
- The existing backfill script uses `matter.stringify()` which reformats YAML differently from the regex-based `updateFrontmatter`. The migration script should use the same regex-based approach from `updateFrontmatter.ts` to avoid reformatting diffs.
- `updateFrontmatter.ts` serializes strings with double quotes and handles both replacing existing keys and appending new keys.

### External References

- Skipped. The codebase has strong local patterns for all the work described. Resend API response shape and LinkedIn draft API shape are external-service concerns that the service layer abstracts -- the admin UI just needs the URL returned by the service.

## Key Technical Decisions

- **Migration marker is `"legacy"` not a synthetic date**: Posts with `newsletterSent: true` or `linkedinSent: true` get `newsletterSentAt: "legacy"` / `linkedinDraftedAt: "legacy"` / `linkedinPostedAt: "legacy"`. This distinguishes "actually sent with timestamps" from "backfilled to prevent mass-send". The admin UI treats any truthy `*SentAt` / `*PostedAt` value as "sent" and displays `"legacy"` as-is where a date would normally appear.

- **Migration script uses regex-based patching (not `matter.stringify`)**: To avoid reformatting all YAML in existing posts, the migration script reuses the `updateFrontmatter` utility's regex approach. It removes old boolean keys and adds new timestamp keys.

- **Admin layout is a new `layouts/admin.vue`**: Rather than using `layouts/none.vue` (which is just an empty slot), create a dedicated `layouts/admin.vue` with the header bar. The admin page sets `definePageMeta({ layout: 'admin' })`.

- **Service client returns URLs**: `sendNewsletter` and LinkedIn service functions are updated to return `{ ok, previewUrl?, postUrl?, error? }` from the service response. The admin routes and CLI extract these URLs and pass them to `updateFrontmatter`.

- **Three new API routes replace two**: The existing `send-newsletter.post.ts` and `send-linkedin.post.ts` are replaced by: `send-newsletter.post.ts` (send to segment), `test-newsletter.post.ts` (send test to ADMIN_EMAIL), `draft-linkedin.post.ts` (create draft), `publish-linkedin.post.ts` (publish draft). The health endpoint stays as-is.

- **Schema uses `z.string().nullable().default(null)` for timestamp/URL fields**: This allows `null` (not yet done), `"legacy"` (migrated from boolean), or an ISO date string. The admin UI interprets these three states for display.

- **`marketing` key added to schema as a passthrough object**: `marketing: z.record(z.unknown()).optional()` -- the admin UI reads `marketing.linkedin` for the draft action but does not validate its internal shape (that is Varro's responsibility).

## Open Questions

### Resolved During Planning

- **How to render admin list without full site styles?** Use `layouts/admin.vue` with self-contained scoped styles (system-ui font, no design tokens). The admin page already uses scoped styles with no dependency on the site CSS layers.

- **Migration strategy for boolean flags?** Use a new migration script (`scripts/migrate-to-timestamps.ts`) that reads each blog post, removes `newsletterSent`/`linkedinSent` keys, and writes the new timestamp fields. Posts where the boolean was `true` get `"legacy"`; posts where it was `false` (or missing) get `null`. Script is idempotent by checking for the presence of new-schema keys.

- **Resend API response shape for preview URL?** The newsletter service abstracts this. The service client expects the service to return `{ previewUrl: string }` in its JSON response. If the service does not return it, `previewUrl` is `null` and the admin UI simply does not show a Preview link. This is a graceful degradation, not a blocker.

- **LinkedIn draft URL from API?** Same pattern -- the LinkedIn service returns `{ postUrl: string }` in its response. The service client passes it through.

### Deferred to Implementation

- **Exact `marketing.linkedin` shape**: The admin UI reads whatever Varro wrote. The LinkedIn draft route sends `marketing.linkedin` to the service as-is. If the shape changes in Varro, the LinkedIn service handles the mapping.
- **Rate limiting for batch CLI operations**: The existing 600ms delay between sends may need adjustment for the new actions. Defer to testing.
- **ADMIN_EMAIL env var for health check**: May want to add it to the health endpoint's env var checks. Low priority.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
Admin UI State Machine (per post, per channel):

Newsletter:
  null/missing → [Send Test] [Send]
  (test sent)  → [Send Test] [Send]   (test does not change state)
  "legacy"     → Sent (legacy)
  ISO date     → Sent {date} [Preview]

LinkedIn:
  null/missing        → [Draft]
  linkedinDraftedAt   → Drafted {date} [View] [Post]
  linkedinPostedAt    → Posted {date} [View]

API Routes:
  POST /api/admin/test-newsletter   → sends to ADMIN_EMAIL, returns ok
  POST /api/admin/send-newsletter   → sends to segment, returns { newsletterSentAt, newsletterPreviewUrl }
  POST /api/admin/draft-linkedin    → creates draft, returns { linkedinDraftedAt, linkedinPostUrl }
  POST /api/admin/publish-linkedin  → publishes draft, returns { linkedinPostedAt, linkedinPostUrl }
  GET  /api/admin/health            → unchanged
```

## Implementation Units

- [ ] **Unit 1: Schema migration — update content.config.ts and write migration script**

  **Goal:** Replace boolean flags with timestamp/URL fields in the schema and migrate existing blog posts.

  **Requirements:** R8, R9, R10

  **Dependencies:** None

  **Files:**
  - Modify: `content.config.ts`
  - Create: `scripts/migrate-to-timestamps.ts`

  **Approach:**
  - Remove `newsletterSent` and `linkedinSent` from the blog schema
  - Add: `newsletterSentAt: z.string().nullable().default(null)`, `newsletterPreviewUrl: z.string().nullable().default(null)`, `linkedinDraftedAt: z.string().nullable().default(null)`, `linkedinPostUrl: z.string().nullable().default(null)`, `linkedinPostedAt: z.string().nullable().default(null)`
  - Add: `marketing: z.record(z.unknown()).optional()`
  - Migration script iterates all `.md` files in `content/blog/`, uses the regex-based patching approach from `updateFrontmatter.ts` (not `matter.stringify`) to: (a) remove `newsletterSent` and `linkedinSent` lines, (b) add new fields with value `"legacy"` if the old boolean was `true`, or `null` if `false`/missing
  - Script must be idempotent: skip files that already have `newsletterSentAt`
  - Run script, verify with `git diff`, commit the migration

  **Patterns to follow:**
  - `scripts/backfill-frontmatter.ts` for script structure (iterate files, skip conditions, summary output)
  - `server/utils/updateFrontmatter.ts` for regex-based frontmatter patching approach

  **Test scenarios:**
  - Post with `newsletterSent: true, linkedinSent: true` gets `newsletterSentAt: "legacy"`, `linkedinDraftedAt: "legacy"`, `linkedinPostedAt: "legacy"`, `linkedinPostUrl: null`, `newsletterPreviewUrl: null`; old keys removed
  - Post with `newsletterSent: false, linkedinSent: false` gets all new fields as `null`; old keys removed
  - Post missing both boolean keys gets all new fields as `null`
  - Running script twice produces identical output
  - Post body content is preserved unchanged
  - YAML formatting of other frontmatter keys is not disturbed

  **Verification:**
  - `git diff` shows only the expected field changes across all blog posts
  - `npm run dev` starts without schema validation errors
  - `queryCollection('blog').all()` returns posts with the new fields

- [ ] **Unit 2: Update service client to return URLs from service responses**

  **Goal:** Extend `sendNewsletter` and LinkedIn service functions to parse and return URLs from the external service responses.

  **Requirements:** R12, R14, R15

  **Dependencies:** None (can run in parallel with Unit 1)

  **Files:**
  - Modify: `server/utils/serviceClient.ts`

  **Approach:**
  - Change `ServiceResult` interface to include optional `previewUrl`, `postUrl` fields
  - `sendNewsletter`: parse the JSON response body to extract `previewUrl` if present
  - Add new functions: `sendTestNewsletter(post, adminEmail)` -- sends to a single address, does not need segment ID; `draftLinkedInPost(post, marketingContent)` -- calls service with `lifecycleState: DRAFT`, parses `postUrl` from response; `publishLinkedInPost(postUrl)` -- calls service to publish an existing draft, parses updated `postUrl`
  - Existing `sendLinkedInPost` is replaced by `draftLinkedInPost` + `publishLinkedInPost`
  - Each function follows the same error handling pattern: try/catch around fetch, return `{ ok: false, error }` on failure
  - Service endpoint paths: newsletter service uses `/send` (existing) and `/send-test` (new); LinkedIn service uses `/draft` (new) and `/publish` (new). These paths are assumptions about the external service API -- if different, only this file changes.

  **Patterns to follow:**
  - Existing `sendNewsletter` and `sendLinkedInPost` in `server/utils/serviceClient.ts`

  **Test scenarios:**
  - `sendNewsletter` returns `{ ok: true, previewUrl: "..." }` when service responds with preview URL
  - `sendNewsletter` returns `{ ok: true, previewUrl: undefined }` when service omits preview URL (graceful degradation)
  - `sendTestNewsletter` calls service with `adminEmail` in the payload
  - `draftLinkedInPost` sends marketing content with `lifecycleState: DRAFT`
  - `publishLinkedInPost` sends the draft URL to the publish endpoint
  - All functions return `{ ok: false, error }` when service is unreachable

  **Verification:**
  - TypeScript compiles without errors
  - Existing tests (if any) still pass
  - The new function signatures support the data flow needed by Units 3 and 4

- [ ] **Unit 3: New API routes for newsletter and LinkedIn actions**

  **Goal:** Replace the two existing send routes with four routes: test-newsletter, send-newsletter, draft-linkedin, publish-linkedin.

  **Requirements:** R4, R5, R11, R12, R14, R15

  **Dependencies:** Unit 1 (schema), Unit 2 (service client)

  **Files:**
  - Delete: `server/routes/api/admin/send-linkedin.post.ts`
  - Modify: `server/routes/api/admin/send-newsletter.post.ts`
  - Create: `server/routes/api/admin/test-newsletter.post.ts`
  - Create: `server/routes/api/admin/draft-linkedin.post.ts`
  - Create: `server/routes/api/admin/publish-linkedin.post.ts`

  **Approach:**
  - Every route includes the full auth preamble: `import.meta.dev` guard + `ADMIN_API_SECRET` check (per institutional learning from health endpoint hardening)
  - `test-newsletter.post.ts`: reads post by slug, calls `sendTestNewsletter` with `ADMIN_EMAIL` env var, returns `{ status: 'ok' }`. Does NOT update frontmatter (R11).
  - `send-newsletter.post.ts`: reads post by slug, checks `newsletterSentAt` is null (409 if already sent), calls `sendNewsletter`, updates frontmatter with `newsletterSentAt` (ISO date) and `newsletterPreviewUrl`, returns `{ status: 'ok', newsletterSentAt, newsletterPreviewUrl }`.
  - `draft-linkedin.post.ts`: reads post by slug, checks `linkedinDraftedAt` is null (409 if already drafted), reads `marketing.linkedin` from frontmatter, calls `draftLinkedInPost`, updates frontmatter with `linkedinDraftedAt` (ISO date) and `linkedinPostUrl`, returns `{ status: 'ok', linkedinDraftedAt, linkedinPostUrl }`.
  - `publish-linkedin.post.ts`: reads post by slug, checks `linkedinDraftedAt` is truthy and `linkedinPostedAt` is null (409 if already posted, 400 if no draft), calls `publishLinkedInPost` with existing `linkedinPostUrl`, updates frontmatter with `linkedinPostedAt` (ISO date) and updated `linkedinPostUrl` if changed, returns `{ status: 'ok', linkedinPostedAt, linkedinPostUrl }`.
  - All routes preserve the `sent_but_flag_failed` warning pattern for frontmatter write failures.

  **Patterns to follow:**
  - Existing `server/routes/api/admin/send-newsletter.post.ts` for route structure, error handling, and the `sent_but_flag_failed` pattern

  **Test scenarios:**
  - Test newsletter: sends to ADMIN_EMAIL, returns ok, frontmatter unchanged
  - Send newsletter: sends to segment, updates frontmatter, returns timestamp + preview URL
  - Send newsletter when already sent: returns 409
  - Draft LinkedIn: creates draft, updates frontmatter with `linkedinDraftedAt` + `linkedinPostUrl`
  - Draft LinkedIn when already drafted: returns 409
  - Publish LinkedIn: publishes draft, updates frontmatter with `linkedinPostedAt`
  - Publish LinkedIn with no draft: returns 400
  - Publish LinkedIn when already posted: returns 409
  - All routes return 404 when `!import.meta.dev`
  - All routes return 403 when `ADMIN_API_SECRET` is set but header is wrong

  **Verification:**
  - All four routes respond correctly via manual testing or curl
  - Frontmatter files are updated with correct values after successful sends
  - Error states return proper HTTP status codes

- [ ] **Unit 4: Admin layout and UI redesign**

  **Goal:** Replace the table-based admin UI with a list-based UI using a minimal admin layout shell.

  **Requirements:** R2, R3, R4, R5, R6, R7, R16

  **Dependencies:** Unit 1 (schema fields), Unit 3 (new API routes)

  **Files:**
  - Create: `layouts/admin.vue`
  - Modify: `pages/admin/index.vue`

  **Approach:**

  **Layout (`layouts/admin.vue`):**
  - Header bar with project name (from `runtimeConfig.public.siteName`) linking to `/blog`
  - No topbar, no footer, no site grid
  - Self-contained scoped styles: system-ui font, max-width container
  - Background color and minimal branding to distinguish from the public site

  **Page (`pages/admin/index.vue`):**
  - Set `definePageMeta({ layout: 'admin' })` to use the new layout
  - Replace `<table>` with `<ul class="post-list">` where each `<li>` has:
    - Line 1: post title (plain text)
    - Line 2: newsletter status/actions + LinkedIn status/actions
  - Newsletter display logic per post:
    - `newsletterSentAt === null` → "Send Test" link + "Send" link
    - `newsletterSentAt === "legacy"` → "Sent (legacy)" text
    - `newsletterSentAt` is ISO date → "Sent {formatted date}" + "Preview" link (if `newsletterPreviewUrl` is truthy, opens in new tab)
  - LinkedIn display logic per post:
    - `linkedinDraftedAt === null` → "Draft" link
    - `linkedinDraftedAt` is truthy AND `linkedinPostedAt === null` → "Drafted {date}" + "View" link + "Post" link
    - `linkedinPostedAt` is truthy → "Posted {date}" + "View" link
  - Actions call the new API routes from Unit 3, update local reactive state on success
  - Filter toggle: "Show only unsent" filters to posts where `newsletterSentAt === null` OR `linkedinPostedAt === null`
  - Toast system preserved as-is
  - Health check preserved as-is (moved above the post list)

  **Patterns to follow:**
  - Existing `pages/admin/index.vue` for `definePageMeta`, `queryCollection`, toast system, health check
  - `layouts/none.vue` for minimal layout structure

  **Test scenarios:**
  - Page renders post list with correct status per post
  - "Send Test" calls test-newsletter route, shows toast, does not change status display
  - "Send" calls send-newsletter route, updates status to show sent date + Preview link
  - "Draft" calls draft-linkedin route, updates status to show drafted date + View/Post links
  - "Post" calls publish-linkedin route, updates status to show posted date + View link
  - "Preview" and "View" links open in new tabs
  - Filter toggle hides fully-distributed posts
  - Layout shows header with project name linking to `/blog`
  - No site chrome (topbar, footer) appears on admin page
  - Posts with `"legacy"` markers display "Sent (legacy)" without action buttons

  **Verification:**
  - Admin page at `/admin` renders correctly in dev mode
  - All action buttons trigger correct API routes
  - Status transitions are reflected in the UI immediately
  - Filter toggle works correctly
  - Page is excluded from production builds (existing behavior preserved)

- [ ] **Unit 5: Update CLI script for new schema and actions**

  **Goal:** Update `scripts/distribute.ts` to work with timestamp fields and support new actions (test send, draft, publish).

  **Requirements:** R8, R11, R12, R14, R15

  **Dependencies:** Unit 1 (schema), Unit 2 (service client)

  **Files:**
  - Modify: `scripts/distribute.ts`

  **Approach:**
  - Update `PostInfo` interface: replace `newsletterSent: boolean` and `linkedinSent: boolean` with `newsletterSentAt`, `newsletterPreviewUrl`, `linkedinDraftedAt`, `linkedinPostUrl`, `linkedinPostedAt` (all `string | null`)
  - Update `getAllPosts()` to read new fields from frontmatter
  - Update `printStatus()` to show timestamps or "legacy" instead of Sent/UNSENT
  - Replace `--service newsletter/linkedin` with `--action` flag: `test-newsletter`, `send-newsletter`, `draft-linkedin`, `publish-linkedin`
  - `sendSingle` dispatches to the appropriate service client function based on action
  - `--all-unsent` logic updates: for `send-newsletter` filters to `newsletterSentAt === null`; for `draft-linkedin` filters to `linkedinDraftedAt === null`; for `publish-linkedin` filters to `linkedinDraftedAt !== null && linkedinPostedAt === null`
  - Frontmatter updates write the new timestamp/URL fields instead of booleans
  - `--dry-run` and `--status` preserved

  **Patterns to follow:**
  - Existing `scripts/distribute.ts` structure

  **Test scenarios:**
  - `--status` shows timestamps and "legacy" markers in the status table
  - `--action test-newsletter --slug X` sends test email, no frontmatter change
  - `--action send-newsletter --slug X` sends to segment, writes `newsletterSentAt` and `newsletterPreviewUrl`
  - `--action draft-linkedin --slug X` creates draft, writes `linkedinDraftedAt` and `linkedinPostUrl`
  - `--action publish-linkedin --slug X` publishes draft, writes `linkedinPostedAt`
  - `--all-unsent` with each action filters posts correctly
  - `--dry-run` does not call services or write frontmatter
  - Already-sent/drafted/posted posts are skipped with a warning

  **Verification:**
  - Script runs without errors for all action types
  - Frontmatter is updated correctly after each action
  - `--status` output reflects the new schema accurately
  - `--help` / usage text documents the new `--action` flag

- [ ] **Unit 6: Update health check and .env.example**

  **Goal:** Add `ADMIN_EMAIL` to health check env var validation and update `.env.example` with new variables.

  **Requirements:** R19

  **Dependencies:** None (can run in parallel)

  **Files:**
  - Modify: `server/routes/api/admin/health.get.ts`
  - Modify: `.env.example` (if it exists at repo root)

  **Approach:**
  - Add `checks.adminEmail = checkEnvVar('ADMIN_EMAIL')` to the health endpoint
  - Add `checks.resendSegmentId = checkEnvVar('RESEND_SEGMENT_ID')` (needed for segment sends)
  - Update `.env.example` to document all required env vars: `RESEND_API_KEY`, `RESEND_SEGMENT_ID`, `ADMIN_EMAIL`, `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_SERVICE_URL`, `NEWSLETTER_SERVICE_URL`

  **Patterns to follow:**
  - Existing `checkEnvVar` calls in `health.get.ts`

  **Test scenarios:**
  - Health endpoint reports `ADMIN_EMAIL` and `RESEND_SEGMENT_ID` status
  - Missing `ADMIN_EMAIL` shows as unhealthy in admin UI

  **Verification:**
  - Health check panel in admin UI shows the additional env var checks

## System-Wide Impact

- **Interaction graph**: The admin page calls four API routes which call service client functions which call external services. `updateFrontmatter` writes to the content markdown files on disk, which triggers Nuxt Content's file watcher to rebuild the SQLite content DB. This means the admin UI's `queryCollection` will reflect updated frontmatter after a short delay (typically < 1s in dev).
- **Error propagation**: Service errors bubble up as 502 from the API routes. Frontmatter write failures after a successful service call use the existing `sent_but_flag_failed` pattern to warn the user without losing the send.
- **State lifecycle risks**: The "sent but flag failed" scenario means the service call succeeded but local state is inconsistent. The admin UI must show the warning toast and guide the user to manually fix the frontmatter. This is unchanged from the current implementation.
- **API surface parity**: The CLI script mirrors the same actions as the admin UI routes. Both use the same service client functions and frontmatter update utility.
- **Integration coverage**: Manual testing is the primary verification method for this dev-only tool. Test each action type via the admin UI and verify frontmatter changes via `git diff`.

## Risks & Dependencies

- **External service API assumptions**: The service client assumes the newsletter service returns `{ previewUrl }` and the LinkedIn service returns `{ postUrl }`. If the actual service responses differ, only `serviceClient.ts` needs updating.
- **Migration reformatting**: The migration script must not reformat existing YAML. Using regex-based patching (not `matter.stringify`) mitigates this, but edge cases (multiline values, unusual quoting) should be spot-checked.
- **Content DB rebuild timing**: After `updateFrontmatter` writes to disk, there is a brief window where `queryCollection` returns stale data. The admin UI should update local reactive state immediately on success rather than re-querying.

## Sources & References

- **Origin document:** [docs/brainstorms/2026-03-24-content-distribution-admin-requirements.md](docs/brainstorms/2026-03-24-content-distribution-admin-requirements.md)
- **Prior plan:** [docs/plans/CCM-116-service-integration.md](docs/plans/CCM-116-service-integration.md)
- **Institutional learning:** [docs/solutions/security-issues/admin-health-endpoint-hardening.md](docs/solutions/security-issues/admin-health-endpoint-hardening.md)
- Related PRs: #2 (infrastructure hardening, first CCM-117 PR)
