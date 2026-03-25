# CCM Website — Service Integration

How ccm-website-7 (Nuxt 3 SSG on Netlify) connects to the shared LinkedIn Post and Newsletter Send services.

## Newsletter Signup (Replace Mailchimp)

- Current: Mailchimp JSONP in `ccmCtaSection.vue`
- Target: call newsletter-send service (:3100) to add subscriber to Resend audience
- This is a **production feature** — needs a Netlify Function or direct client-side call to the service

## Content Distribution (LinkedIn + Newsletter)

### Frontmatter Flags

Every blog post gets two new attributes:

```yaml
newsletterSent: false
linkedinSent: false
```

- Existing posts need these added (backfill)
- Nuxt Content schema (`content.config.ts`) needs to define these fields
- LinkedIn teaser content: TBD — frontmatter attribute or separate file

### Trigger Mechanisms

Both are **local dev tools** (not production) because they write to source `.md` files:

**Admin UI (`/admin`)**
- Dev mode only route
- Lists all posts with their `newsletterSent` / `linkedinSent` status
- Buttons to trigger each service per post
- On success, updates frontmatter flag to `true`

**CLI script**
- Same functionality, callable by Claude Code or manually
- Can filter by status (e.g. "send all unsent LinkedIn posts")

### Flow

1. Write/publish blog post with `newsletterSent: false`, `linkedinSent: false`
2. Trigger via admin UI or CLI (locally)
3. Service is called (LinkedIn :8001 or Newsletter :3100)
4. On success → frontmatter flag updated to `true`
5. Commit changes
6. Netlify redeploy picks up new state

### Constraints

- Deployed site is static — no server routes, no filesystem writes
- Admin route and CLI only work in local dev
- Services must be running locally when triggering
- Each trigger is manual/intentional — no automation

### Env Vars Needed

```
LINKEDIN_SERVICE_URL=http://localhost:8001
LINKEDIN_ACCESS_TOKEN=...
NEWSLETTER_SERVICE_URL=http://localhost:3100
RESEND_API_KEY=re_...
RESEND_AUDIENCE_ID=aud_...
```

## Open Questions

- LinkedIn teaser content format — frontmatter field or separate `.md` file?
- Newsletter content for blog posts — full post HTML or a custom template?
- Should the admin route also show newsletter subscriber count (via Resend API)?
