---
status: resolved
priority: p1
issue_id: "001"
tags: [code-review, security]
dependencies: []
---

# Admin server routes have no authentication

## Problem Statement

The server routes `/api/admin/send-newsletter` and `/api/admin/send-linkedin` accept POST requests with no authentication or authorization. During development, any process on the network can trigger newsletter sends or LinkedIn posts. More critically, if these routes accidentally survive into a production deployment (e.g., if the static-generation exclusion fails or the site is ever served via SSR), they would be publicly accessible.

## Findings

- `server/routes/api/admin/send-newsletter.post.ts` and `server/routes/api/admin/send-linkedin.post.ts` call `readBody(event)` and proceed directly to sending without checking any auth token or dev-mode guard.
- The only protection is that `nuxt generate` should exclude them, but server routes are Nitro-level and may still be bundled depending on preset and deployment.
- No middleware, API key check, or environment guard exists on these endpoints.

## Proposed Solutions

### Option 1: Add a shared secret / API key check

**Approach:** Add middleware or an inline guard that checks for an `ADMIN_API_SECRET` header. In dev, auto-set it; in production, require it or reject.

**Pros:**
- Simple to implement
- Works in both dev and potential SSR deployments

**Cons:**
- Requires managing another env var

**Effort:** 1-2 hours

**Risk:** Low

---

### Option 2: Nitro dev-only route guard

**Approach:** Use `import.meta.dev` check at the top of each handler to return 404 in production.

**Pros:**
- Zero config
- Guarantees routes are inert in production

**Cons:**
- Routes still exist in the bundle (dead code)

**Effort:** 30 minutes

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `server/routes/api/admin/send-newsletter.post.ts`
- `server/routes/api/admin/send-linkedin.post.ts`

## Resources

- **PR:** #1

## Acceptance Criteria

- [ ] Admin routes reject unauthenticated requests
- [ ] Admin routes return 404 or 403 in production builds
- [ ] Verified with `nuxt generate` that routes are not callable

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified zero-auth admin endpoints during PR #1 review
- Confirmed no middleware or guards present
- Assessed risk as P1 due to potential for accidental production exposure

### 2026-03-24 - Resolved

**By:** Claude Code

**Actions:**
- Added `import.meta.dev` guard to both admin routes — returns 404 in production
- Added optional `ADMIN_API_SECRET` header check for dev-mode security
- Both routes now reject unauthenticated requests when secret is configured
