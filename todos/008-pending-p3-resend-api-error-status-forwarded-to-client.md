---
status: resolved
priority: p3
issue_id: "008"
tags: [code-review, security]
dependencies: []
---

# Resend API error status codes forwarded directly to client

## Problem Statement

In `netlify/functions/subscribe.ts`, when the Resend API returns an error, the function forwards the upstream HTTP status code directly to the client (line 93: `statusCode: res.status`). While the error message is sanitized via `safeErrorMessage()`, the status code itself leaks information about the upstream service (e.g., a 500 from Resend is forwarded as a 500 to the user, which may be misleading since the subscribe function itself did not error).

## Findings

- `netlify/functions/subscribe.ts` line 93: `statusCode: res.status` -- forwards Resend's status verbatim
- `safeErrorMessage()` handles 409, 422, 429 but falls through to a generic message for other codes
- A 500 from Resend would appear as a 500 from the subscribe endpoint, which is technically inaccurate

## Proposed Solutions

### Option 1: Map upstream errors to appropriate client-facing codes

**Approach:** Map known Resend statuses to client-facing equivalents (409 -> 409, 422 -> 400, 429 -> 429, others -> 502).

**Pros:**
- Accurate HTTP semantics
- No information leakage

**Cons:**
- Minor additional mapping logic

**Effort:** 15 minutes

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `netlify/functions/subscribe.ts` lines 87-95

## Resources

- **PR:** #1

## Acceptance Criteria

- [ ] Upstream status codes are mapped to appropriate client-facing codes
- [ ] No internal service details leak to the client

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified status code forwarding during PR #1 review

### 2026-03-24 - Resolved

**By:** Claude Code

**Actions:**
- Added status code mapping: 409->409, 422->400, 429->429, all others->502
- Resend internal status codes no longer leak to the client
