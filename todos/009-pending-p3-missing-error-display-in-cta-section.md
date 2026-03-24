---
status: pending
priority: p3
issue_id: "009"
tags: [code-review, quality]
dependencies: []
---

# ccmCtaSection does not display subscription errors to users

## Problem Statement

The `ccmCtaSection.vue` component uses `useNewsletterSubscribe()` but only destructures `{ email, subscribed, subscribe }` -- it does not destructure or display the `error` ref. If the subscription API call fails, the user sees no feedback; the form simply does nothing.

In contrast, `ctaSignup.vue` correctly displays the error message.

## Findings

- `components/organisms/ccmCtaSection.vue` line 44: `const { email, subscribed, subscribe } = useNewsletterSubscribe()` -- `error` and `loading` are not used
- No error message element exists in the template
- `components/content/ctaSignup.vue` line 30: `<p v-if="error" class="error-message">{{ error }}</p>` -- correctly shows errors

## Proposed Solutions

### Option 1: Add error display to ccmCtaSection

**Approach:** Destructure `error` from the composable and add an error message element to the template.

**Pros:**
- Consistent UX across both signup forms
- Users get feedback on failures

**Cons:**
- Minor UI change

**Effort:** 15 minutes

**Risk:** Low

## Recommended Action

## Technical Details

**Affected files:**
- `components/organisms/ccmCtaSection.vue`

## Resources

- **PR:** #1

## Acceptance Criteria

- [ ] Error messages are visible when subscription fails in ccmCtaSection
- [ ] Loading state is shown while request is in flight

## Work Log

### 2026-03-24 - Initial Discovery

**By:** Claude Code (ce-review)

**Actions:**
- Compared both signup components during PR #1 review
- Confirmed error ref is available but unused in ccmCtaSection
