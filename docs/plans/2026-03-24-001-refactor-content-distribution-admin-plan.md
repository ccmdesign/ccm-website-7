---
title: "refactor: Migrate admin UI and frontmatter schema for content distribution"
type: refactor
status: active
date: 2026-03-24
origin: docs/brainstorms/2026-03-24-content-distribution-admin-requirements.md
---

# refactor: Migrate admin UI and frontmatter schema for content distribution

## Overview

Replace boolean distribution flags (`newsletterSent`, `linkedinSent`) with timestamp + URL fields, redesign the admin UI from a table to a list-based layout with distinct actions per channel state, and update the CLI script for the new schema and actions.

## Problem Frame

The current admin UI uses boolean flags and a single "Send" action per channel. This limits visibility (no "when" or "where"), prevents test emails before sending, and forces LinkedIn posts to go live immediately without draft review. The refactor introduces timestamps, preview/draft URLs, a test-send flow, and a draft-then-publish LinkedIn workflow. (see origin: `docs/brainstorms/2026-03-24-content-distribution-admin-requirements.md`)

## Requirements Trace

- R1. Admin page is dev-only at `/admin` (already satisfied, preserve)
- R2. Minimal shell layout: header bar with project name linking to blog, no site chrome
- R3. Posts displayed as `<ul>/<li>` list with title line + status/action line
- R4. Newsletter status/actions: Not sent -> Send Test + Send | Sent -> date + Preview link
- R5. LinkedIn status/actions: No draft -> Draft | Drafted -> date + View + Post | Posted -> date + View
- R6. Filter toggle for unsent posts (newsletter OR LinkedIn not complete)
- R7. Toast notifications for all actions
- R8. Replace boolean flags with timestamp + URL fields in frontmatter schema
- R9. Social media content under `marketing` key in frontmatter (Varro structure)
- R10. Migration script: boolean `true` -> `"legacy"` marker
- R11. "Send Test" sends to `ADMIN_EMAIL`, does not update frontmatter
- R12. "Send" sends to segment, stores `newsletterSentAt` + `newsletterPreviewUrl`
- R13. Newsletter email: full post HTML with "Read online" link
- R14. "Draft" creates LinkedIn draft, stores `linkedinDraftedAt` + `linkedinPostUrl`
- R15. "Post" publishes LinkedIn draft, stores `linkedinPostedAt`
- R16. "View" links open LinkedIn URL in new tab
- R17. Newsletter service at `NEWSLETTER_SERVICE_URL`
- R18. LinkedIn service at `LINKEDIN_SERVICE_URL`
- R19. Required env vars: `RESEND_API_KEY`, `RESEND_SEGMENT_ID`, `ADMIN_EMAIL`, `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_SERVICE_URL`, `NEWSLETTER_SERVICE_URL`
- R20. Files are copied between CCM Website and AI Content, no shared package

## Scope Boundaries

- LinkedIn and Newsletter only; other social channels out of scope
- LinkedIn service and newsletter service are separate projects; this covers Nuxt integration only
- No automation; all triggers are manual from admin UI or CLI
- Varro admin UI is separate and not covered

## Context & Research

### Relevant Code and Patterns

- **Admin page**: `pages/admin/index.vue` -- table-based layout with boolean status, scoped CSS, dev-only guards via `definePageMeta` and `import.meta.dev`
- **Server routes**: `server/routes/api/admin/send-newsletter.post.ts` and `send-linkedin.post.ts` -- read body slug, call service, update frontmatter with boolean
- **Service client**: `server/utils/serviceClient.ts` -- `sendNewsletter()` and `sendLinkedInPost()` functions, returns `{ ok, error }` without response data
- **Frontmatter updater**: `server/utils/updateFrontmatter.ts` -- regex-based YAML patching with per-file locking, `readPostFrontmatter()`, `resolvePostPath()`
- **Content schema**: `content.config.ts` -- Zod schema with `newsletterSent: z.boolean()` and `linkedinSent: z.boolean()`
- **CLI script**: `scripts/distribute.ts` -- uses shared utils, boolean flag checks, batch sending with throttle
- **Migration script**: `scripts/backfill-frontmatter.ts` -- sets booleans to `true` for published posts
- **Layout**: `layouts/none.vue` -- minimal slot-only layout, suitable for admin shell
- **Env config**: `.env.example` -- currently has service URLs and tokens, missing `ADMIN_EMAIL` and `RESEND_SEGMENT_ID` values

