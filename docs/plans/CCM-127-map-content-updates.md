# CCM-127: Map Content Updates to Existing Pages

> Audit step: maps every content change from Hannah's content doc to its corresponding file in the **new-commons** codebase (`govlab/new-commons`).

---

## Source codebase

All paths below are relative to the **new-commons** repo root (`/Users/claudiomendonca/Documents/GitHub/govlab/new-commons/`).

---

## 1. Homepage (`pages/index.vue`)

### Current structure (4 sections)
1. `ncHero` (lines 2-32) -- hero with headline, description, CTA, announcement bar
2. `ncBaseSection#video-section` (lines 34-42) -- "About the Incubator" heading + YouTube embed
3. `ncCta#cta` (lines 45-67) -- two-panel CTA: FAQ panel (top) + webinar panel (bottom)
4. `ncBlogSection#blog` (line 68) -- latest 3 blog posts

### Target structure (9 panels)

| Panel | Action | File / Component | Notes |
|-------|--------|-----------------|-------|
| 1 - Hero | **MODIFY** -- replace placeholder hero copy with Incubator intro + "About the Incubator" CTA | `pages/index.vue` lines 4-11 (inside `ncHero > .hero__content > .panel`) | Content ready. Also update announcement bar (lines 20-31). |
| 2 - Call for Proposals | **NEW SECTION** -- Indigenous Languages CTA + "Apply Now" | `pages/index.vue` -- add new `ncBaseSection` or `ncCta` after hero | **BLOCKED**: application form URL not available. Skip for now; leave a TODO placeholder. |
| 3 - Webinars | **NEW SECTION** -- webinar signup CTA | `pages/index.vue` -- add after Panel 2 | **BLOCKED**: webinar signup URL not available. Skip; leave TODO placeholder. |
| 4 - (blank) | No content provided | — | **MISSING** -- skip entirely. |
| 5 - (skip) | Not in doc | — | — |
| 6 - FAQ | **MODIFY** -- update FAQ CTA copy | `pages/index.vue` lines 45-67, uses `ncCta` component (`components/ncCta.vue`) | Content ready. Update heading text and description inside `.panel-header`. Remove or restructure the `.panel-footer` webinar sub-panel (it becomes Panel 3 above). |
| 7 - Initiatives | **NEW SECTION** -- slider with 2025 Challenge + Indigenous Languages cards | `pages/index.vue` -- add new section | Content ready. Needs a new component (e.g. `ncInitiativesSlider.vue`) or inline markup. Cards link to `/the-2025-challenge` and the Indigenous Languages initiative. |
| 8 - Resources | **NEW SECTION** -- grid of resource cards (same format as blog cards) | `pages/index.vue` -- add new section. Reuse `ncResourceCard` component (already exists at `components/ncResourceCard.vue`). | Content ready. Query `resources` collection similar to `pages/resources/index.vue`. |
| 9 - Blog | **NO CHANGE** | `ncBlogSection` component, line 68 | Keep as-is. |

### Implementation steps (Homepage)
1. Replace hero copy (Panel 1) -- update `<h1>`, `<p>`, button text, and announcement bar text in `pages/index.vue`.
2. Restructure the CTA section (Panel 6) -- keep FAQ CTA, remove embedded webinar sub-panel from `.panel-footer`.
3. Add Initiatives section (Panel 7) -- create `ncInitiativesSlider.vue` or use inline carousel markup. Needs two cards: "2025 Challenge" and "Indigenous Languages."
4. Add Resources section (Panel 8) -- add `ncBaseSection` that queries resources collection and renders `ncResourceCard` grid.
5. Reorder sections: Hero -> (Panel 2 placeholder) -> (Panel 3 placeholder) -> FAQ CTA -> Initiatives -> Resources -> Blog.
6. Remove the Video section (`#video-section`, lines 34-42) -- it is not in the new structure.

---

## 2. Incubator Page (`pages/incubator/2026.vue`)

### Current structure
1. `ncHero` -- hero with brow, heading, description, announcement bar
2. `ncBaseSection` -- Program Overview
3. `ncBaseSection.section-bg` -- What We Offer (4 cards)
4. `ncBaseSection` -- Who Should Apply (eligibility)
5. `ncTimeline` -- Timeline with placeholder dates
6. `ncBaseSection` -- Ready to Apply CTA
7. `ncBaseSection` -- Judges + International Observer

