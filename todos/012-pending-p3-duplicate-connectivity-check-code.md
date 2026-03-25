---
status: pending
priority: p3
issue_id: "012"
tags: [code-review, quality, refactoring]
dependencies: []
---

# Duplicate connectivity check code blocks in health endpoint

## Problem Statement

The health endpoint contains two nearly identical code blocks for checking newsletter and LinkedIn service connectivity (lines 13-23 and lines 26-36 of `health.get.ts`). The only differences are the env var name and the check key. This duplication makes maintenance harder -- any fix to the health check logic (e.g., fixing the 4xx-as-healthy issue in todo-011) must be applied in both places.

## Findings

- Lines 13-23: Newsletter connectivity check
- Lines 26-36: LinkedIn connectivity check
- Both blocks follow the same pattern: read env var, fetch HEAD with 3s timeout, evaluate status, catch errors
- Env var presence checks (lines 39-47) also follow a duplicated pattern

## Proposed Solutions

### Option 1: Extract a helper function

**Approach:** Create a `checkServiceConnectivity(name: string, envKey: string)` helper within the file that encapsulates the fetch-and-evaluate logic. Also a `checkEnvVar(name: string, envKey: string)` for env presence.

**Pros:**
- Single place to fix health check logic
- Cleaner, more readable handler
- Easy to add new service checks in the future

**Cons:**
- Minor refactor for a dev-only endpoint

**Effort:** 15-20 minutes

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `server/routes/api/admin/health.get.ts`

## Resources

- **PR:** #2

## Acceptance Criteria

- [ ] Connectivity check logic is not duplicated
- [ ] Adding a new service check requires only one function call

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified code duplication during PR #2 review
- Assessed as P3 since it's a dev-only endpoint and the duplication is manageable
