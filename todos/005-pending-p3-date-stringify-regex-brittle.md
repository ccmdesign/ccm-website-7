---
status: pending
priority: p3
issue_id: "CCM-119"
tags: [code-review, quality]
dependencies: []
---

# Harden date format preservation in stringifyPost

## Problem Statement

The `stringifyPost` function in `scripts/sync-varro.ts:236-242` uses a regex workaround to fix gray-matter's date coercion. The regex `^(date:\s*)'?(\d{4}-\d{2}-\d{2})T[\d:.Z]+'?` is brittle and may not handle all gray-matter output variations (e.g., timezone offsets, different quoting styles).

## Findings

- `scripts/sync-varro.ts:238-241` -- regex assumes specific ISO timestamp format after the date
- gray-matter may produce different formats depending on the Date object's timezone
- If the regex doesn't match, the date will be emitted as a full ISO timestamp, which the content schema expects as `z.string()` (YYYY-MM-DD)
- Tests do verify the output, but only for the happy path

## Proposed Solutions

### Option 1: Pre-process data to ensure date is a string before stringify

**Approach:** Instead of post-processing the output, ensure the `date` field in the data object is always a plain string that gray-matter won't coerce. This can be done by wrapping the date value in a custom type or using gray-matter's `engines` option.

**Pros:**
- Eliminates the need for regex post-processing
- More robust

**Cons:**
- Requires understanding gray-matter internals

**Effort:** 1 hour

**Risk:** Low

---

### Option 2: Accept current approach with additional test coverage

**Approach:** Keep the regex but add tests for timezone edge cases.

**Pros:**
- Minimal change
- Already working

**Cons:**
- Still brittle

**Effort:** 30 minutes

**Risk:** Low

## Recommended Action

(To be filled during triage.)

## Technical Details

**Affected files:**
- `scripts/sync-varro.ts:230-242`

## Resources

- **PR:** #4

## Acceptance Criteria

- [ ] Date values in output files are always YYYY-MM-DD format
- [ ] Tests cover timezone edge cases
- [ ] No regression in existing date format tests

## Work Log

### 2026-03-25 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified brittle regex workaround for gray-matter date coercion
