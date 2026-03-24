---
status: pending
priority: p2
issue_id: "005"
tags: [code-review, security]
dependencies: []
---

# CORS origin validation in subscribe function is too permissive

## Problem Statement

The Netlify subscribe function at `netlify/functions/subscribe.ts` allows any origin containing `localhost` or `127.0.0.1` as a CORS-allowed origin. This means a malicious site could use a subdomain like `localhost.evil.com` to bypass the CORS restriction. While CORS is not a server-side security boundary (the request still reaches the server), it does reveal that the origin checking logic is imprecise.

## Findings

- `netlify/functions/subscribe.ts` lines 10-11: `origin.includes('localhost') || origin.includes('127.0.0.1')` -- substring match, not exact domain match
- Example bypass: `Origin: https://localhost.attacker.com` would pass the check
- The rate limiter (10 req/60s/IP) provides some protection, but the CORS check gives a false sense of security

## Proposed Solutions

### Option 1: Use URL parsing for exact origin check

**Approach:** Parse the Origin header as a URL and check the hostname is exactly `localhost` or `127.0.0.1`.

**Pros:**
- Precise validation
- No false positives

**Cons:**
- Slightly more code

**Effort:** 30 minutes

**Risk:** Low

---

### Option 2: Allow all origins in dev via env var

**Approach:** Use a `CORS_DEV_MODE` env var set only in Netlify dev. In production, strictly allow only `ccmdesign.com`.

**Pros:**
- Clean separation
- No string matching heuristics

**Cons:**
- Requires env var management

**Effort:** 30 minutes

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `netlify/functions/subscribe.ts` lines 8-19

## Resources

- **PR:** #1

## Acceptance Criteria

- [ ] CORS origin check uses exact hostname matching
- [ ] `localhost.evil.com` is rejected
- [ ] Local development still works

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Identified substring-based origin check during PR #1 review
- Confirmed bypass scenario with subdomain spoofing
