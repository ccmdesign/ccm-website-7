# CCM-116: Service Integration — Implementation Plan

deepened: 2026-03-24

## Overview

Connect ccm-website-7 (Nuxt 3 SSG on Netlify) to the shared LinkedIn Post and Newsletter Send services. Three workstreams:

1. Replace Mailchimp newsletter signup with Resend (production)
2. Add frontmatter distribution flags + backfill existing posts
3. Build dev-only admin UI and CLI for triggering LinkedIn/newsletter sends

---

## Phase 1: Schema & Frontmatter Backfill

### 1a. Update content schema

**File:** `content.config.ts`

Add two fields to the `blog` collection schema:

```ts
newsletterSent: z.boolean().default(false),
linkedinSent: z.boolean().default(false),
```

These default to `false` so existing posts without the flags parse correctly.

### 1b. Backfill existing posts

**Scope:** ~100 markdown files in `content/blog/`

Write a Node script (`scripts/backfill-frontmatter.ts`) that:
1. Reads every `.md` file in `content/blog/` (excluding `_drafts/`)
2. Parses YAML frontmatter
3. Adds `newsletterSent: true` and `linkedinSent: true` to all existing published posts (they were already distributed through old channels)
4. Writes the file back, preserving body content

Run once, verify with `git diff`, commit.

**Why `true`:** Existing posts were already published before this system existed — marking them `false` would surface them as "unsent" in the admin UI. Only new posts going forward should default to `false`.

**Backfill edge cases to handle:**
- Posts with `published: false` (drafts) should be skipped — they were never distributed
- Posts inside `_drafts/` subdirectory must be excluded (the glob already handles this, but verify)
- The backfill script must be idempotent — running it twice should not corrupt files that already have the flags
- Verify that the YAML serializer preserves existing frontmatter key ordering and does not re-quote strings unnecessarily. Use a library like `gray-matter` that round-trips frontmatter cleanly rather than a naive regex approach

### 1c. Add `.env.example`

Create `.env.example` with:

```
LINKEDIN_SERVICE_URL=http://localhost:8001
LINKEDIN_ACCESS_TOKEN=
NEWSLETTER_SERVICE_URL=http://localhost:3100
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
```

Update `nuxt.config.ts` `runtimeConfig` to expose non-secret service URLs:

```ts
runtimeConfig: {
  // Private (server-only in dev, not available in static build)
  linkedinAccessToken: '',
  resendApiKey: '',
  resendAudienceId: '',
  public: {
    // ...existing config...
    linkedinServiceUrl: 'http://localhost:8001',
    newsletterServiceUrl: 'http://localhost:3100',
  }
}
```

Note: Since the site is SSG, `runtimeConfig` private keys are only available in `server/` routes during `nuxt dev`. This is fine because the admin features are dev-only.

---

## Phase 2: Replace Mailchimp Newsletter Signup (Production)

### 2a. Create Netlify Function for subscriber signup

**File:** `netlify/functions/subscribe.ts`

This serverless function:
1. Accepts POST `{ email: string }`
2. Validates the email format server-side (regex or lightweight validator)
3. Calls the Resend API to add the email to the audience
4. Returns success/error with appropriate CORS headers

Why a Netlify Function instead of calling the newsletter service directly: the deployed site is static and cannot reach `localhost:3100`. The Netlify Function runs server-side with access to env vars (`RESEND_API_KEY`, `RESEND_AUDIENCE_ID`).

```ts
// netlify/functions/subscribe.ts
import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' }

  const { email } = JSON.parse(event.body || '{}')
  if (!email) return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) }

  const res = await fetch(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    const err = await res.text()
    return { statusCode: res.status, body: JSON.stringify({ error: err }) }
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) }
}
```

#### Security and hardening considerations for the subscribe endpoint

The Netlify Function is a public, unauthenticated endpoint. Without mitigation, it is vulnerable to abuse:

