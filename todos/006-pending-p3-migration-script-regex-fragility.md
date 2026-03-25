---
status: resolved
priority: p3
issue_id: "CCM-117"
tags: [code-review, quality]
dependencies: []
---

# Migration script uses fragile regex for YAML frontmatter manipulation

## Problem Statement

The migration script (`scripts/migrate-to-timestamps.ts`) uses multiple regex passes to remove old boolean keys from YAML frontmatter. While it works for the current content set (verified per PR description: 99 posts migrated), the regex approach is fragile for edge cases like quoted values, inline comments, or multi-line values. Since the migration has already run successfully, this is a low-priority documentation/future-proofing concern.

## Findings

- `scripts/migrate-to-timestamps.ts:65-72` - Three separate regex passes to handle different positions of each key
- The regex `^newsletterSent:.*$` would match a key like `newsletterSentAt:` if it appeared before migration (though this is unlikely)
- Double-newline cleanup loop (lines 76-78) is a code smell indicating the removal approach is imprecise
- The script is idempotent (checks for `newsletterSentAt` before migrating), which mitigates risk

## Proposed Solutions

### Option 1: Document as completed migration (no change)

**Approach:** Add a comment that this migration has been run and is retained for reference only.

**Effort:** 5 minutes

**Risk:** Low

---

### Option 2: Refactor to use gray-matter stringify

**Approach:** Use `matter.stringify()` for writing back the modified frontmatter instead of regex replacement.

**Pros:**
- Robust YAML handling

**Cons:**
- May reformat existing YAML (the reason regex was chosen in the first place per PR description)
- Migration already completed, low value

**Effort:** 1 hour

**Risk:** Low

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**
- `scripts/migrate-to-timestamps.ts`

## Resources

- **PR:** #3

## Acceptance Criteria

- [ ] Migration script is clearly documented as completed/one-time-use

## Work Log

### 2026-03-25 - Code Review Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Reviewed regex-based YAML manipulation approach
- Noted idempotency check provides safety net
