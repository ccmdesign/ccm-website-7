---
date: 2026-03-24
topic: content-distribution-admin
---

# Content Distribution Admin UI

## Problem Frame

CCM Website and AI Content need a standardized dev-only admin interface to manage newsletter and LinkedIn distribution for blog posts. The current implementation uses boolean flags and a table layout. It needs to evolve to support: test email previews before sending, LinkedIn drafts (not direct posts), timestamps instead of booleans, and a cleaner list-based UI. Varro generates the social media content (under `marketing` frontmatter) that these projects consume.

## Requirements

### Admin UI

- R1. The admin page is a dev-only route at `/admin`, excluded from production builds via `nitro.prerender.ignore` and `import.meta.dev` guards.
- R2. Uses a minimal shell layout: a header bar with the project name linking to the project's blog index. No site topbar/footer.
- R3. Posts are displayed as a `<ul>` list. Each `<li>` shows:
  - First line: post title
  - Second line: status icons and action links for newsletter and LinkedIn
- R4. Newsletter status/actions per post:
  - **Not sent**: "Send Test" link (sends test email to `ADMIN_EMAIL`) + "Send" link (sends to segment)
  - **Test sent**: shows test sent indicator + "Send" link still available
  - **Sent**: shows sent date + "Preview" link (to `newsletterPreviewUrl` from Resend response)
- R5. LinkedIn status/actions per post:
  - **No draft**: "Draft" link (creates draft post on LinkedIn via service, stores URL)
  - **Drafted**: shows drafted date + "View" link (to LinkedIn draft URL) + "Post" link (publishes the draft)
  - **Posted**: shows posted date + "View" link (to published LinkedIn post URL)
- R6. Filter toggle: "Show only unsent posts" filters to posts missing newsletter send OR LinkedIn post.
- R7. Toast notifications for success/error/warning states on all actions.

### Frontmatter Schema

- R8. Replace boolean flags with timestamp + URL fields:
  ```yaml
  newsletterSentAt: null        # ISO date when newsletter was sent
  newsletterPreviewUrl: null    # Resend preview URL (populated after send)
  linkedinDraftedAt: null       # ISO date when draft was created
  linkedinPostUrl: null         # LinkedIn URL (draft URL initially, post URL after publish)
  linkedinPostedAt: null        # ISO date when draft was published
  ```
- R9. Social media content lives in frontmatter under the `marketing` key, matching Varro's structure (linkedin.long, linkedin.short, linkedin.hashtags, etc.). Varro is the generation engine.
- R10. Existing posts with `newsletterSent: true` / `linkedinSent: true` booleans need migration to the new timestamp schema. Posts already marked `true` should get a synthetic past date or `"legacy"` marker.

### Newsletter Flow

- R11. "Send Test" sends the newsletter to the email address in `ADMIN_EMAIL` env var. Does not update frontmatter.
- R12. "Send" sends to the project's Resend segment (`RESEND_SEGMENT_ID`). On success, stores `newsletterSentAt` (current date) and `newsletterPreviewUrl` (from Resend API response) in frontmatter.
- R13. Newsletter email content: full text of the blog post as HTML, with a "Read online" link at the top pointing to the post's URL on the live site.

### LinkedIn Flow

- R14. "Draft" calls the LinkedIn service to create a draft post (`lifecycleState: DRAFT`) using content from `marketing.linkedin` frontmatter. On success, stores `linkedinDraftedAt` and `linkedinPostUrl` (draft URL) in frontmatter.
- R15. "Post" calls the LinkedIn service to publish an existing draft. On success, stores `linkedinPostedAt` and updates `linkedinPostUrl` if the published URL differs.
- R16. "View" links open the LinkedIn URL in a new tab.

### Services and Config

- R17. Newsletter sends go through the newsletter service at `NEWSLETTER_SERVICE_URL` (localhost:3100). Subscriber signup in production uses a Netlify Function calling Resend directly.
- R18. LinkedIn actions go through the LinkedIn service at `LINKEDIN_SERVICE_URL` (localhost:8001). The service handles OAuth and LinkedIn API calls.
- R19. Required env vars per project: `RESEND_API_KEY`, `RESEND_SEGMENT_ID`, `ADMIN_EMAIL`, `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_SERVICE_URL`, `NEWSLETTER_SERVICE_URL`.

### Sharing

- R20. The admin UI, server routes, composables, and CLI script are copied between CCM Website and AI Content. No shared package or Nuxt module. Accept minor drift.

## Success Criteria

- Admin UI shows all posts with correct status for both channels
- Test email arrives at ADMIN_EMAIL with full post content
- Newsletter send updates frontmatter with timestamp and preview URL
- LinkedIn draft creates a viewable draft on LinkedIn
- LinkedIn post publishes the draft and updates frontmatter
- Same admin pattern works in both CCM Website and AI Content projects

## Scope Boundaries

- v1 covers LinkedIn and Newsletter only. Other social channels (X, Bluesky, etc.) are view-only or out of scope.
- Varro has its own admin UI with different layout but similar functionality. Not covered by this spec.
- The LinkedIn service and newsletter service are separate projects. This spec covers the admin UI and Nuxt integration only.
- No automation. All triggers are manual/intentional from the admin UI or CLI.

## Key Decisions

- **List not table**: Posts render as `<li>` with inline status, not a data table. Scans better for a content-focused workflow.
- **Frontmatter timestamps not booleans**: Enables "when" not just "if", and stores URLs for previews/links.
- **Marketing content in frontmatter**: Matches Varro's existing structure. Varro is the content generation engine; CCM and AI Content consume it.
- **Test email before send**: Uses ADMIN_EMAIL env var. No UI input for recipient.
- **LinkedIn drafts first**: Never post directly. Always create draft, review on LinkedIn, then publish.
- **Copy files, not shared package**: Lower complexity. Accept minor drift between projects.
- **Minimal shell layout**: Admin header with project name linking to blog. No site chrome.

## Dependencies / Assumptions

- LinkedIn service at :8001 supports draft creation (`lifecycleState: DRAFT`) and publishing
- Newsletter service at :3100 supports sending to a segment and returns a preview URL
- Resend contacts API accepts `segment_id` for subscriber signup
- LinkedIn access tokens expire in 60 days; token refresh is the LinkedIn service's responsibility

## Outstanding Questions

### Deferred to Planning
- [Affects R10][Technical] Migration strategy for existing boolean frontmatter flags to timestamp schema
- [Affects R13][Needs research] Exact Resend API response shape for preview URL after send
- [Affects R14][Needs research] LinkedIn API draft creation endpoint and response shape for draft URL
- [Affects R3][Technical] How to render the admin list using the project's design tokens/CSS without pulling in the full site styles

## Next Steps

-> /ce:plan for structured implementation planning
