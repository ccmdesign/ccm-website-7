---
title: "Dev-Guard Consistency and Serialization Boundary Patterns in Nuxt 3"
category: logic-errors
date: 2026-03-25
tags: [nuxt, vite, import-meta-dev, serialization, runtimeconfig, security, admin]
severity: p1
components: [nuxt.config.ts, pages/admin/index.vue, scripts/distribute.ts, server/routes/api/admin/publish-linkedin.post.ts]
related_prs: ["#3"]
related_docs: [docs/solutions/security-issues/admin-health-endpoint-hardening.md]
---

# Dev-Guard Consistency and Serialization Boundary Patterns

## Problem

Six code review findings from CCM-117 surfaced two recurring patterns that are easy to introduce and hard to catch without explicit review:

1. **Inconsistent dev-guards**: `process.env.NODE_ENV === 'development'` was used in `nuxt.config.ts` to gate `ADMIN_API_SECRET` into `runtimeConfig.public`, while every other dev-guard in the codebase used `import.meta.dev`. The `NODE_ENV` check is not statically replaced by Vite, so if a CI/CD build step runs with `NODE_ENV=development` (common), the secret gets baked into the production client bundle.

2. **Serialization boundary mismatch**: Nuxt Content's SQLite/queryCollection layer sometimes serializes YAML `null` values to the string `"null"`. Three separate files had independent workarounds (`!== 'null'`) with no shared utility, making the workaround fragile and easy to miss when adding new code paths.

## Root Cause

**Dev-guard**: `runtimeConfig.public` values are embedded in the client bundle at build time. `process.env.NODE_ENV` is a runtime check that Vite does not statically analyze or tree-shake, unlike `import.meta.dev` which Vite replaces with `true`/`false` at build time and dead-code-eliminates the false branch.

**Serialization**: Nuxt Content v3 stores parsed content in SQLite via `queryCollection`. Somewhere in the serialize/deserialize cycle, JavaScript `null` becomes the string `"null"`. This is a known Nuxt Content edge case that is unlikely to be fixed upstream since it would be a breaking change to existing workarounds.

## Solution

### Dev-guard fix

Replaced `process.env.NODE_ENV === 'development'` with `import.meta.dev` in `nuxt.config.ts:35`, matching every other dev-guard in the codebase:

```typescript
// Before (unsafe -- NODE_ENV is not statically replaced by Vite)
adminApiSecret: process.env.NODE_ENV === 'development' ? (process.env.ADMIN_API_SECRET || '') : '',

// After (safe -- import.meta.dev is statically replaced and tree-shaken)
adminApiSecret: import.meta.dev ? (process.env.ADMIN_API_SECRET || '') : '',
```

### Serialization boundary fix

Created a shared `isNullish()` utility (`utils/isNullish.ts`) that checks for `null`, `undefined`, and the string `"null"`:

```typescript
export function isNullish(value: unknown): value is null | undefined {
  return value == null || value === 'null'
}
```

Replaced all 4 occurrences of string `"null"` comparisons across client, server, and CLI contexts with this utility.

### Additional fixes in the same batch

- **Confirmation dialogs**: Added `window.confirm()` for destructive `send-newsletter` and `publish-linkedin` actions, using the previously-unused `actionLabels` map for user-facing confirmation messages.
- **Dead code removal**: Replaced empty `if (action === 'draft-linkedin')` block in `sent_but_flag_failed` handler with an extracted `updateLocalState()` function that updates UI state on both success and partial-failure paths.
- **Migration script documentation**: Marked `scripts/migrate-to-timestamps.ts` as a completed one-time migration retained for reference.

## Prevention

- **Codebase rule**: Never use `process.env.NODE_ENV` in Nuxt/Vite contexts for conditional logic that affects what ships to the client. Always use `import.meta.dev` which Vite statically replaces. Reserve `process.env.NODE_ENV` for server-only or build-tool config contexts.
- **Serialization boundaries**: When data crosses a serialization boundary (YAML -> gray-matter -> SQLite -> queryCollection -> client), always use a shared helper for nullish checks rather than inline comparisons. The helper centralizes the workaround and makes it searchable/auditable.
- **Unused code**: If code exists but is unreferenced, either use it or remove it in the same PR. Dangling maps and empty blocks signal incomplete refactors.
