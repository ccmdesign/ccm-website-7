---
status: pending
priority: p3
issue_id: "013"
tags: [code-review, security, admin]
dependencies: []
---

# Health check error messages include raw internal error details

## Problem Statement

The health endpoint includes raw error messages from failed fetch calls in the response (e.g., `Unreachable: fetch failed` or DNS resolution errors). While this endpoint is dev-only, the error messages may contain internal network details (hostnames, ports, DNS errors) that could be useful for diagnosing issues but could also leak infrastructure details if the endpoint were ever accidentally exposed.

This is low severity because the endpoint is behind an `import.meta.dev` guard, but it's worth noting for defense-in-depth.

## Findings

- `health.get.ts` line 19: `error: \`Unreachable: ${(err as Error).message}\``
- `health.get.ts` line 31: Same pattern for LinkedIn
- Error messages from `fetch()` can include: DNS resolution failures with hostnames, connection refused with IP:port, TLS certificate details, timeout details
- The endpoint returns these directly in the JSON response

## Proposed Solutions

### Option 1: Accept as-is (dev-only)

**Approach:** Keep detailed errors since this is explicitly a developer diagnostic tool behind an `import.meta.dev` guard.

**Pros:**
- Detailed errors help developers debug connectivity issues
- The endpoint is tree-shaken in production builds

**Cons:**
- Sets a pattern of including raw errors in responses

**Effort:** None

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `server/routes/api/admin/health.get.ts` lines 19, 31

## Resources

- **PR:** #2

## Acceptance Criteria

- [ ] Review and decide: keep detailed errors for dev convenience or sanitize

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Noted raw error message exposure during PR #2 review
- Assessed as P3 given dev-only scope and diagnostic value of detailed errors