### Institutional Learnings

- No `docs/solutions/` directory exists yet. The existing CCM-116 plan documents the rationale for boolean flags and backfill strategy.
- The `updateFrontmatter` utility uses regex patching rather than gray-matter stringify to preserve YAML key ordering -- this pattern must be maintained for the new timestamp/URL fields.
- The serialization in `updateFrontmatter` wraps strings in double quotes and uses `String()` for non-strings. Null values will need to be handled (serialize as `null` without quotes).

## Key Technical Decisions

- **Use `layouts/none.vue` for admin shell**: The admin page will use the existing `none` layout and implement its own header bar in the component. This keeps admin completely decoupled from site chrome. (see origin: R2)
- **`ServiceResult` gains a `data` field**: The service client currently returns `{ ok, error }`. To capture preview URLs and draft URLs from service responses, add an optional `data: Record<string, unknown>` field. This is backward-compatible.
- **Null serialization in `updateFrontmatter`**: The regex-based updater needs to handle `null` values. Serialize `null` as the literal string `null` (no quotes) in YAML.
- **Migration uses `"legacy"` string marker**: Posts with `newsletterSent: true` get `newsletterSentAt: "legacy"`. Posts with `false` or missing get `newsletterSentAt: null`. This distinguishes pre-system posts from genuinely unsent posts.
- **New server routes for new actions**: Add `send-test-newsletter.post.ts`, `draft-linkedin.post.ts`, and `publish-linkedin.post.ts` rather than overloading existing routes. Rename existing routes to match new semantics.
- **`marketing` schema is optional and passthrough**: The `marketing` key in frontmatter is read by the LinkedIn draft route to compose the post body. The Zod schema adds it as an optional object. Varro populates it; the admin UI only reads it.

## Open Questions

### Resolved During Planning

- **How to render admin list without site styles?** Use `layouts/none.vue` (already exists as a bare slot) plus scoped styles in the admin component. The admin page already uses `system-ui` font and scoped CSS.
- **Migration strategy for existing booleans?** Update `scripts/backfill-frontmatter.ts` to convert `newsletterSent: true` -> `newsletterSentAt: "legacy"` and remove the old boolean keys. Run once, verify with `git diff`.
- **How should `updateFrontmatter` handle null?** Add a null check: `const serialized = value === null ? 'null' : typeof value === 'string' ? `"${value}"` : String(value)`. This produces valid YAML.

### Deferred to Implementation

- **Exact Resend API response shape for preview URL**: The newsletter service wraps Resend. The implementer needs to inspect the service's `/send` response to find the preview URL field name. If the service doesn't return it, a service-side change may be needed (out of scope per R17).
- **Exact LinkedIn service endpoints for draft/publish**: The LinkedIn service at :8001 must support draft creation and publishing. The implementer should verify the API contract (`POST /draft`, `POST /publish`, or similar).
- **`marketing.linkedin` schema shape**: Varro generates this. The implementer should inspect a post that Varro has processed to see the exact keys (likely `long`, `short`, `hashtags`). The Zod schema should be permissive (optional object with optional string fields).

## Implementation Units