1. **Rate limiting (required):** Add Netlify's built-in rate limiting via a `config` export. A reasonable starting point is 10 requests per 60 seconds per IP. This prevents bulk signup abuse and protects the Resend API quota (Resend's default is 2 requests/second/team).

   ```ts
   export const config = {
     rateLimit: {
       windowLimit: 10,
       windowSize: 60,
       aggregateBy: ["ip"],
     },
   }
   ```

2. **Email validation (required):** Validate email format server-side before calling Resend. A basic regex or the same validation the form uses client-side. This prevents junk payloads from consuming API quota.

3. **CORS headers (recommended):** Return `Access-Control-Allow-Origin` restricted to `https://ccmdesign.com` rather than `*`. This prevents other sites from using the endpoint as a proxy.

4. **Error message opacity (recommended):** Do not forward raw Resend error text to the client. Map known error codes to safe user-facing messages to avoid leaking API internals.

5. **Resend API endpoint verification:** The plan uses `https://api.resend.com/audiences/{id}/contacts`. Per current Resend docs, the contacts create endpoint is `POST /contacts` with `audienceId` in the request body (not the URL path). Verify the correct endpoint shape during implementation — the Resend API may accept both forms, but the documented form is body-based.

### 2b. Update `ccmCtaSection.vue`

**File:** `components/organisms/ccmCtaSection.vue`

Replace the Mailchimp JSONP call in `handleSubmit()` with a fetch to the Netlify Function:

```js
async function handleSubmit() {
  if (!email.value || subscribed.value) return
  try {
    const res = await fetch('/.netlify/functions/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })
    if (res.ok) {
      subscribed.value = true
      scrambleText('Subscribed')
    }
  } catch (e) {
    console.error('Subscribe failed:', e)
  }
}
```

The scramble animation and all existing UI/styles remain unchanged.

**Note on removing Mailchimp:** The current `ccmCtaSection.vue` uses a JSONP/script-injection pattern to call Mailchimp. When replacing it, also remove the `window[callbackName]` callback and the dynamic `<script>` element creation — do not leave dead code paths.

### 2c. Update `ctaSignup.vue`

**File:** `components/content/ctaSignup.vue`

This component currently has a non-functional form. Wire it up to the same Netlify Function endpoint. Extract the subscribe logic into a composable if both components share it.

**Optional composable:** `composables/useNewsletterSubscribe.ts`

```ts
export function useNewsletterSubscribe() {
  const email = ref('')
  const subscribed = ref(false)
  const error = ref<string | null>(null)

  async function subscribe() {
    error.value = null
    const res = await fetch('/.netlify/functions/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })
    if (res.ok) {
      subscribed.value = true
    } else {
      error.value = 'Subscription failed'
    }
  }

  return { email, subscribed, error, subscribe }
}
```

### 2d. Update `netlify.toml`

Add functions directory config:

```toml
[functions]
  directory = "netlify/functions"
```

---

## Phase 3: Dev-Only Admin UI (`/admin`)

### 3a. Create the admin page

**File:** `pages/admin/index.vue`

Dev-only guard — redirect in production:

```js
if (process.env.NODE_ENV !== 'development') {
  navigateTo('/')
}
```

UI features:
- Table listing all blog posts from the `blog` collection
- Columns: title, date, `newsletterSent` status, `linkedinSent` status
- Action buttons: "Send Newsletter" / "Send LinkedIn" (disabled when already sent)
- Filter toggle: show only unsent posts
- Status feedback: loading spinner, success/error toast per action

#### Critical: Exclude `/admin` from static generation

The `process.env.NODE_ENV` guard runs client-side and only redirects after the page loads. The real risk is that `nuxt generate` will **prerender the admin page into the static build**, making it a publicly accessible HTML file (even though it redirects, the markup and JS are shipped).

**Required mitigation — add to `nuxt.config.ts`:**

```ts
nitro: {
  prerender: {
    ignore: [
      '/blog/**',
      '/blog',
      '/layouts/**',
      '/layouts',
      '/admin',       // <-- add this
      '/admin/**',    // <-- add this
    ],
  },
},
```