### Target structure

| Panel | Action | File | Notes |
|-------|--------|------|-------|
| 1 - Hero | **MODIFY** -- replace copy with "Building a Shared Digital Future" + full Incubator description | `pages/incubator/2026.vue` lines 2-23 | Content ready. Replace `<h1>`, `<p>`, brow text. Keep announcement bar pointing to 2025 Challenge. |
| 2 - Call for Proposals | **NEW SECTION** -- Indigenous Languages CTA | After hero | **BLOCKED**: form URL. Skip; leave TODO. |
| 3 - Webinars | **NEW SECTION** -- webinar signup CTA | After Panel 2 | **BLOCKED**: signup URL. Skip; leave TODO. |
| 4 - Why the Incubator? | **NEW SECTION** -- 3-paragraph explanation | Add after Panel 3 position | Content ready. Simple `ncBaseSection` with prose. |
| 5 - Programmatic Offerings | **MODIFY** -- replace "What We Offer" 4-card grid with narrative description + bullet list | `pages/incubator/2026.vue` lines 42-66 | Content ready (except "X-week" duration TBD). Change `.offer-cards` grid to prose + `<ul>`. |
| 7 - Call for Proposals (repeat) | Same as Panel 2 | — | **BLOCKED**: same blocker. |
| 8 - Helpful Tips | **NEW SECTION** -- resources CTA link | Add section | Content ready. Simple CTA linking to `/resources`. |
| 9 - FAQ | **NEW SECTION** -- FAQ CTA link | Add section | Content ready. Simple CTA linking to `/faq`. |
| **REMOVE** | Judges/Observers section (lines 103-108) | Delete `<nc-base-section>` with `ncJudgesGrid` and `ncObserversGrid` | — |
| **REMOVE** | Timeline section (line 89) | Delete `<nc-timeline>` | — |
| **REMOVE** | "Ready to Apply?" CTA (lines 92-101) | Delete section | — |
| **REMOVE** | "Who Should Apply" eligibility section (lines 69-87) | Delete section | — |
| **REMOVE** | "Program Overview" section (lines 26-39) | Replaced by Panel 4 | — |

### Implementation steps (Incubator)
1. Replace hero copy (Panel 1).
2. Add "Why the Incubator?" section (Panel 4) as prose `ncBaseSection`.
3. Transform "What We Offer" into "Programmatic Offerings" (Panel 5) -- replace card grid with narrative + bullets.
4. Add "Helpful Tips" CTA (Panel 8) linking to `/resources`.
5. Add "FAQ" CTA (Panel 9) linking to `/faq`.
6. Remove: Judges/Observers, Timeline, "Ready to Apply?" CTA, "Who Should Apply", "Program Overview."

---

## 3. Challenge Page (`pages/the-2025-challenge.vue`)

| Section | Action | Notes |
|---------|--------|-------|
| Panel 1 - Hero overview | **MODIFY** -- replace intro text (lines 6-12) with updated 2025 Challenge description | Content ready. Only the `<p>` blocks inside `.hero__content > .panel > .switcher` change. |
| Everything else | **NO CHANGE** | Winners, gallery, jury, blog sections stay. |

### Implementation steps (Challenge)
1. Replace the two `<p>` blocks in the hero switcher with the new description copy.

---

## 4. FAQ Page (`pages/faq.vue`)

### Current structure
- 6 category sections with 14 total FAQ items (all `[PLACEHOLDER]` text)
- Categories: About the Incubator (4), Eligibility (3), Application Process (3), Support & Resources (2), Timeline & Key Dates (2), Data Governance (2)
- Data is inline in `<script setup>` as a `faq` object with category keys

### Target structure
- 13 new Incubator FAQ items replacing all 14 current items
- New category grouping TBD

| Action | File | Notes |
|--------|------|-------|
| **REPLACE** all FAQ content | `pages/faq.vue` -- replace entire `faq` object in `<script setup>` (lines 33-197) | Content ready. |
| **UPDATE** category headings in template | `pages/faq.vue` -- update `<h3>` elements and `v-for` keys (lines 7-29) | New grouping TBD -- implementer should organize the 13 items into logical groups. |