- [ ] **Unit 1: Frontmatter schema migration**

  **Goal:** Replace boolean flags with timestamp + URL fields in the content schema and migrate existing posts.

  **Requirements:** R8, R9, R10

  **Dependencies:** None

  **Files:**
  - Modify: `content.config.ts`
  - Modify: `scripts/backfill-frontmatter.ts`
  - Modify: `.env.example`

  **Approach:**
  - In `content.config.ts`, replace `newsletterSent: z.boolean()` and `linkedinSent: z.boolean()` with:
    - `newsletterSentAt: z.string().nullable().default(null)` -- ISO date or `"legacy"`
    - `newsletterPreviewUrl: z.string().nullable().default(null)`
    - `linkedinDraftedAt: z.string().nullable().default(null)`
    - `linkedinPostUrl: z.string().nullable().default(null)`
    - `linkedinPostedAt: z.string().nullable().default(null)`
    - `marketing: z.object({ linkedin: z.object({ long: z.string(), short: z.string(), hashtags: z.array(z.string()) }).optional() }).optional()` -- permissive, refine after inspecting Varro output
  - Update `scripts/backfill-frontmatter.ts` to: read each post, if `newsletterSent === true` set `newsletterSentAt: "legacy"`, if `linkedinSent === true` set `linkedinDraftedAt: "legacy"` and `linkedinPostedAt: "legacy"`, remove old boolean keys, add new null fields for any missing keys
  - Add `ADMIN_EMAIL=` to `.env.example`

  **Patterns to follow:**
  - Existing schema pattern in `content.config.ts` (Zod object with defaults)
  - Existing backfill script pattern (idempotent, skip already-migrated)

  **Test scenarios:**
  - Post with `newsletterSent: true, linkedinSent: true` -> migrated to `newsletterSentAt: "legacy"`, `linkedinPostedAt: "legacy"`, old keys removed
  - Post with `newsletterSent: false` or missing -> `newsletterSentAt: null`
  - Post with `published: false` -> skipped by migration
  - Running migration twice produces no changes on second run
  - Nuxt content queries still return posts correctly after schema change

  **Verification:**
  - `npm run dev` starts without content schema errors
  - Blog posts render normally on the front end
  - Migration script output shows correct counts

- [ ] **Unit 2: Service client and frontmatter updater enhancements**

  **Goal:** Extend the service client to return response data (URLs) and add new service functions for test send, draft, and publish. Update frontmatter updater to handle null values.

  **Requirements:** R11, R12, R14, R15, R17, R18

  **Dependencies:** Unit 1 (schema must exist)

  **Files:**
  - Modify: `server/utils/serviceClient.ts`
  - Modify: `server/utils/updateFrontmatter.ts`

  **Approach:**
  - Add `data?: Record<string, unknown>` to `ServiceResult` interface
  - Modify `sendNewsletter()` to parse JSON response and include `data` (for preview URL)
  - Add `sendTestNewsletter(post, adminEmail)` function -- calls newsletter service with a `test: true` flag or a test-specific endpoint
  - Rename `sendLinkedInPost()` to `draftLinkedInPost(post)` -- calls LinkedIn service with `lifecycleState: DRAFT`, returns draft URL in `data`
  - Add `publishLinkedInDraft(postUrl)` -- calls LinkedIn service to publish, returns published URL in `data`
  - In `updateFrontmatter`, fix null serialization: when value is `null`, serialize as literal `null`

  **Patterns to follow:**
  - Existing `serviceClient.ts` pattern: `getEnv()`, try/catch with `{ ok, error }` return
  - Existing `updateFrontmatter` regex approach

  **Test scenarios:**
  - `sendNewsletter()` returns `data.previewUrl` from service response
  - `sendTestNewsletter()` calls service with admin email, does not fail on success
  - `draftLinkedInPost()` returns `data.postUrl` from service response
  - `publishLinkedInDraft()` returns updated URL if changed
  - `updateFrontmatter` correctly writes `null` (not `"null"`) for null values
  - `updateFrontmatter` correctly writes ISO date strings in quotes

  **Verification:**
  - TypeScript compiles without errors
  - Existing newsletter and LinkedIn flows still work with updated client

