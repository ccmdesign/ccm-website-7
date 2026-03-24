---
status: pending
priority: p2
issue_id: "004"
tags: [code-review, quality]
dependencies: []
---

# useAsyncData called inside onMounted in admin page

## Problem Statement

In `pages/admin/index.vue`, the `loadPosts()` function calls `useAsyncData()` inside an `onMounted` hook (line 120-122). Nuxt composables like `useAsyncData` must be called synchronously during `<script setup>` execution -- calling them inside lifecycle hooks or async callbacks can cause them to lose the component context, leading to hydration mismatches or silent failures.

## Findings

- `pages/admin/index.vue` line 119-129: `loadPosts()` wraps `useAsyncData` and is called from `onMounted`
- In Nuxt, `useAsyncData` registers itself in the component's setup context. Calling it lazily (inside `onMounted`) may work in some cases but is explicitly warned against in Nuxt docs.
- Since this is a dev-only page with `ssr: false`, it may work in practice, but it is a fragile pattern.

## Proposed Solutions

### Option 1: Move useAsyncData to setup level with lazy option

**Approach:** Call `useAsyncData` at the top level of `<script setup>` with `{ lazy: true, server: false }` and trigger refresh conditionally.

**Pros:**
- Idiomatic Nuxt pattern
- Works reliably with SSR/SSG

**Cons:**
- Minor refactor

**Effort:** 30 minutes

**Risk:** Low

---

### Option 2: Use plain $fetch instead of useAsyncData

**Approach:** Since this is a dev-only, client-only page, replace `useAsyncData` with `queryCollection` directly in `onMounted`.

**Pros:**
- Simpler for a dev tool
- No composable context issues

**Cons:**
- Loses reactivity features of useAsyncData

**Effort:** 15 minutes

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `pages/admin/index.vue` lines 118-130

## Resources

- **PR:** #1
- **Nuxt docs:** https://nuxt.com/docs/api/composables/use-async-data

## Acceptance Criteria

- [ ] `useAsyncData` is called at setup level or replaced with appropriate alternative
- [ ] Admin page loads posts correctly in dev

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified anti-pattern during PR #1 review
- Confirmed composable is called inside onMounted lifecycle hook
