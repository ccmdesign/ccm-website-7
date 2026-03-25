---
status: pending
priority: p3
issue_id: "CCM-117"
tags: [code-review, quality]
dependencies: []
---

# Unused actionLabels map in admin page

## Problem Statement

The `actionLabels` object defined at lines 237-242 of `pages/admin/index.vue` is never referenced in the template or script. It appears to be leftover from a refactor where toast messages were hardcoded inline in the switch statement instead of using this map.

## Findings

- `pages/admin/index.vue:237-242` - `actionLabels` object defined
- No references to `actionLabels` anywhere in the component
- Toast messages in the switch-case (lines 266-283) use hardcoded strings instead

## Proposed Solutions

### Option 1: Remove unused code

**Approach:** Delete the `actionLabels` object.

**Effort:** 1 minute

**Risk:** Low

---

### Option 2: Use it for toast messages

**Approach:** Refactor the switch-case in `doAction` to use `actionLabels[action]` for toast messages, reducing duplication.

**Effort:** 15 minutes

**Risk:** Low

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**
- `pages/admin/index.vue:237-242`

## Resources

- **PR:** #3

## Acceptance Criteria

- [ ] No unused variables remain in the component

## Work Log

### 2026-03-25 - Code Review Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified unused actionLabels map via code review
