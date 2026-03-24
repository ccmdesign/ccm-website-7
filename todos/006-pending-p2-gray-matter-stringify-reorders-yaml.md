---
status: pending
priority: p2
issue_id: "006"
tags: [code-review, quality]
dependencies: []
---

# gray-matter stringify may reorder YAML frontmatter and produce noisy diffs

## Problem Statement

`server/utils/updateFrontmatter.ts` uses `matter.stringify(parsed.content, parsed.data)` to write back the markdown file after updating frontmatter fields. The `gray-matter` library's `stringify` method does not guarantee it preserves the original YAML key ordering, quoting style, or formatting. This means that updating a single boolean flag (e.g., `newsletterSent: true`) could produce a diff that touches many lines of the frontmatter, making git history harder to read and review.

## Findings

- `server/utils/updateFrontmatter.ts` line 58: `const output = matter.stringify(parsed.content, parsed.data)`
- The backfill already ran on all 99 posts, so the formatting is likely already normalized. But future sends from the admin UI or CLI will go through this code path.
- Tested: gray-matter uses `js-yaml` under the hood, which has its own serialization preferences (e.g., collapsing single-line arrays, removing trailing commas, changing quote styles).

## Proposed Solutions

### Option 1: Use regex-based frontmatter patching

**Approach:** Instead of parse-then-stringify, read the raw YAML block, find or append the target key, and write back only the changed line.

**Pros:**
- Zero-diff on untouched fields
- Preserves original formatting exactly

**Cons:**
- More fragile regex code
- Harder to maintain for complex updates

**Effort:** 2-3 hours

**Risk:** Medium

---

### Option 2: Accept the stringify behavior and normalize in backfill

**Approach:** Since the backfill already ran and normalized formatting, accept that future writes will be consistent with the backfill format. Document this behavior.

**Pros:**
- No code change
- Consistent format going forward

**Cons:**
- First send on a post that was not in the backfill will produce a noisy diff

**Effort:** 15 minutes (documentation only)

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `server/utils/updateFrontmatter.ts` line 58

## Resources

- **PR:** #1
- **gray-matter docs:** https://github.com/jonschlinkert/gray-matter

## Acceptance Criteria

- [ ] Updating a single frontmatter flag does not produce unnecessary diff noise
- [ ] Behavior is documented if accepted as-is

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified gray-matter stringify behavior during PR #1 review
- Noted backfill has already normalized existing posts
