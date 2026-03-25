---
status: pending
priority: p1
issue_id: "CCM-117"
tags: [code-review, security]
dependencies: []
---

# ADMIN_API_SECRET may leak into client bundle via runtimeConfig.public

## Problem Statement

The `ADMIN_API_SECRET` is conditionally exposed in `runtimeConfig.public` using `process.env.NODE_ENV === 'development'`. However, `NODE_ENV` is not equivalent to `import.meta.dev` in Nuxt/Vite. During SSG builds (`npm run generate`), `NODE_ENV` may be `development` in the build environment, causing the secret to be baked into the generated client-side JavaScript bundle. The rest of the codebase correctly uses `import.meta.dev` (which is statically replaced and tree-shaken by Vite), but this one location uses `NODE_ENV` instead.

Even though admin routes are dev-only, if the secret leaks into a production bundle it could be extracted by anyone viewing the page source.

## Findings

- `nuxt.config.ts:35` uses `process.env.NODE_ENV === 'development'` as the guard
- All other dev-guards in the codebase use `import.meta.dev` (e.g., API route handlers, page `validate()`)
- `runtimeConfig.public` values are embedded in the client bundle at build time
- If CI/CD runs with `NODE_ENV=development` (common for build steps), the secret would be included

## Proposed Solutions

### Option 1: Use import.meta.dev consistently

**Approach:** Replace `process.env.NODE_ENV === 'development'` with `import.meta.dev` in nuxt.config.ts, matching every other dev-guard in the codebase.

**Pros:**
- Consistent with rest of codebase
- Vite statically replaces and tree-shakes
- Zero risk of secret leaking into production builds

**Cons:**
- Need to verify `import.meta.dev` is available in nuxt.config.ts context (it should be, as Nuxt processes this file through Vite)

**Effort:** 15 minutes

**Risk:** Low

---

### Option 2: Move secret passing to server-side only

**Approach:** Remove `adminApiSecret` from `runtimeConfig.public` entirely. Instead, have admin UI call a dev-only server route that returns the secret, or use a cookie-based session.

**Pros:**
- Secret never appears in client bundle
- More secure architecture

**Cons:**
- More refactoring needed
- Adds an extra round-trip

**Effort:** 1-2 hours

**Risk:** Low

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**
- `nuxt.config.ts:35` - runtimeConfig.public.adminApiSecret assignment
- `pages/admin/index.vue:153` - reads config.public.adminApiSecret

**Related components:**
- All admin API routes that check x-admin-secret header

## Resources

- **PR:** #3
- **Nuxt docs on runtimeConfig:** https://nuxt.com/docs/api/composables/use-runtime-config

## Acceptance Criteria

- [ ] `ADMIN_API_SECRET` cannot appear in any production client bundle
- [ ] Admin auth still works in development mode
- [ ] Guard mechanism is consistent with the rest of the codebase

## Work Log

### 2026-03-25 - Code Review Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified inconsistent dev-guard pattern in nuxt.config.ts
- Compared against all other dev-guards (all use import.meta.dev)
- Assessed risk of NODE_ENV mismatch in build environments

**Learnings:**
- process.env.NODE_ENV and import.meta.dev have different semantics in Vite/Nuxt
- runtimeConfig.public values are baked into client bundles at build time
