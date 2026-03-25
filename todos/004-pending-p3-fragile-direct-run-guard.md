---
status: pending
priority: p3
issue_id: "CCM-119"
tags: [code-review, quality]
dependencies: []
---

# Replace fragile isDirectRun guard with import.meta or module pattern

## Problem Statement

The `isDirectRun` check in `scripts/sync-varro.ts:466-468` uses string matching on `process.argv[1]` to determine if the script is run directly vs. imported by tests. This is fragile and could break if the script is run from a different path, symlinked, or bundled.

## Findings

- `scripts/sync-varro.ts:466-468`:
  ```ts
  const isDirectRun =
    process.argv[1] &&
    (process.argv[1].endsWith('sync-varro.ts') || process.argv[1].endsWith('sync-varro'))
  ```
- This could match unintended files with the same suffix
- Standard Node.js pattern would use `import.meta.url` comparison or `require.main === module`

## Proposed Solutions

### Option 1: Use import.meta.url comparison

**Approach:** Compare `import.meta.url` with `url.pathToFileURL(process.argv[1])` which is the standard ESM pattern.

**Pros:**
- Standard Node.js ESM pattern
- Robust regardless of execution path

**Cons:**
- Requires ESM context (already using `import`)

**Effort:** 15 minutes

**Risk:** Low

---

### Option 2: Keep current approach (accept the fragility)

**Approach:** Leave as-is since it works for the known use cases (direct execution and vitest import).

**Pros:**
- No change needed
- Already tested and working

**Cons:**
- Fragile for future use cases

**Effort:** 0

**Risk:** Low

## Recommended Action

(To be filled during triage.)

## Technical Details

**Affected files:**
- `scripts/sync-varro.ts:466-472`

## Resources

- **PR:** #4

## Acceptance Criteria

- [ ] Script runs correctly when executed directly
- [ ] Script does not auto-execute when imported in tests
- [ ] All existing tests pass

## Work Log

### 2026-03-25 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified fragile execution guard pattern
