---
status: pending
priority: p2
issue_id: "CCM-117"
tags: [code-review, quality, ux]
dependencies: []
---

# No confirmation dialog for destructive send/publish actions

## Problem Statement

The admin UI allows sending newsletters to the full subscriber segment and publishing LinkedIn posts with a single click and no confirmation dialog. A misclick on "Send" (right next to "Send Test") would immediately dispatch the newsletter to all subscribers. Similarly, "Post" publishes a LinkedIn draft immediately. These are irreversible actions that should require explicit confirmation.

## Findings

- `pages/admin/index.vue:53-54` - "Send Test" and "Send" links are adjacent with no visual separation beyond text
- `pages/admin/index.vue:107-108` - "Post" button publishes LinkedIn draft immediately
- No `window.confirm()` or modal dialog in `doAction()` function
- The `doAction` function (line 244) processes all actions uniformly without distinguishing destructive vs. safe actions

## Proposed Solutions

### Option 1: Add window.confirm() for destructive actions

**Approach:** Add a confirmation dialog in `doAction()` for `send-newsletter` and `publish-linkedin` actions.

**Pros:**
- Simple to implement
- Prevents accidental sends
- Native browser dialog, no UI library needed

**Cons:**
- Not the most elegant UX
- Can be suppressed by browsers in some edge cases

**Effort:** 15 minutes

**Risk:** Low

---

### Option 2: Visual separation and confirm modal

**Approach:** Add a custom confirmation modal component and visually distinguish safe actions (test, draft) from destructive ones (send, publish) with color coding.

**Pros:**
- Better UX
- Clearer visual hierarchy
- More control over the confirmation flow

**Cons:**
- More implementation effort
- Adds a component

**Effort:** 1-2 hours

**Risk:** Low

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**
- `pages/admin/index.vue:244` - doAction function
- `pages/admin/index.vue:53-54` - Newsletter action links
- `pages/admin/index.vue:107-108` - LinkedIn publish link

## Resources

- **PR:** #3

## Acceptance Criteria

- [ ] "Send" (newsletter to full segment) requires explicit confirmation
- [ ] "Post" (LinkedIn publish) requires explicit confirmation
- [ ] "Send Test" and "Draft" do NOT require confirmation
- [ ] Confirmation message clearly states the action scope

## Work Log

### 2026-03-25 - Code Review Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified missing confirmation for irreversible distribution actions
- Assessed risk of accidental sends to full subscriber list
