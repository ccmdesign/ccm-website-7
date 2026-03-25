---
status: pending
priority: p2
issue_id: "CCM-119"
tags: [code-review, security]
dependencies: []
---

# Sanitize slugs before using as file paths in sync-varro.ts

## Problem Statement

The `sync` function in `scripts/sync-varro.ts` uses the `slug` value from Varro frontmatter (or the directory name as fallback) directly as a filename without sanitization. A malicious or malformed slug like `../../etc/passwd` or `foo/../../bar` could write files outside the intended `content/blog/` directory.

While this is a local CLI tool (not production-facing), it processes external content archives, so defense-in-depth applies.

## Findings

- `scripts/sync-varro.ts:330` -- slug is read from `parsed.data.slug || folder.dirName`
- `scripts/sync-varro.ts:400` -- slug is used directly: `path.join(blogDir, \`${post.slug}.md\`)`
- No validation that the resolved path stays within `blogDir`
- The slug could contain path separators (`/`, `..`) or other special characters

## Proposed Solutions

### Option 1: Validate slug characters

**Approach:** Add a slug sanitizer that strips or rejects slugs containing path separators, `..`, or non-URL-safe characters.

**Pros:**
- Simple to implement
- Catches all obvious path traversal patterns

**Cons:**
- Must maintain a blocklist of dangerous characters

**Effort:** 30 minutes

**Risk:** Low

---

### Option 2: Resolve and verify path containment

**Approach:** After computing the target path with `path.resolve()`, verify it starts with the expected blog directory prefix.

**Pros:**
- Catches all path traversal regardless of encoding
- Defense-in-depth pattern

**Cons:**
- Slightly more code

**Effort:** 30 minutes

**Risk:** Low

## Recommended Action

(To be filled during triage.)

## Technical Details

**Affected files:**
- `scripts/sync-varro.ts:330` -- slug assignment
- `scripts/sync-varro.ts:400` -- file write using slug

## Resources

- **PR:** #4
- **Similar patterns:** docs/solutions/security-issues/admin-health-endpoint-hardening.md

## Acceptance Criteria

- [ ] Slugs are validated or sanitized before use in file paths
- [ ] Path traversal attempts are rejected with a clear warning
- [ ] Test added for malicious slug input
- [ ] Existing tests still pass

## Work Log

### 2026-03-25 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified unsanitized slug usage in sync-varro.ts
- Verified no existing validation exists
- Classified as P2 since this is a local CLI tool, not a production endpoint