- [ ] **Unit 3: New server API routes**

  **Goal:** Create server routes for test send, newsletter send (with timestamp), LinkedIn draft, and LinkedIn publish. Refactor existing routes.

  **Requirements:** R4, R5, R11, R12, R14, R15

  **Dependencies:** Unit 2 (service client functions)

  **Files:**
  - Create: `server/routes/api/admin/send-test-newsletter.post.ts`
  - Modify: `server/routes/api/admin/send-newsletter.post.ts`
  - Create: `server/routes/api/admin/draft-linkedin.post.ts`
  - Create: `server/routes/api/admin/publish-linkedin.post.ts`
  - Remove: `server/routes/api/admin/send-linkedin.post.ts` (replaced by draft + publish)

  **Approach:**
  - `send-test-newsletter.post.ts`: reads slug, calls `sendTestNewsletter()` with `ADMIN_EMAIL` env var, returns success. No frontmatter update.
  - `send-newsletter.post.ts`: refactor to check `newsletterSentAt` instead of `newsletterSent`, on success store `newsletterSentAt` (ISO date) and `newsletterPreviewUrl` from response data.
  - `draft-linkedin.post.ts`: reads slug, reads `marketing.linkedin` from frontmatter, calls `draftLinkedInPost()`, stores `linkedinDraftedAt` and `linkedinPostUrl`.
  - `publish-linkedin.post.ts`: reads slug, reads `linkedinPostUrl` from frontmatter (must exist), calls `publishLinkedInDraft()`, stores `linkedinPostedAt` and updates `linkedinPostUrl` if changed.
  - All routes preserve existing dev-only guard and optional `ADMIN_API_SECRET` check patterns.

  **Patterns to follow:**
  - Existing `send-newsletter.post.ts` structure: dev guard, secret check, slug validation, service call, frontmatter update, error handling with `sent_but_flag_failed` fallback

  **Test scenarios:**
  - Test send returns success without modifying frontmatter
  - Newsletter send stores ISO timestamp and preview URL in frontmatter
  - Draft creates LinkedIn draft and stores URL + timestamp
  - Publish fails gracefully if no draft URL exists (409 error)
  - Publish stores posted timestamp and potentially updated URL
  - All routes return 404 in production mode
  - All routes return 400 for missing/invalid slug

  **Verification:**
  - Each route responds correctly via `$fetch` from the admin page
  - Frontmatter files show correct timestamp/URL values after successful operations

- [ ] **Unit 4: Admin UI redesign**

  **Goal:** Replace the table layout with a list-based UI, add per-channel status/action rendering, implement the minimal shell layout, and wire up all new endpoints.

  **Requirements:** R2, R3, R4, R5, R6, R7, R16

  **Dependencies:** Unit 3 (API routes must exist)

  **Files:**
  - Modify: `pages/admin/index.vue`

  **Approach:**
  - Set `definePageMeta({ layout: 'none' })` to use the bare layout
  - Add admin shell header: project name ("CCM Design") linking to `/blog`
  - Replace `<table>` with `<ul class="post-list">` where each `<li>` has two lines:
    - Line 1: post title (as link to `/blog/{slug}`)
    - Line 2: newsletter status + actions, LinkedIn status + actions
  - Newsletter rendering logic:
    - If `newsletterSentAt` is null: show "Send Test" link + "Send" link
    - If `newsletterSentAt` is truthy: show sent date (or "legacy") + "Preview" link (if `newsletterPreviewUrl` exists)
  - LinkedIn rendering logic:
    - If `linkedinDraftedAt` is null: show "Draft" link
    - If `linkedinDraftedAt` is truthy and `linkedinPostedAt` is null: show drafted date + "View" link + "Post" link
    - If `linkedinPostedAt` is truthy: show posted date + "View" link
  - Update `filteredPosts` computed to filter on `!newsletterSentAt || !linkedinPostedAt`
  - Wire each action link to call the corresponding API route via `$fetch`
  - Update local reactive state after successful actions (set timestamps, URLs)
  - Preserve existing toast system
  - Add loading states per action (reuse existing `sending` ref pattern with more granular keys)

  **Patterns to follow:**
  - Existing admin page: `definePageMeta`, `import.meta.dev` guard, `queryCollection('blog')`, `$fetch` for API calls, toast system
  - Scoped CSS with `system-ui` font

  **Test scenarios:**
  - Page loads with correct status for each post based on timestamp/URL fields
  - "Send Test" calls test endpoint, shows toast, does not change post status display
  - "Send" calls send endpoint, updates display to show sent date + Preview link
  - "Draft" calls draft endpoint, updates display to show drafted date + View + Post
  - "Post" calls publish endpoint, updates display to show posted date + View
  - "View" and "Preview" links open in new tab
  - Filter toggle correctly shows only posts missing newsletter send OR LinkedIn post
  - Page is inaccessible in production (404)
  - Toast appears for success, error, and warning states

  **Verification:**
  - Admin page renders the post list with correct status indicators
  - All action buttons trigger the right endpoints and update the UI
  - No site chrome visible (no topbar, no footer)

