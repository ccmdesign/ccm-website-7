---
status: resolved
priority: p2
issue_id: "011"
tags: [code-review, quality, admin]
dependencies: []
---

# Health check treats 4xx responses (401, 403, 404) as healthy

## Problem Statement

The health check endpoint uses the condition `res.ok || res.status < 500` (line 17 and 29 of `health.get.ts`) to determine if a service is healthy. This means a 401 Unauthorized, 403 Forbidden, or 404 Not Found response from the service will be reported as "OK" in the admin UI.

This is misleading: if the newsletter service returns 403 because the API key is invalid, the health panel shows green "OK" for newsletter connectivity, but clicking "Send Newsletter" will fail with a 502 error. The purpose of the health check is to give the developer confidence that services are properly configured and reachable -- treating auth failures as healthy undermines this.

## Findings

- `server/routes/api/admin/health.get.ts` line 17: `checks.newsletter = { ok: res.ok || res.status < 500 }`
- Same pattern on line 29 for LinkedIn
- `res.ok` is true for 200-299 status codes
- `res.status < 500` is true for all 1xx, 2xx, 3xx, 4xx codes
- The `res.ok` check is redundant when combined with `< 500` (200-299 is already < 500)
- A HEAD request to these services may return different status codes than a POST -- a 404 on HEAD is expected if the service only has POST routes, but a 401/403 indicates real configuration problems

## Proposed Solutions

### Option 1: Only treat 2xx and specific expected codes as healthy

**Approach:** Replace the condition with `res.ok || res.status === 405` (Method Not Allowed is expected for HEAD on POST-only endpoints). Treat 401/403 as configuration errors.

**Pros:**
- Catches credential misconfiguration
- 405 is the expected response when HEAD-probing a POST-only service

**Cons:**
- May need tuning based on actual service behavior

**Effort:** 15 minutes

**Risk:** Low

---

### Option 2: Use GET or OPTIONS instead of HEAD for probing

**Approach:** Change the probe method to GET or OPTIONS, which services are more likely to handle consistently. Or add a dedicated `/health` path on the services.

**Pros:**
- More reliable connectivity signal
- OPTIONS is standard for CORS preflight and widely supported

**Cons:**
- Depends on service implementation
- GET may trigger side effects on some poorly-designed endpoints

**Effort:** 15-30 minutes

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `server/routes/api/admin/health.get.ts` lines 17, 29

## Resources

- **PR:** #2

## Acceptance Criteria

- [ ] Health check correctly identifies 401/403 as configuration errors, not healthy
- [ ] Health check handles 405 (Method Not Allowed) from HEAD probes appropriately
- [ ] Admin UI shows meaningful error when service credentials are wrong

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified overly permissive health check condition during PR #2 review
- Analyzed how HEAD requests interact with POST-only service endpoints
- Assessed as P2 because misleading health status undermines the feature's purpose

### 2026-03-24 - Resolved

**By:** Claude Code (resolve-todo-parallel)

**Actions:**
- Replaced `res.ok || res.status < 500` with `res.ok || res.status === 405`
- 401/403/404 responses now correctly report as unhealthy (configuration errors)
- 405 (Method Not Allowed) is accepted as healthy since HEAD on POST-only endpoints returns this
