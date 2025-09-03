# Corrected Component Inventory: Generic Atomic Design System

## Overview

This document provides a corrected approach using proper atomic design methodology with **generic, reusable components** rather than content-specific ones. Components are designed to be flexible and composable for any content type.

**Core Principle:** Build generic components that can handle any content through props, slots, and composition - not specific components for each content type.

## ⚠️ CRITICAL SCOPE: NO CSS - HTML + JavaScript ONLY

---

## ATOMS (Foundational Elements)
*Single-purpose, indivisible generic components*

**Total: 7 Atoms**

### Atoms
1. **`ccmButton`** - Generic button (variants: primary, secondary, link, submit)
7. **`ccmInput`** - Generic form input (text, email, search, etc.)
8. **`ccmTextarea`** - Multi-line text input with auto-resize
9. **`ccmSelect`** - Dropdown select with search capabilities
10. **`ccmCheckbox`** - Checkbox with indeterminate state support
11. **`ccmBadge`** - Small status/category indicator (tags, status, type)
12. **`ccmTimestamp`** - Formatted date/time with multiple display options

---

## MOLECULES (Functional Groups)
*Combinations of atoms forming functional interface elements*

**Total: 12 Molecules**

### Content Presentation Molecules
1. **`ccmCard`** - Generic content card (title, body, actions, metadata)
3. **`ccmMetaList`** - List of metadata items (author, date, category, etc.)
4. **`ccmBadgeList`** - Collection of badges with management logic
5. **`ccmActionGroup`** - Collection of buttons with hierarchy logic
6. **`ccmBreadcrumb`** - Generic breadcrumb navigation
8. **`ccmNavList`** - Vertical or horizontal navigation list
9. **`ccmTabs`** - Tab interface with content panels
10. **`ccmFormField`** - Input + label + validation + help text
11. **`ccmFormGroup`** - Collection of related form fields
12. **`ccmSearchBox`** - Search input + button + filters
13. **`ccmSection`** - Generic content section with optional header/footer
15. **`ccmSidebar`** - Collapsible sidebar with content slots

---

## ORGANISMS (Complex Components)  
*Groups of molecules forming distinct interface sections*

**Total: 5 Organisms**

4. **`ccmFeaturedContent`** - Highlighted content grid with multiple items
5. **`ccmHeader`** - Site header with navigation, search, actions
6. **`ccmFooter`** - Site footer with organized link groups and content
7. **`ccmSiteNav`** - Main site navigation with nested menus
10. **`ccmContactForm`** - Multi-step contact/inquiry form
---

## USAGE EXAMPLES

### How Generic Components Handle Different Content Types:

**Blog Post:**
```vue
<ccmContentDetail>
  <template #hero>
    <ccmHeroSection 
      :title="post.title" 
      :subtitle="post.tagline"
      :cta="{ text: 'Subscribe', action: 'subscribe' }"
    />
  </template>
  
  <template #metadata>
    <ccmMetaList :items="[
      { label: 'Author', value: post.author },
      { label: 'Date', value: post.date },
      { label: 'Read Time', value: post.readTime }
    ]" />
    <ccmBadgeList :badges="post.tags" />
  </template>
  
  <template #content>
    <ContentRenderer :value="post" />
  </template>
  
  <template #actions>
    <ccmActionGroup :actions="[
      { text: 'Share', type: 'secondary', action: 'share' },
      { text: 'Subscribe', type: 'primary', action: 'subscribe' }
    ]" />
  </template>
</ccmContentDetail>
```

**Case Study:**
```vue
<ccmContentDetail>
  <template #hero>
    <ccmHeroSection 
      :title="caseStudy.title" 
      :subtitle="caseStudy.challenge"
      :cta="{ text: 'Get Similar Results', action: 'contact' }"
    />
  </template>
  
  <template #metadata>
    <ccmMetaList :items="[
      { label: 'Client', value: caseStudy.client },
      { label: 'Industry', value: caseStudy.industry },
      { label: 'Duration', value: caseStudy.duration }
    ]" />
    <ccmBadgeList :badges="caseStudy.services" />
  </template>
  
  <!-- Same structure, different data -->
</ccmContentDetail>
```

**Client Profile:**
```vue
<ccmContentDetail>
  <template #hero>
    <ccmHeroSection 
      :title="client.name" 
      :subtitle="client.industry"
      :cta="{ text: 'View All Work', action: 'portfolio' }"
    />
  </template>
  
  <!-- Same components, different content -->
</ccmContentDetail>
```

---

## CONTENT-SPECIFIC LOGIC THROUGH COMPOSITION

Instead of creating content-specific components, we handle business logic through:

### 1. **Composables** (Business Logic)
```javascript
// useContentDisplay.js - handles any content type
export function useContentDisplay(contentType, content) {
  const metaFields = computed(() => {
    switch(contentType) {
      case 'blog': return ['author', 'date', 'readTime']
      case 'case-study': return ['client', 'industry', 'duration'] 
      case 'service': return ['category', 'deliverables']
      default: return ['date', 'type']
    }
  })
  
  const primaryAction = computed(() => {
    switch(contentType) {
      case 'blog': return { text: 'Subscribe', action: 'subscribe' }
      case 'case-study': return { text: 'Get Results', action: 'contact' }
      case 'service': return { text: 'Learn More', action: 'service-detail' }
    }
  })
  
  return { metaFields, primaryAction }
}
```

### 2. **Props and Configuration**
Components accept configuration objects to adapt behavior:

```vue
<ccmContentList 
  :items="posts"
  :config="{
    displayType: 'card',
    showMetadata: ['author', 'date'],
    showBadges: 'tags',
    primaryAction: { text: 'Read More', action: 'read' },
    filterBy: ['category', 'author'],
    sortBy: ['date', 'title']
  }"
/>
```

### 3. **PX Methodology Through Configuration**
```vue
<ccmActionGroup 
  :actions="actions"
  :pxMode="true"  <!-- Enforces single primary action -->
  :progressiveEngagement="userEngagementLevel"
/>
```

---

## DEVELOPMENT PHASES

### Phase 1: Foundation (Atoms + Basic Molecules)
- All 12 atoms
- Content presentation molecules (1-5)
- Form molecules (10-12)

### Phase 2: Layout & Navigation  
- Navigation molecules (6-9)
- Layout molecules (13-15)
- Navigation organisms (5-7)
- Layout organisms (11-12)

### Phase 3: Content Systems
- Content display organisms (1-4)
- Interactive organisms (8-10)
- Core page templates (1-4)

### Phase 4: Business Logic
- Business templates (5-8)
- PX methodology integration
- Advanced composables and business logic

---

## TECHNICAL BENEFITS

**Reusability:** Each component can handle multiple content types through props and slots
**Maintainability:** Single component to maintain instead of multiple content-specific versions
**Flexibility:** New content types work immediately without new components
**DRY Principle:** No duplicate logic across similar content types  
**Scalability:** System grows by adding data/configuration, not components
**Testing:** Test once, works for all content types