Alternatively, use `routeRules` to disable SSR for the admin route entirely:

```ts
routeRules: {
  '/admin/**': { ssr: false, prerender: false },
},
```

This ensures the admin page is never included in the production build output. The `process.env.NODE_ENV` guard remains as a belt-and-suspenders fallback.

**Add to testing checklist:** After `nuxt generate`, verify that `.output/public/admin/` does not exist.

### 3b. Create dev-only server routes

These Nitro server routes are only available during `nuxt dev` (the static build excludes server routes).

**File:** `server/routes/api/admin/send-newsletter.post.ts`

```ts
export default defineEventHandler(async (event) => {
  const { slug } = await readBody(event)
  // 1. Read the blog post markdown file
  // 2. Build newsletter content (post title, excerpt, link)
  // 3. POST to newsletter service at NEWSLETTER_SERVICE_URL
  // 4. On success, update frontmatter: newsletterSent: true
  // 5. Return result
})
```

**File:** `server/routes/api/admin/send-linkedin.post.ts`

```ts
export default defineEventHandler(async (event) => {
  const { slug } = await readBody(event)
  // 1. Read the blog post markdown file
  // 2. Build LinkedIn teaser (title + excerpt + URL)
  // 3. POST to LinkedIn service at LINKEDIN_SERVICE_URL
  // 4. On success, update frontmatter: linkedinSent: true
  // 5. Return result
})
```

#### Trigger-and-update flow: edge cases

The send-then-update-frontmatter flow has a critical failure window:

1. **Service call succeeds but frontmatter write fails:** The post is actually sent to LinkedIn/newsletter, but the `.md` file still says `false`. The admin UI will show an unsent state, and a retry will send it again (duplicate send). **Mitigation:** Wrap the frontmatter write in a try/catch and return a clear "sent but flag update failed" status to the UI. The admin UI should show a distinct warning state for this scenario rather than a generic error.

2. **Concurrent sends for the same slug:** If the user clicks "Send Newsletter" and "Send LinkedIn" at the same time, both server routes will read and write the same `.md` file concurrently. YAML frontmatter writes are not atomic — one write can clobber the other. **Mitigation:** Either serialize writes per-file (simplest: use a mutex/lock map keyed by slug in the server process) or have `updateFrontmatter` re-read the file immediately before writing to minimize the race window.

3. **Slug-to-filepath resolution:** The server routes receive a `slug` but need to find and read the actual `.md` file on disk. The plan should specify how slug maps to filepath. The convention in the repo is that the filename matches the slug (e.g., `content/blog/{slug}.md`), but this should be validated — check whether any posts have a `slug` frontmatter field that differs from the filename.

### 3c. Shared utility: frontmatter updater

**File:** `server/utils/updateFrontmatter.ts`

```ts
// Reads a .md file, parses YAML frontmatter, updates specified fields, writes back
export async function updateFrontmatter(
  filePath: string,
  updates: Record<string, unknown>
): Promise<void>
```

This is used by both admin server routes and the CLI script. It must:
- Preserve the existing frontmatter key order
- Preserve the markdown body exactly
- Not add trailing whitespace or change line endings

**Important: file placement.** The plan originally places this in `utils/updateFrontmatter.ts`. In Nuxt, the `utils/` directory is auto-imported into both client and server bundles. Since this utility uses `fs` (Node.js filesystem API), it **cannot** be in `utils/` — it will cause a build error when Vite tries to bundle it for the client. Place it in `server/utils/` instead, where Nitro auto-imports it only for server routes. For the CLI script (`scripts/distribute.ts`), import it directly via a relative path (`../server/utils/updateFrontmatter`).

### 3d. Shared utility: service callers

**File:** `server/utils/serviceClient.ts`