### Implementation steps (FAQ)
1. Replace the `faq` object with 13 new FAQ items, organized into new categories.
2. Update the `<template>` to reflect the new category structure (add/remove `ncFaqSection` blocks as needed).

---

## 5. Footer (`components/ncFooter.vue`)

### Current structure (line 23-38)
- Column 3 (`.footer__col3`) contains:
  - **Partners** heading with `ncDirectReliefLogo` + Institutional Data Initiative image
  - **International Observer** heading with `ncUnescoLogo`

### Target structure
- Remove "Partners" section (Direct Relief + IDI)
- Remove "International Observer" label
- Replace with: **Partners** section showing UNESCO + Microsoft logos

| Action | File | Notes |
|--------|------|-------|
| **MODIFY** `.footer__col3` content | `components/ncFooter.vue` lines 23-38 | Remove `ncDirectReliefLogo`, remove IDI image, remove "International Observer" div. Replace with single "Partners" div containing `ncUnescoLogo` + `ncMsLogo`. Both logo components already exist. |

### Implementation steps (Footer)
1. In `.footer__col3`, remove the `<nc-direct-relief-logo />` and `<img ... alt="Institutional Data Initiative" />`.
2. Remove the entire `.international-observer` div.
3. Change the Partners `.logos` div to contain `<nc-unesco-logo />` and `<nc-ms-logo />`.

---

## 6. Navigation (`components/ncTopbar.vue`)

### Current nav items (line 8-13)
1. The Incubator (`/incubator/2026`)
2. The 2025 Challenge (`/the-2025-challenge`)
3. Resources (`/resources`)
4. Blog (`/blog`)
5. FAQ (`/faq`)
6. Rules (external link via `rulesUrl`)

### Target nav items
1. The Incubator
2. The 2025 Challenge
3. **Initiatives** (new)
4. Resources
5. Blog
6. FAQ
7. ~~Rules~~ (remove)

| Action | File | Notes |
|--------|------|-------|
| **ADD** "Initiatives" link | `components/ncTopbar.vue` -- add `<li>` after "The 2025 Challenge" | Needs a target URL. If `/initiatives` page does not exist, this may link to a homepage anchor (`/#initiatives`) or a new page. **Decision needed.** |
| **REMOVE** "Rules" link | `components/ncTopbar.vue` -- delete line 13 | Also check if `useSiteLinks` composable (`composables/useSiteLinks.js`) needs cleanup. |

### Implementation steps (Navigation)
1. Remove the Rules `<li>` (line 13).
2. Add an Initiatives `<li>` in the desired position.
3. Determine Initiatives link target (new page vs. anchor).

---

## 7. Branding -- Logo Components

### Current state
- `components/ncLogoHeader.vue` -- SVG with `alt="New Commons"` `title="New Commons"`. The SVG path data renders the text "New Commons." visually (no word "challenge" in alt/title or visible text).
- `components/ncLogoFooter.vue` -- SVG rendering "Commons" text in white. No word "challenge" visible in code.

### Assessment
The logos already say "New Commons" (not "New Commons Challenge"). The SVG vector paths contain the rendered text. **Visually verify** that neither logo currently shows "Challenge" -- if they do, the SVG `<path>` data must be regenerated from a new logo asset (cannot be string-edited).

| Action | File | Notes |
|--------|------|-------|
| **VERIFY** no "challenge" text renders | `components/ncLogoHeader.vue`, `components/ncLogoFooter.vue` | If "challenge" is visually present, new SVG assets are needed from the designer. If not, no change required. |

---

## 8. New Components Needed

| Component | Purpose | Reuse opportunity |
|-----------|---------|-------------------|
| `ncInitiativesSlider.vue` (or similar) | Homepage Panel 7 -- slider/carousel with initiative cards | Could leverage existing carousel dependency if one exists, or use a simple CSS scroll-snap slider. |

No other new components are strictly required -- all other new sections can be built with existing `ncBaseSection`, `ncCta`, `ncButton`, and `ncResourceCard` components.

---

## 9. Blockers Summary

