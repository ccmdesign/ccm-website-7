---
status: pending
priority: p2
issue_id: "CCM-117"
tags: [code-review, quality]
dependencies: []
---

# Dead code in sent_but_flag_failed handler for draft-linkedin action

## Problem Statement

In the admin page's `doAction` function, the `sent_but_flag_failed` handler contains an empty if-block for the `draft-linkedin` action (lines 260-262). The comment says "Extract URL from warning if possible -- best effort" but no code follows. This means when a LinkedIn draft succeeds but frontmatter update fails, the local UI state is never updated, leaving the UI out of sync with reality.

## Findings

- `pages/admin/index.vue:260-262` - Empty if-block with TODO comment
- When `sent_but_flag_failed` is returned, no local state updates happen for any action
- The user sees a warning toast but the UI still shows the old state (e.g., "Draft" button remains active)
- For `send-newsletter`, the same issue exists: warning is shown but `post.newsletterSentAt` is never updated

## Proposed Solutions

### Option 1: Update local state on sent_but_flag_failed

**Approach:** When the API returns `sent_but_flag_failed`, still update the local reactive state using the response data (timestamps, URLs) so the UI reflects the actual service state.

**Pros:**
- UI stays in sync with service reality
- Prevents user from accidentally re-sending
- Simple fix

**Cons:**
- Local state will diverge from frontmatter on disk until manually fixed

**Effort:** 30 minutes

**Risk:** Low

---

### Option 2: Remove dead code, add reload prompt

**Approach:** Remove the empty block. After showing the warning toast, prompt the user to reload the page or auto-reload after the frontmatter is manually fixed.

**Pros:**
- Simpler code
- Encourages fixing the root issue (frontmatter)

**Cons:**
- Slightly worse UX during the warning state

**Effort:** 20 minutes

**Risk:** Low

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**
- `pages/admin/index.vue:257-262` - sent_but_flag_failed handler

## Resources

- **PR:** #3

## Acceptance Criteria

- [ ] No empty if-blocks or dead code comments remain
- [ ] UI state is consistent after a partial failure (service succeeded, frontmatter failed)
- [ ] User can see that the action already happened

## Work Log

### 2026-03-25 - Code Review Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified dead code in doAction's error handler
- Traced the sent_but_flag_failed flow across all four action types
