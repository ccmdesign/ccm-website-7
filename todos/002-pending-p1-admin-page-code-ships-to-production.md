---
status: pending
priority: p1
issue_id: "002"
tags: [code-review, security, architecture]
dependencies: []
---

# Admin page Vue component is bundled into production JS

## Problem Statement

The admin page at `pages/admin/index.vue` is excluded from prerendering via `nitro.prerender.ignore` and `routeRules`, but the Vue component code (including its template, logic, and service endpoint paths) is still included in the client-side JavaScript bundle shipped to production. The only production guard is a client-side `process.env.NODE_ENV` check that redirects to `/`. This means:

1. The admin UI markup and endpoint URLs are visible to anyone inspecting the production bundle.
2. The `process.env.NODE_ENV` check may not behave as expected in all build scenarios (it is evaluated at build time by Vite, but its value depends on build mode).

## Findings

- `pages/admin/index.vue` line 83: `const isDev = process.env.NODE_ENV === 'development'` -- this is a build-time replacement by Vite, so in `nuxt generate` it should resolve to `false`. However, the component code still ships.
- Endpoint paths `/api/admin/send-newsletter` and `/api/admin/send-linkedin` are visible in the bundle as string literals.
- No Nuxt plugin or build-time exclusion removes the page from the client bundle.

## Proposed Solutions

### Option 1: Move admin to a separate Nuxt layer or standalone app

**Approach:** Extract admin functionality into a separate project or Nuxt layer that is only included in dev.

**Pros:**
- Complete separation from production
- Clean architecture

**Cons:**
- More setup effort

**Effort:** 4-6 hours

**Risk:** Low

---

### Option 2: Use dynamic import with `import.meta.dev` guard

**Approach:** Use a middleware or plugin that blocks the route in production and use dynamic `definePageMeta` with `validate` to return 404.

**Pros:**
- Keeps code in same repo
- Vite tree-shakes `import.meta.dev === false` blocks

**Cons:**
- Requires careful testing of tree-shaking behavior

**Effort:** 1-2 hours

**Risk:** Medium

## Recommended Action

## Technical Details

**Affected files:**
- `pages/admin/index.vue`
- `nuxt.config.ts` (routeRules, prerender.ignore)

## Resources

- **PR:** #1
- **Nuxt docs:** Route middleware, definePageMeta validate

## Acceptance Criteria

- [ ] After `nuxt generate`, admin page code does not appear in `.output/public` JS bundles
- [ ] Admin endpoint URLs are not present in production JS
- [ ] Admin route returns 404 in production

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified that prerender exclusion does not prevent JS bundling
- Confirmed `process.env.NODE_ENV` is build-time but component code persists
- Assessed as P1 due to information leakage of admin endpoints