| Blocker | Affects | Action |
|---------|---------|--------|
| Application form URL | Homepage Panel 2, Incubator Panels 2 and 7 | Leave TODO placeholder with disabled button |
| Webinar signup URL | Homepage Panel 3, Incubator Panel 3 | Leave TODO placeholder |
| Homepage Panel 4 content | Homepage Panel 4 | Skip entirely (no content) |
| "X-week" duration | Incubator Panel 5 (Programmatic Offerings) | Use placeholder `[X-week]` |
| FAQ category grouping | FAQ page | Implementer decides grouping for 13 items |
| Initiatives link target | Navigation | Decide: new page, homepage anchor, or existing page |

---

## 10. Files Changed Summary

### Modified files (8)
1. `pages/index.vue` -- hero copy, restructure sections, add initiatives + resources sections
2. `pages/incubator/2026.vue` -- hero copy, replace offerings, add new sections, remove judges/timeline/CTA
3. `pages/the-2025-challenge.vue` -- hero intro text only
4. `pages/faq.vue` -- replace all 14 FAQ items with 13 new ones
5. `components/ncFooter.vue` -- replace Partners/Observer with UNESCO + Microsoft
6. `components/ncTopbar.vue` -- add Initiatives link, remove Rules link
7. `components/ncLogoHeader.vue` -- verify only (likely no change)
8. `components/ncLogoFooter.vue` -- verify only (likely no change)

### New files (1)
1. `components/ncInitiativesSlider.vue` -- homepage initiatives carousel (Panel 7)

### Deleted files (0)
No files deleted. `ncJudgesGrid`, `ncObserversGrid`, `ncTimeline`, `ncDirectReliefLogo` components remain in the codebase (still used on the Challenge page or potentially elsewhere).

---

## 11. Suggested Implementation Order

1. **Footer** (`ncFooter.vue`) -- small, self-contained change
2. **Navigation** (`ncTopbar.vue`) -- small, self-contained change
3. **Branding** (logo verification) -- quick visual check
4. **FAQ page** (`faq.vue`) -- content swap, no structural changes
5. **Challenge page** (`the-2025-challenge.vue`) -- single paragraph swap
6. **Incubator page** (`incubator/2026.vue`) -- moderate restructure
7. **Homepage** (`index.vue`) -- largest change, depends on new initiatives component

---

## 12. Deepened Details (Verification & Implementation Notes)

> Added 2026-03-30 after reading every referenced source file.

### Line Number & Structure Corrections

The plan's line references are **accurate** for the current codebase state. Key confirmations:

| Plan claim | Verified? | Notes |
|------------|-----------|-------|
| Homepage hero at lines 2-32 | Yes | `<nc-hero id="hero">` runs lines 2-32. |
| Homepage video section lines 34-42 | Yes | `<nc-base-section id="video-section" width="narrow">` at lines 34-42. |
| Homepage CTA lines 45-67 | Yes | `<nc-cta id="cta" :single-column="true">` at lines 45-67. |
| Homepage blog at line 68 | Yes | `<nc-blog-section id="blog" :posts="blogposts" />` at line 68. |
| Incubator hero lines 2-23 | Yes | Hero runs lines 2-23. |
| Incubator "What We Offer" lines 42-66 | Yes | `<nc-base-section class="section-bg" color="primary">` at lines 42-66. |
| Incubator eligibility lines 69-87 | Yes | Lines 68-87 (line 68 is the `<!-- TODO -->` comment). |
| Incubator timeline line 89 | Yes | Exact match. |
| Incubator "Ready to Apply?" lines 92-101 | Yes | Lines 91-101 (line 91 is the `<!-- TODO -->` comment). |
| Incubator Judges lines 103-108 | Yes | Lines 103-108. |
| Footer `.footer__col3` lines 23-38 | Yes | Lines 23-38 exactly. |
| Topbar nav lines 8-13 | Yes | 6 `<li>` items at lines 8-13. |
| FAQ `faq` object lines 33-197 | Yes | Object spans lines 33-197. Template has 6 categories at lines 6-29. |
| Challenge hero `<p>` blocks lines 6-12 | Yes | The hero switcher contains 3 `<p>` blocks at lines 8-12 (not 2 as stated). Actually there are 3 `<p>` blocks: line 8 (long main paragraph), line 11 (event paragraph), line 12 (grantee details). |

