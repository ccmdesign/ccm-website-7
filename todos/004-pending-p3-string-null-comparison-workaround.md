---
status: resolved
priority: p3
issue_id: "CCM-117"
tags: [code-review, quality]
dependencies: []
---

# String 'null' comparisons suggest serialization bug workaround

## Problem Statement

Multiple locations compare `linkedinPostedAt` against the string `"null"` (e.g., `post.linkedinPostedAt !== 'null'`). This suggests that at some point `null` values get serialized to the string `"null"`, and the code works around it rather than fixing the root cause. This makes the code fragile and confusing.

## Findings

- `pages/admin/index.vue:84` - `post.linkedinPostedAt !== 'null'`
- `scripts/distribute.ts:649` - `liPost !== 'null'`
- `server/routes/api/admin/publish-linkedin.post.ts:38` - `post.linkedinPostedAt !== 'null'`
- The YAML frontmatter stores `linkedinPostedAt: null` which gray-matter parses as JS `null`, but Nuxt Content's queryCollection may serialize it differently

## Proposed Solutions

### Option 1: Investigate and fix serialization root cause

**Approach:** Trace where `null` becomes `"null"` (likely in Nuxt Content's SQLite layer or queryCollection serialization) and fix it, then remove all string comparisons.

**Pros:**
- Fixes root cause
- Cleaner code

**Cons:**
- May require deeper investigation of Nuxt Content internals

**Effort:** 1-2 hours

**Risk:** Medium

---

### Option 2: Add normalizing helper

**Approach:** Create a `isNullish(val)` helper that checks for both `null`, `undefined`, and the string `"null"`, used consistently across all files.

**Pros:**
- Quick fix
- Centralized logic

**Cons:**
- Doesn't fix root cause
- Slightly inelegant

**Effort:** 30 minutes

**Risk:** Low

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**
- `pages/admin/index.vue:84`
- `scripts/distribute.ts:649`
- `server/routes/api/admin/publish-linkedin.post.ts:38`

## Resources

- **PR:** #3

## Acceptance Criteria

- [ ] No comparisons against string `"null"` remain
- [ ] Null values are handled consistently across UI, CLI, and API routes

## Work Log

### 2026-03-25 - Code Review Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Found 3 locations comparing against string "null"
- Identified likely root cause in Nuxt Content serialization
