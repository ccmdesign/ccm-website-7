---
status: resolved
priority: p2
issue_id: "010"
tags: [code-review, security, consistency]
dependencies: []
---

# Health endpoint skips ADMIN_API_SECRET authentication

## Problem Statement

The new `/api/admin/health` endpoint does not check the `ADMIN_API_SECRET` header, while the existing `send-newsletter` and `send-linkedin` admin routes both enforce it when configured. This inconsistency means any local process can probe service connectivity status without providing credentials, even when the developer has configured a secret for the admin API.

While the health endpoint is dev-only (`import.meta.dev` guard) and does not reveal secret values, it still exposes which services are configured and reachable. More importantly, the inconsistency creates a pattern where new admin endpoints may omit the check because the health endpoint set a precedent.

## Findings

- `server/routes/api/admin/send-newsletter.post.ts` lines 12-18: checks `ADMIN_API_SECRET` header
- `server/routes/api/admin/send-linkedin.post.ts` lines 12-18: checks `ADMIN_API_SECRET` header
- `server/routes/api/admin/health.get.ts`: has `import.meta.dev` guard but no `ADMIN_API_SECRET` check
- The health endpoint reveals: which env vars are set, whether external services are reachable, and error messages from failed connectivity checks

## Proposed Solutions

### Option 1: Add the same ADMIN_API_SECRET check to the health endpoint

**Approach:** Copy the 6-line secret check block from the send routes into `health.get.ts`.

**Pros:**
- Consistent auth pattern across all admin endpoints
- Minimal code change

**Cons:**
- Duplicates the auth check for the third time (consider extracting to shared middleware)

**Effort:** 15 minutes

**Risk:** Low

---

### Option 2: Extract shared admin auth middleware

**Approach:** Create `server/middleware/adminAuth.ts` or a utility function that all admin routes call. Apply it to health, send-newsletter, and send-linkedin.

**Pros:**
- DRY principle
- Single point of change for auth logic
- Prevents future endpoints from missing the check

**Cons:**
- Slightly more work for three routes
- Nitro middleware applies globally unless scoped by path check

**Effort:** 30-45 minutes

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `server/routes/api/admin/health.get.ts` - Missing auth check

**Related components:**
- `server/routes/api/admin/send-newsletter.post.ts` - Has the pattern to copy
- `server/routes/api/admin/send-linkedin.post.ts` - Has the pattern to copy

## Resources

- **PR:** #2

## Acceptance Criteria

- [ ] Health endpoint checks `ADMIN_API_SECRET` when configured
- [ ] Health endpoint returns 403 when secret is configured but not provided
- [ ] Health endpoint works normally when no secret is configured

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified missing auth check on health endpoint during PR #2 review
- Compared against send-newsletter and send-linkedin patterns
- Assessed as P2 due to dev-only scope but auth inconsistency

### 2026-03-24 - Resolved

**By:** Claude Code (resolve-todo-parallel)

**Actions:**
- Added ADMIN_API_SECRET check to health endpoint, matching the pattern used in send-newsletter and send-linkedin
- Handler now takes `event` parameter and checks x-admin-secret header when secret is configured
- Returns 403 Forbidden when secret is configured but not provided