**Correction — Challenge page (Section 3):** The plan says "two `<p>` blocks" in the hero switcher. There are actually **three** `<p>` elements inside `.hero__content > .panel > .switcher > div:first-child` (lines 8, 11, 12). All three need to be reviewed for replacement.

### Component Architecture Details

#### `ncHero` (`components/ncHero.vue`)
- Pure slot-based wrapper. No props. Renders `<div class="hero | subgrid">` and applies deep scoped styles for `.panel h1` (size-4, 800 weight) and `.panel p` (size-0 + 1px).
- Layout: uses `display: flex` for `.hero__content` with `gap: var(--space-2xl-3xl)` and children flex: 1.
- Announcement bar is placed as a sibling to `.hero__content` inside the slot, using the `<nc-announcement>` component.

#### `ncBaseSection` (`components/ncBaseSection.vue`)
- **Props:** `width` (String, default `'content'`), `color` (String, `''`|`'base'`|`'primary'`|`'secondary'`|`'faded'`), `backgroundImage` (String), `subgrid` (Boolean).
- Wraps `<ccm-base-section>`, which is the lower-level grid primitive.
- Content slot goes inside `.nc-base-section__content` which gets `grid-column: content-start / content-end`.
- `width="narrow"` constrains to `col2 / col11`.
- Color variants: `"faded"` = `var(--base-color-07-tint)` (light gray).

#### `ncCta` (`components/ncCta.vue`)
- **Props:** `singleColumn` (Boolean, default `false`).
- Wraps `<ccm-base-section>` with `size="l"`.
- Default slot goes into first `.cta__content` (grid-column `content-start / col6`).
- Named `right` slot goes into second `.cta__content` (grid-column `col7 / content-end`).
- When `singleColumn=true`, the single `.cta__content` spans `content-start / content-end` with `text-align: center`.
- **Important:** The current homepage uses `ncCta` with `singleColumn=true` and manages its own two-panel layout (`panel-header` + `panel-footer`) via custom CSS. When removing the `.panel-footer` webinar sub-panel (Panel 6), the `.panel-footer` CSS rules in `pages/index.vue` (lines 177-187) should also be removed to avoid dead CSS.

#### `ncResourceCard` (`components/ncResourceCard.vue`)
- **Props:** `content` (Object, required). Expects `{ title, description, category, cover_image?, url?, file?, slug }`.
- Uses `useResources()` composable for `getImage()`, `getResourceLink()`, `isExternalLink()`.
- CSS: card with outline border, `var(--border-radius-l)`, hover shadow.
- Image: 16/9 aspect ratio, object-fit cover.

#### `ncFaqSection` (`components/ncFaqSection.vue`)
- Slot-based. Wraps `<nc-base-section>` and uses CSS to create a 2-column layout at 768px+: heading in `content-start / col4`, collapse items in `col5 / content-end`.
- Each category needs its own `<nc-faq-section>` block with an `<h3>` and `v-for` of `<nc-collapse>` items.

#### `ncCollapse` (referenced in FAQ)
- Takes a `data` prop with shape `{ summary: string, content: string (HTML) }` and a `name` prop (string).

### Grid System & Layout Utilities

The project uses an **Every Layout**-based utility CSS system (`public/css/base/everylayout.css`):

- **`.grid`** — `display: grid; grid-template-columns: repeat(auto-fill, minmax(var(--_grid-min-width, 240px), 1fr)); gap: var(--_grid-gap, var(--base-gutter));`
  - Override `--_grid-min-width` via inline style or scoped CSS (e.g., `--_grid-min-width: 300px` on resources page).
- **`.stack`** — Vertical stack with `--_stack-space` gap.
- **`.switcher`** — Flex layout that switches from row to column at a threshold.
- **`.cluster`** — Flex wrap layout.
- **`.reel`** — Horizontal scroll container (`display: flex; overflow-x: auto`). **Not currently used anywhere in `.vue` files**, but available. Could be used for the initiatives slider instead of creating a full carousel component.

### New Component: Initiatives Section

