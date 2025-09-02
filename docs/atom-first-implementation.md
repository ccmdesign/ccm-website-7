# Atom-First Implementation Plan

## Starting with the Smallest Components

You're correct - we need to build atoms first, then compose them into molecules like `ccmCard`. Let me identify the actual atomic components needed.

## Analysis: What Atoms Do We Need for Current Pages?

Looking at your existing content and pages, here are the fundamental atoms required:

### Current Content Atoms Needed:
1. **`ccmHeading`** - For consistent title hierarchy (h1, h2, h3)
2. **`ccmText`** - For body text, excerpts, descriptions  
3. **`ccmLink`** - For all navigation and content links
4. **`ccmTimestamp`** - For consistent date formatting
5. **`ccmBadge`** - For tags, categories, status indicators
6. **`ccmButton`** - For CTAs and actions

---

## Atom Implementation Order

### Phase 1A: Essential Display Atoms (Week 1, Days 1-2)

#### 1. **`ccmHeading`** - FIRST PRIORITY
**Why first:** Every page needs consistent heading hierarchy
**Usage:** Page titles, section headers, card titles
**Current problem:** Inconsistent heading levels across pages

```vue
<!-- Usage examples from your content -->
<ccmHeading level="1">{{ post.title }}</ccmHeading>
<ccmHeading level="2">Latest Blog Posts</ccmHeading>
<ccmHeading level="3">{{ caseStudy.title }}</ccmHeading>
```

#### 2. **`ccmText`** - SECOND PRIORITY  
**Why second:** Needed for all content display
**Usage:** Excerpts, descriptions, body content
**Current problem:** Inconsistent text handling

```vue
<!-- Usage examples -->
<ccmText variant="excerpt">{{ post.excerpt }}</ccmText>
<ccmText variant="body">{{ post.description }}</ccmText>
```

#### 3. **`ccmLink`** - THIRD PRIORITY
**Why third:** Foundation for all navigation  
**Usage:** Content links, navigation, CTAs as links
**Current problem:** Basic NuxtLink everywhere without consistency

```vue
<!-- Usage examples -->
<ccmLink :to="post._path">{{ post.title }}</ccmLink>
<ccmLink to="/blog" variant="see-more">View all blog posts →</ccmLink>
```

### Phase 1B: Metadata Atoms (Week 1, Days 3-4)

#### 4. **`ccmTimestamp`** - FOURTH PRIORITY
**Why fourth:** Dates appear everywhere and need consistent formatting
**Usage:** Blog post dates, case study dates, last updated
**Current problem:** Inconsistent date formatting (new Date().toLocaleDateString())

```vue
<!-- Usage examples from your content -->
<ccmTimestamp :date="post.date" format="long" />
<ccmTimestamp :date="post.date" format="relative" />
```

#### 5. **`ccmBadge`** - FIFTH PRIORITY
**Why fifth:** Tags, categories, and status indicators are everywhere
**Usage:** Blog tags, case study services, categories, client industries
**Current problem:** No consistent way to display tags/categories

```vue
<!-- Usage examples -->
<ccmBadge>{{ tag }}</ccmBadge>
<ccmBadge variant="category">{{ category }}</ccmBadge>
<ccmBadge variant="service">{{ service }}</ccmBadge>
```

### Phase 1C: Interactive Atoms (Week 1, Day 5)

#### 6. **`ccmButton`** - SIXTH PRIORITY
**Why sixth:** Foundation for all CTAs and PX methodology
**Usage:** Primary actions, secondary actions, form submissions
**Current problem:** No consistent button component for CTAs

```vue
<!-- Usage examples -->
<ccmButton variant="primary" @click="handleSubscribe">Subscribe</ccmButton>
<ccmButton variant="secondary" :href="post._path">Read More</ccmButton>
```

---

## Detailed Atom Specifications

### 1. ccmHeading
**File:** `components/ccmHeading.vue`

**Props:**
```typescript
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' // Allow semantic override
}
```

**Usage:**
- Blog/case study titles
- Section headers on homepage
- Page titles across site

### 2. ccmText
**File:** `components/ccmText.vue`

**Props:**
```typescript
interface TextProps {
  variant?: 'body' | 'excerpt' | 'caption' | 'label'
  tag?: 'p' | 'span' | 'div'
}
```

**Usage:**
- Post excerpts and descriptions
- Body text content
- Metadata labels

### 3. ccmLink
**File:** `components/ccmLink.vue`

**Props:**
```typescript
interface LinkProps {
  to?: string
  href?: string  
  variant?: 'default' | 'see-more' | 'nav'
  external?: boolean
}
```

**Usage:**
- All content links
- Navigation links  
- "View all" links

### 4. ccmTimestamp
**File:** `components/ccmTimestamp.vue`

**Props:**
```typescript
interface TimestampProps {
  date: string | Date
  format?: 'short' | 'long' | 'relative' | 'custom'
  customFormat?: string
}
```

**Usage:**
- Blog post publication dates
- Case study completion dates
- Last updated timestamps

### 5. ccmBadge
**File:** `components/ccmBadge.vue`

**Props:**
```typescript
interface BadgeProps {
  variant?: 'tag' | 'category' | 'service' | 'status'
  size?: 'small' | 'medium' | 'large'
  clickable?: boolean
}
```

**Usage:**
- Blog post tags
- Case study service types
- Client industries
- Content categories

### 6. ccmButton
**File:** `components/ccmButton.vue`

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'text'
  size?: 'small' | 'medium' | 'large'
  href?: string
  to?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}
```

**Usage:**
- Primary CTAs
- "Read More" actions
- Form submissions
- Navigation actions

---

## Week 1 Daily Breakdown

### Day 1: ccmHeading
- Build basic heading component with level prop
- Test with blog titles, page headers
- Ensure semantic HTML (h1, h2, etc.)

### Day 2: ccmText  
- Build text component with variant prop
- Test with blog excerpts, descriptions
- Handle different text contexts

### Day 3: ccmLink
- Build link component with internal/external detection
- Test with content links, navigation
- Handle NuxtLink vs regular anchor tags

### Day 4: ccmTimestamp
- Build date formatting component
- Test with blog post dates
- Multiple format options (relative, absolute)

### Day 5: ccmBadge & ccmButton
- Build badge component for tags/categories
- Build button component for actions
- Test with existing content

### Weekend: Testing & Refinement
- Test all atoms together
- Refine props interfaces
- Prepare for molecule composition

---

## Success Criteria for Week 1

After building these 6 atoms:
- **Consistent heading hierarchy** across all pages
- **Proper semantic HTML** for all text content
- **Unified link behavior** with analytics potential
- **Consistent date formatting** everywhere dates appear
- **Professional badge display** for all tags/categories
- **Standard button component** ready for CTAs

**Ready for Week 2:** Build `ccmCard` molecule by composing these atoms together.

---

## Benefits of Atom-First Approach

1. **Reusability maximized** - Every higher-level component uses these atoms
2. **Consistency guaranteed** - Single source of truth for each element type  
3. **Maintenance simplified** - Change heading behavior in one place
4. **Testing easier** - Test small, focused components thoroughly
5. **Composition natural** - Molecules naturally emerge from atom combinations

**Shall we start with `ccmHeading` as the first atom?**