- [ ] **Unit 5: CLI script update**

  **Goal:** Update the distribute script for new timestamp fields and new actions (test send, draft, publish).

  **Requirements:** R8, R11, R14, R15, R19

  **Dependencies:** Unit 2 (service client functions)

  **Files:**
  - Modify: `scripts/distribute.ts`

  **Approach:**
  - Update `PostInfo` interface: replace `newsletterSent`/`linkedinSent` booleans with `newsletterSentAt`/`linkedinDraftedAt`/`linkedinPostedAt` string/null fields
  - Update `getAllPosts()` to read new fields from frontmatter
  - Update `printStatus()` to show timestamps instead of Sent/UNSENT
  - Update `sendSingle()` to check timestamp fields instead of boolean flags, and to write timestamps + URLs after successful operations
  - Add new `--action` flag with values: `test` (newsletter only), `send` (newsletter), `draft` (linkedin), `publish` (linkedin)
  - Update usage help text
  - Preserve throttle, dry-run, and batch modes

  **Patterns to follow:**
  - Existing `distribute.ts` structure: arg parsing, `getAllPosts()`, `sendSingle()`, batch loop with throttle

  **Test scenarios:**
  - `--status` shows timestamps and URLs in status table
  - `--service newsletter --action test --slug X` sends test email without updating frontmatter
  - `--service newsletter --action send --slug X` sends and stores timestamp + URL
  - `--service linkedin --action draft --slug X` creates draft and stores timestamp + URL
  - `--service linkedin --action publish --slug X` publishes and stores timestamp
  - `--all-unsent` correctly identifies posts based on timestamp fields
  - `--dry-run` still works correctly

  **Verification:**
  - Script runs without TypeScript errors
  - Status output shows new field format
  - Single-slug operations correctly call new service functions and update frontmatter

## System-Wide Impact

- **Content schema change**: All blog content queries will return the new fields instead of booleans. Any other code reading `newsletterSent` or `linkedinSent` from blog posts will break. Search the codebase for these field names before implementation.
- **Frontmatter file changes**: The migration script modifies every published blog post's frontmatter. This creates a large git diff. Run migration as a dedicated commit.
- **Service client interface change**: `ServiceResult` gains a `data` field. This is additive and backward-compatible, but callers should be updated to use it.
- **API route renaming**: `send-linkedin` is replaced by `draft-linkedin` and `publish-linkedin`. If anything references the old endpoint, it will 404.
- **Error propagation**: The existing pattern of returning `sent_but_flag_failed` when the service succeeds but frontmatter update fails should be preserved for all new routes.
- **State lifecycle**: LinkedIn posts now have a three-state lifecycle (none -> drafted -> posted). The admin UI and CLI must handle each transition correctly and prevent invalid transitions (e.g., publishing without a draft).

## Risks & Dependencies

- **Newsletter service must return preview URL**: If the newsletter service at `:3100` does not include a preview URL in its response, R12 cannot be fully satisfied. Mitigation: check service response during implementation; if missing, file a service-side issue and make `newsletterPreviewUrl` best-effort.
- **LinkedIn service must support draft lifecycle**: The LinkedIn service must support creating drafts (`lifecycleState: DRAFT`) and publishing them separately. If it only supports direct posting, R14/R15 need adjustment. Mitigation: verify service API before implementing Unit 3.
- **Large migration diff**: ~90+ blog post files modified. Mitigation: run migration as a single dedicated commit with a clear message. Review diff carefully for formatting issues.
- **`updateFrontmatter` regex fragility**: The regex-based YAML patcher may struggle with nested keys (the `marketing` object). Mitigation: `marketing` is written by Varro, not by the admin UI. The admin routes only write flat top-level keys (`newsletterSentAt`, etc.), which the regex handles well.

## Sources & References

- **Origin document:** [docs/brainstorms/2026-03-24-content-distribution-admin-requirements.md](docs/brainstorms/2026-03-24-content-distribution-admin-requirements.md)
- Related plan: [docs/plans/CCM-116-service-integration.md](docs/plans/CCM-116-service-integration.md)
- Related code: `pages/admin/index.vue`, `server/routes/api/admin/`, `server/utils/`, `scripts/distribute.ts`