```ts
export async function sendNewsletter(post: { title: string; excerpt: string; url: string; body?: string }): Promise<{ ok: boolean; error?: string }>

export async function sendLinkedInPost(post: { title: string; excerpt: string; url: string }): Promise<{ ok: boolean; error?: string }>
```

Reads service URLs and tokens from env vars. Used by both server routes and CLI.

**Same placement note as 3c:** This must be in `server/utils/`, not `utils/`, because it reads env vars and makes server-side HTTP calls. The CLI script imports it directly.

---

## Phase 4: CLI Script

**File:** `scripts/distribute.ts`

A standalone Node/tsx script callable from the terminal or by Claude Code.

```
Usage:
  npx tsx scripts/distribute.ts --service newsletter --slug <slug>
  npx tsx scripts/distribute.ts --service linkedin --slug <slug>
  npx tsx scripts/distribute.ts --service newsletter --all-unsent
  npx tsx scripts/distribute.ts --service linkedin --all-unsent
  npx tsx scripts/distribute.ts --status
```

Behavior:
- `--slug <slug>`: Send for a specific post
- `--all-unsent`: Find all posts where the relevant flag is `false` and send each
- `--status`: Print a table of all posts with their sent/unsent status
- On success, updates frontmatter via the shared `updateFrontmatter` utility
- Reads `.env` via `dotenv` (already a dependency)
- Exits with non-zero code on failure

#### CLI batch send: rate limiting and partial failure

When using `--all-unsent`, the script iterates over all posts with `newsletterSent: false` (or `linkedinSent: false`) and sends each one. Edge cases:

1. **Resend rate limit (2 req/sec/team):** If there are many unsent posts, rapid sequential calls will hit the Resend API rate limit (429). The CLI should add a delay between calls (at least 500ms) or respect `retry-after` headers. For LinkedIn, check the LinkedIn service's rate limits as well.

2. **Partial failure:** If the 5th of 20 posts fails, the script should not exit immediately. It should continue processing remaining posts, collect errors, and report a summary at the end. Already-updated frontmatter flags for successful posts should be preserved. The exit code should be non-zero if any post failed.

3. **Dry-run mode:** Consider adding a `--dry-run` flag that prints what would be sent without actually calling services or updating frontmatter. This is useful for verifying the unsent post list before triggering real sends.

---

## Phase 5: Testing & Validation

### Manual testing checklist

- [ ] Newsletter signup on deployed Netlify preview (Netlify Function)
- [ ] Newsletter signup in local dev
- [ ] Admin UI lists all posts with correct sent status
- [ ] Admin UI "Send Newsletter" button calls service, updates frontmatter
- [ ] Admin UI "Send LinkedIn" button calls service, updates frontmatter
- [ ] CLI `--status` shows correct post status
- [ ] CLI `--slug` sends and updates frontmatter
- [ ] CLI `--all-unsent` processes only unsent posts
- [ ] Admin route redirects to `/` in production build
- [ ] **After `nuxt generate`, verify `.output/public/admin/` directory does not exist**
- [ ] Backfill script correctly sets `true` on all existing posts
- [ ] Backfill script is idempotent (running twice produces no diff)
- [ ] Rate limiting on subscribe endpoint rejects excessive requests
- [ ] CLI `--all-unsent` respects rate limits and handles partial failures

### Dev dependency additions

- `@netlify/functions` (types for Netlify Functions)
- `tsx` (already implied by project using TypeScript scripts; may need explicit install)
- `gray-matter` (for safe YAML frontmatter round-tripping in the backfill script and `updateFrontmatter` utility)

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Subscribe endpoint abuse (bot signups, spam) | High | Netlify rate limiting (config export), server-side email validation, restricted CORS origin |
| Admin page shipped in production build | High | Exclude `/admin/**` from prerender in `nuxt.config.ts`; verify absence in `.output/public/` after generate |
| Duplicate sends on retry after partial failure | Medium | Return distinct "sent but flag update failed" status; admin UI shows warning state; CLI collects and reports errors |
| `utils/` auto-import bundles Node.js code for client | Medium | Place `updateFrontmatter.ts` and `serviceClient.ts` in `server/utils/` instead of `utils/` |
| Concurrent frontmatter writes clobber each other | Low | Serialize writes per slug or re-read before write |
| Resend API rate limit hit during batch CLI sends | Medium | Add inter-request delay; respect `retry-after` header; report partial results |
| Resend contacts API endpoint URL may differ from plan | Low | Verify endpoint shape during implementation; current Resend docs show body-based `audienceId` |