#### Recommendation: Use `.reel` utility instead of `ncInitiativesSlider.vue`

The project has `vue-carousel` (v0.18.0) in `package.json` but it is **not imported in any component**. It is a Vue 2 package and will not work with Vue 3/Nuxt 3.

**Recommended approach for Panel 7 (Initiatives):** Do not create `ncInitiativesSlider.vue`. Instead, use the existing `.reel` utility class with CSS `scroll-snap` for a lightweight horizontal scrolling section. With only 2 cards, a simple flexbox row (non-scrolling on desktop, scrollable on mobile) is sufficient.

```html
<!-- Panel 7: Initiatives — inline in pages/index.vue -->
<nc-base-section id="initiatives">
  <h2>Initiatives</h2>
  <div class="initiatives-cards">
    <a href="/the-2025-challenge" class="initiative-card">
      <img src="..." alt="The 2025 Challenge" class="initiative-card__image" />
      <h3>The 2025 Challenge</h3>
      <p>Description...</p>
    </a>
    <a href="#" class="initiative-card">
      <!-- TODO: Indigenous Languages initiative URL -->
      <img src="..." alt="Indigenous Languages" class="initiative-card__image" />
      <h3>Indigenous Languages</h3>
      <p>Description...</p>
    </a>
  </div>
</nc-base-section>
```

Scoped CSS pattern to follow:
```css
.initiatives-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--base-gutter);
}

.initiative-card {
  background: white;
  border-radius: var(--border-radius-l);
  outline: 1px solid var(--black-color-10-tint);
  padding: var(--space-xs);
  text-decoration: none;
  color: inherit;
  transition: box-shadow 150ms ease;
}

.initiative-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.initiative-card__image {
  border-radius: var(--border-radius-s);
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

This follows the exact same pattern as `ncResourceCard` and `ncBlogCard`.

### Resources Section (Panel 8) — Implementation Detail

The homepage resources section should query the `resources` collection identically to `pages/resources/index.vue`:

```html
<nc-base-section id="resources">
  <h2>Resources</h2>
  <div class="grid resource-grid" style="--_grid-min-width: 300px;">
    <nc-resource-card
      v-for="resource in resources"
      :key="resource.slug"
      :content="resource"
    />
  </div>
</nc-base-section>
```

Script addition to `pages/index.vue`:
```js
const { data: resources } = await useAsyncData('homepage-resources', () =>
  queryCollection('resources').limit(3).all()
)
```

**Important:** Use a distinct cache key (`'homepage-resources'`) to avoid colliding with the `'resources'` key used on `pages/resources/index.vue`.

### Footer — Concrete Changes

Current `.footer__col3` (lines 23-38) becomes:

```html
<div class="footer__col3 footer__content stack">
  <div class="partners">
    <h3>Partners</h3>
    <div class="logos">
      <nc-unesco-logo />
      <nc-ms-logo />
    </div>
  </div>
</div>
```

Both `<nc-unesco-logo />` and `<nc-ms-logo />` are confirmed to exist as inline SVG components. The `ncUnescoLogo` renders a white-filled UNESCO temple icon (43x32). The `ncMsLogo` renders the white Microsoft wordmark + four-square logo (94x20). Both will render correctly against the dark footer background (`#0E2F40`) since they use `fill="white"`.

**Note:** The `ncDirectReliefLogo` component is used **only** in the footer. After this change, it becomes dead code. The `<img src="/assets/i-data.png" alt="Institutional Data Initiative" />` is also only in the footer.

### Navigation — Concrete Changes

Remove the Rules `<li>` (line 13) and add Initiatives:

```html
<li><nc-button to="/incubator/2026" color="base" variant="link">The Incubator</nc-button></li>
<li><nc-button to="/the-2025-challenge" color="base" variant="link">The 2025 Challenge</nc-button></li>
<li><nc-button to="/#initiatives" color="base" variant="link">Initiatives</nc-button></li>
<li><nc-button to="/resources" color="base" variant="link">Resources</nc-button></li>
<li><nc-button to="/blog" color="base" variant="link">Blog</nc-button></li>
<li><nc-button to="/faq" color="base" variant="link">FAQ</nc-button></li>
```

