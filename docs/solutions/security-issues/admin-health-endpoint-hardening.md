---
title: "Admin Health Endpoint Hardening: Auth, Status Logic, and DRY Refactor"
category: security-issues
date: 2026-03-24
tags: [admin, health-check, authentication, refactoring, nitro, nuxt]
severity: p2
components: [server/routes/api/admin/health.get.ts]
related_prs: ["#2"]
---

# Admin Health Endpoint Hardening

## Problem

The `/api/admin/health` endpoint had four compounding issues discovered during code review of PR #2:

1. **Missing authentication** -- The health endpoint skipped the `ADMIN_API_SECRET` check that the other two admin routes (`send-newsletter`, `send-linkedin`) enforced. This inconsistency meant new admin endpoints might copy the health endpoint pattern and omit auth.

2. **4xx treated as healthy** -- The condition `res.ok || res.status < 500` meant a 401 (invalid API key) or 403 (forbidden) from an upstream service was reported as "OK" in the admin UI. Developers would see green health checks but fail when actually sending.

3. **Duplicated connectivity check code** -- Newsletter and LinkedIn checks were copy-pasted blocks differing only in the env var name, making it easy to fix one and forget the other.

4. **Raw error messages in responses** -- Fetch errors included hostnames, ports, and DNS details. Accepted as intentional for a dev-only diagnostic tool.

## Root Cause

The health endpoint was added as a quick utility without applying the same patterns established by the existing admin routes. The auth check was missed because the health endpoint was read-only (no side effects), but this reasoning overlooked both the information it exposes and the precedent it sets.

The `res.status < 500` condition was likely chosen to handle HEAD requests on POST-only endpoints returning 404 or 405, but it was overly broad -- it treated credential failures (401/403) as healthy too.

## Solution

Rewrote `health.get.ts` with three changes:

**1. Added ADMIN_API_SECRET check (matching existing admin routes):**
```typescript
const expectedSecret = process.env.ADMIN_API_SECRET
if (expectedSecret) {
  const providedSecret = getHeader(event, 'x-admin-secret')
  if (providedSecret !== expectedSecret) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
}
```

**2. Fixed health check condition to only accept 2xx and 405:**
```typescript
const ok = res.ok || res.status === 405
```
405 (Method Not Allowed) is the expected response when HEAD-probing a POST-only service endpoint. All other non-2xx codes (including 401, 403, 404) now correctly report as unhealthy.

**3. Extracted helper functions to eliminate duplication:**
```typescript
async function checkServiceConnectivity(envKey: string): Promise<{ ok: boolean; error?: string }>
function checkEnvVar(envKey: string): { ok: boolean; error?: string }
```
Adding a new service check is now a single function call.

## Prevention

- **Pattern: when adding new admin endpoints, copy the full auth preamble** from an existing admin route, not just the `import.meta.dev` guard. The auth check is a separate concern from the dev-only guard.
- **Pattern: avoid `status < N` ranges in health checks.** Enumerate the specific status codes that mean "healthy" for your probe method. For HEAD probes, that is typically `2xx` and `405`.
- **Pattern: extract helpers when a code block is duplicated even twice.** The health endpoint only had two services, but the duplication already caused the 4xx bug to exist in both blocks.

## Verification

- All 4 todo files (010-013) marked as resolved
- Changes committed and pushed to `feature/CCM-117-content-distribution-refactor`
