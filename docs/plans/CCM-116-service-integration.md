# CCM-116: Service Integration — Implementation Plan

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
2. Calls the Resend API to add the email to the audience
3. Returns success/error

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

### 3c. Shared utility: frontmatter updater

**File:** `utils/updateFrontmatter.ts`

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

### 3d. Shared utility: service callers

**File:** `utils/serviceClient.ts`

```ts
export async function sendNewsletter(post: { title: string; excerpt: string; url: string; body?: string }): Promise<{ ok: boolean; error?: string }>

export async function sendLinkedInPost(post: { title: string; excerpt: string; url: string }): Promise<{ ok: boolean; error?: string }>
```

Reads service URLs and tokens from env vars. Used by both server routes and CLI.

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
- [ ] Backfill script correctly sets `true` on all existing posts

### Dev dependency additions

- `@netlify/functions` (types for Netlify Functions)
- `tsx` (already implied by project using TypeScript scripts; may need explicit install)

---

## File Summary

| File | Phase | Type |
|------|-------|------|
| `content.config.ts` | 1a | Modify |
| `scripts/backfill-frontmatter.ts` | 1b | New |
| `.env.example` | 1c | New |
| `nuxt.config.ts` | 1c | Modify |
| `netlify/functions/subscribe.ts` | 2a | New |
| `components/organisms/ccmCtaSection.vue` | 2b | Modify |
| `components/content/ctaSignup.vue` | 2c | Modify |
| `composables/useNewsletterSubscribe.ts` | 2c | New (optional) |
| `netlify.toml` | 2d | Modify |
| `pages/admin/index.vue` | 3a | New |
| `server/routes/api/admin/send-newsletter.post.ts` | 3b | New |
| `server/routes/api/admin/send-linkedin.post.ts` | 3b | New |
| `utils/updateFrontmatter.ts` | 3c | New |
| `utils/serviceClient.ts` | 3d | New |
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

6. **LinkedIn and Newsletter service API contracts** — The plan assumes REST POST endpoints. The implementer needs to confirm the exact request/response shapes for both services (`:8001` and `:3100`).