---

## File Summary

| File | Phase | Type |
|------|-------|------|
| `content.config.ts` | 1a | Modify |
| `scripts/backfill-frontmatter.ts` | 1b | New |
| `.env.example` | 1c | New |
| `nuxt.config.ts` | 1c, 3a | Modify |
| `netlify/functions/subscribe.ts` | 2a | New |
| `components/organisms/ccmCtaSection.vue` | 2b | Modify |
| `components/content/ctaSignup.vue` | 2c | Modify |
| `composables/useNewsletterSubscribe.ts` | 2c | New (optional) |
| `netlify.toml` | 2d | Modify |
| `pages/admin/index.vue` | 3a | New |
| `server/routes/api/admin/send-newsletter.post.ts` | 3b | New |
| `server/routes/api/admin/send-linkedin.post.ts` | 3b | New |
| `server/utils/updateFrontmatter.ts` | 3c | New |
| `server/utils/serviceClient.ts` | 3d | New |
| `scripts/distribute.ts` | 4 | New |

---

## Implementation Order

1. **Phase 1** (schema + backfill) — no external dependencies, unblocks everything
2. **Phase 2** (Mailchimp replacement) — independent, can be done in parallel with Phase 3
3. **Phase 3** (admin UI + server routes) — depends on Phase 1
4. **Phase 4** (CLI) — depends on Phase 1, shares code with Phase 3
5. **Phase 5** (testing) — after all phases

---

## Open Questions

1. **LinkedIn teaser content format** — Should we add a `linkedinTeaser` frontmatter field, or auto-generate from title + excerpt? The spec says TBD. Recommendation: start with auto-generated (title + excerpt + URL) and add an optional `linkedinTeaser` field for overrides.

2. **Newsletter email content** — Full post HTML or a summary template? Recommendation: summary template (title, excerpt, "Read more" link) to start. Full HTML rendering would require a build step or markdown-to-HTML conversion at send time.

3. **Resend API for subscriber signup** — The spec mentions calling the newsletter-send service (`:3100`), but the deployed static site cannot reach `localhost`. The plan uses a Netlify Function calling the Resend API directly. Confirm this is acceptable vs. deploying the newsletter service as a public endpoint.

4. **Admin UI subscriber count** — The spec asks whether the admin route should show Resend audience subscriber count. This is trivial to add (one API call) but needs the `RESEND_API_KEY` available in dev. Recommend yes, include it.

5. **Netlify Functions vs. Netlify Edge Functions** — Standard Functions are sufficient here. Edge Functions would add complexity without benefit for a simple subscribe endpoint.

6. **LinkedIn and Newsletter service API contracts** — The plan assumes REST POST endpoints. The implementer needs to confirm the exact request/response shapes for both services (`:8001` and `:3100`). **This is a blocking dependency for Phase 3 and Phase 4.** Before implementation begins, the service contracts should be documented or the services should expose an OpenAPI/Swagger spec. Without this, the `serviceClient.ts` utility cannot be written correctly.

### Resolved During Deepening

7. **Utility file placement** — Resolved: `updateFrontmatter.ts` and `serviceClient.ts` must go in `server/utils/`, not `utils/`, to avoid client-side bundling of Node.js APIs. The CLI script imports them directly via relative path.

8. **Admin page in production build** — Resolved: The `process.env.NODE_ENV` guard alone is insufficient. The route must be excluded from prerendering via `nitro.prerender.ignore` or `routeRules` in `nuxt.config.ts`.
