---
status: pending
priority: p2
issue_id: "CCM-119"
tags: [code-review, quality, architecture]
dependencies: []
---

# Fix TypeScript-unsafe Date arithmetic in blog index sort

## Problem Statement

In `pages/blog/index.vue:126`, the sort comparator uses `new Date(b.date) - new Date(a.date)`. Subtracting Date objects directly is not valid TypeScript (Date does not support the `-` operator). While this works at runtime due to JavaScript coercion, it produces a TypeScript compile error and is fragile.

## Findings

- `pages/blog/index.vue:126` -- `return nonFuturePosts.sort((a, b) => new Date(b.date) - new Date(a.date))`
- TypeScript error: "The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type"
- The fix is to use `.getTime()` on each Date object

## Proposed Solutions

### Option 1: Use `.getTime()` for proper Date arithmetic

**Approach:** Change to `new Date(b.date).getTime() - new Date(a.date).getTime()`

**Pros:**
- TypeScript-safe
- Explicit and clear

**Cons:**
- None

**Effort:** 5 minutes

**Risk:** Low

## Recommended Action

(To be filled during triage.)

## Technical Details

**Affected files:**
- `pages/blog/index.vue:126`

## Resources

- **PR:** #4

## Acceptance Criteria

- [ ] Sort uses `.getTime()` for Date comparison
- [ ] Blog index page still sorts posts correctly (newest first)

## Work Log

### 2026-03-25 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Found TypeScript-unsafe Date subtraction in blog index sort