**Decision recommendation:** Link to `/#initiatives` (homepage anchor) since no `/initiatives` page exists and creating one for only 2 items is overkill.

**`useSiteLinks` cleanup:** The composable (`composables/useSiteLinks.js`) only exports `rulesUrl`. After removing the Rules link from `ncTopbar.vue`, also check that `the-2025-challenge.vue` line 99 still uses `rulesUrl` — it does (for the "Read the Challenge Rules" button). So `useSiteLinks` should **not** be deleted; the `rulesUrl` is still used on the Challenge page. But `ncTopbar.vue` no longer needs to import it.

### Logo Branding Verification

- **`ncLogoHeader.vue`:** SVG contains `alt="New Commons"` and `title="New Commons"`. The text path data spells "New Commons." (with period). **No "Challenge" text is present** in alt, title, or SVG paths. Confirmed safe — no change needed.
- **`ncLogoFooter.vue`:** SVG renders "Commons" text in white (the `N-e-w` text is rendered as the dotted-square icon mark, not a word). The word "Challenge" does not appear anywhere. Confirmed safe — no change needed.

### FAQ Page — Structural Notes

The current template has 6 `<nc-faq-section>` blocks with different background patterns:
- First block uses `background-color="transparent"` (via the wrapping `<nc-base-section>`)
- Last block has class `last-item` with `margin-bottom: var(--space-2xl-3xl)`

The `ncCollapse` component expects `{ summary: string, content: string }` in its `data` prop. Content is raw HTML. The `name` prop groups collapses for exclusive open behavior (like an accordion within the same name group).

When replacing the 13 new FAQ items, the implementer should:
1. Choose new category keys for the `faq` object
2. Create matching `<nc-faq-section>` blocks in the template
3. Preserve the first section's `background-color="transparent"` pattern
4. Keep the `last-item` class on the final section

### Risks & Edge Cases

1. **`vue-carousel` is a Vue 2 package.** It is in `package.json` but unused. Do NOT attempt to use it for the initiatives slider — it will break with Nuxt 3's Vue 3 runtime. Use CSS-only scroll or simple grid instead.

2. **`ncDirectReliefLogo` becomes orphaned.** After footer changes, this component has no consumers. Same for the IDI image asset at `/assets/i-data.png`. These should be tracked for cleanup but are not blockers.

3. **`ncJudgesGrid` and `ncObserversGrid` are still used on the Challenge page** (lines 108 and 113 of `the-2025-challenge.vue`). The plan correctly notes these components should NOT be deleted from the codebase, even though they are removed from the Incubator page.

4. **Incubator page scoped CSS will have dead rules after restructure.** After removing the offer cards, eligibility panel, timeline, and CTA sections, the following scoped CSS blocks in `pages/incubator/2026.vue` become dead code and should be removed:
   - `.offer-cards` and `.offer-card` rules (lines 150-185)
   - `.eligibility-panel` rules (lines 187-189)
   - `.cta-panel` rules (lines 191-200)
   - `.section-bg` rules (lines 139-144) — only if the background image section is fully removed

5. **Homepage scoped CSS cleanup needed.** After removing `#video-section`, the following CSS blocks become dead:
   - `#video-section` rules (lines 103-111)
   - `.video-frame` rules (lines 146-149)
   After removing `.panel-footer` from the CTA:
   - `#cta .cta-panel .panel-footer` rules (lines 177-187)

6. **`useAsyncData` cache key collision risk.** The homepage already uses `'blogposts'` as a cache key. The resources query must use a different key (e.g., `'homepage-resources'`).

7. **Incubator page has a commented-out blog section** (line 110: `<!--<nc-blog-section id="blog" :posts="blogposts" />-->`). This should be cleaned up during the restructure — either uncomment if blog is wanted, or delete the comment.

8. **No `/initiatives` page exists.** The nav Initiatives link target needs to be decided. Recommendation: `/#initiatives` homepage anchor (simple, no new page needed). If a dedicated page is later needed, it can be added without changing the anchor link pattern.

9. **Homepage announcement bar links to `/the-2025-challenge`** (line 27). This may need updating depending on the new hero content — the plan mentions updating announcement bar text (Panel 1) but does not specify whether the link target changes.
