---
status: pending
priority: p2
issue_id: "003"
tags: [code-review, architecture]
dependencies: []
---

# serviceClient.ts uses process.env instead of Nuxt runtimeConfig

## Problem Statement

`server/utils/serviceClient.ts` reads env vars directly via `process.env` (e.g., `NEWSLETTER_SERVICE_URL`, `RESEND_API_KEY`, `LINKEDIN_ACCESS_TOKEN`), while `nuxt.config.ts` already declares these same values in `runtimeConfig`. This creates two separate config pathways: one for Nuxt server routes (which should use `useRuntimeConfig()`) and one for the CLI script (which legitimately needs `process.env`).

The current approach works but bypasses Nuxt's config layer, making it harder to override values per-environment and creating a maintenance burden where config must be kept in sync in two places.

## Findings

- `nuxt.config.ts` lines 24-35: declares `runtimeConfig` with `linkedinAccessToken`, `resendApiKey`, etc.
- `server/utils/serviceClient.ts` lines 20-24, 30-31, 63-64: reads `process.env.NEWSLETTER_SERVICE_URL`, `process.env.RESEND_API_KEY`, `process.env.LINKEDIN_ACCESS_TOKEN` directly
- The CLI script `scripts/distribute.ts` uses `dotenv` and imports from `server/utils/serviceClient.ts`, so it needs `process.env` access

## Proposed Solutions

### Option 1: Split into two modules

**Approach:** Create a thin Nuxt-aware wrapper in `server/utils/` that calls `useRuntimeConfig()` for server routes, and keep the `process.env` version for CLI use.

**Pros:**
- Idiomatic Nuxt pattern
- Clear separation of concerns

**Cons:**
- Slight code duplication

**Effort:** 2-3 hours

**Risk:** Low

---

### Option 2: Accept process.env as canonical

**Approach:** Remove the runtimeConfig entries from nuxt.config.ts since they are not used, and document that env vars are the single source of truth.

**Pros:**
- Simpler, no duplication
- Honest about the actual config path

**Cons:**
- Loses Nuxt runtimeConfig benefits

**Effort:** 30 minutes

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `server/utils/serviceClient.ts`
- `nuxt.config.ts`
- `scripts/distribute.ts`

## Resources

- **PR:** #1

## Acceptance Criteria

- [ ] Single source of truth for service configuration
- [ ] Both server routes and CLI script work correctly
- [ ] No stale config declarations

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified dual config pathways during PR #1 review
- Confirmed runtimeConfig values are declared but never consumed
