# Accessibility Implementation [[FRONTEND ONLY]]

## Accessibility Standards

**WCAG 2.1 AA Compliance Target**: All components and content must meet WCAG 2.1 Level AA standards for accessibility, with specific enhancements for research and academic content presentation.

### Semantic HTML Usage Requirements

**All content components must use semantic HTML5 elements:**

```vue
<template>
  <!-- Blog post semantic structure -->
  <article class="blog-post" role="main">
    <header class="blog-post__header">
      <!-- Content categorization with semantic hierarchy -->
      <p class="blog-post__category" aria-label="Content category">{{ content.brow }}</p>
      
      <!-- Main heading with proper heading hierarchy -->
      <h1 class="blog-post__title" id="main-title">{{ content.title }}</h1>
      
      <!-- Subtitle with semantic relationship -->
      <p class="blog-post__subtitle" aria-describedby="main-title">{{ content.tagline }}</p>
      
      <!-- Author and publication metadata -->
      <div class="blog-post__meta" role="contentinfo">
        <address class="blog-post__author">
          <span aria-label="Author">By {{ content.author }}</span>
        </address>
        <time class="blog-post__date" :datetime="content.date.toISOString()">
          {{ formatDate(content.date) }}
        </time>
      </div>
    </header>
    
    <!-- Main content with proper content structure -->
    <div class="blog-post__content" v-html="content.content" />
    
    <!-- Related content with semantic navigation -->
    <aside class="blog-post__related" aria-labelledby="related-heading">
      <h2 id="related-heading">Related Content</h2>
      <nav aria-label="Related articles">
        <ul role="list">
          <li v-for="related in content.relationships" :key="related.target_slug">
            <a :href="`/${related.target_type}/${related.target_slug}`" 
               :aria-describedby="`related-${related.target_slug}`">
              {{ getRelatedTitle(related) }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </article>
</template>
```

**Semantic HTML Guidelines:**
- **Document Structure**: `<main>`, `<article>`, `<section>`, `<aside>`, `<nav>`, `<header>`, `<footer>`
- **Content Hierarchy**: Proper heading sequence (h1 → h2 → h3) without skipping levels
- **Lists**: Use `<ul>`, `<ol>`, `<li>` for content collections with `role="list"` when styling removes semantics
- **Forms**: `<fieldset>`, `<legend>`, `<label>` with proper associations (future expansion)
- **Interactive Elements**: `<button>` for actions, `<a>` for navigation with clear distinctions

### ARIA Implementation Guidelines

**Required ARIA Attributes for Content Components:**

```typescript
// ARIA attribute patterns for content components
interface AccessibilityProps {
  // Labeling and description
  'aria-label'?: string;           // Accessible name when text is insufficient
  'aria-labelledby'?: string;      // Reference to labeling element
  'aria-describedby'?: string;     // Reference to description element
  
  // State and properties
  'aria-expanded'?: boolean;       // For collapsible content sections
  'aria-current'?: 'page' | 'step' | 'location'; // For navigation state
  'aria-hidden'?: boolean;         // For decorative elements
  
  // Relationships
  'aria-owns'?: string;            // For content ownership relationships
  'aria-controls'?: string;        // For interactive element control
  
  // Content type identification
  'role'?: string;                 // Semantic role when HTML semantics insufficient
}
```

**ARIA Implementation Examples:**

```vue
<template>
  <!-- Content list with proper ARIA labels -->
  <section class="content-list" aria-labelledby="content-heading">
    <h2 id="content-heading">Latest Research Articles</h2>
    
    <!-- Search and filter controls -->
    <div class="content-filters" role="search" aria-label="Filter articles">
      <input 
        type="search" 
        id="content-search"
        aria-label="Search articles by title or content"
        aria-describedby="search-help"
        v-model="searchTerm" 
      />
      <p id="search-help" class="sr-only">
        Enter keywords to filter articles. Results update automatically.
      </p>
    </div>
    
    <!-- Results with dynamic ARIA labels -->
    <div 
      class="content-results" 
      aria-live="polite" 
      aria-label="Search results"
      :aria-busy="loading.toString()"
    >
      <p class="results-count" aria-live="polite">
        {{ filteredContent.length }} articles found
      </p>
      
      <!-- Content grid with navigation structure -->
      <div class="content-grid" role="grid" aria-label="Article grid">
        <article 
          v-for="(article, index) in filteredContent" 
          :key="article.slug"
          class="content-item"
          role="gridcell"
          :aria-rowindex="Math.floor(index / 3) + 1"
          :aria-colindex="(index % 3) + 1"
        >
          <!-- Content item structure -->
        </article>
      </div>
    </div>
  </section>
</template>
```

### Keyboard Navigation Requirements

**All interactive elements must support keyboard navigation:**

```typescript
// Keyboard navigation composable for content components
export const useKeyboardNavigation = () => {
  /**
   * Handles keyboard navigation for content lists
   * Supports arrow keys, Enter, Space, Home, End navigation
   */
  const handleKeyboardNavigation = (event: KeyboardEvent, context: 'list' | 'grid' | 'menu') => {
    const { key, target } = event;
    const currentElement = target as HTMLElement;
    
    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        moveToNext(currentElement, context);
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        moveToPrevious(currentElement, context);
        break;
        
      case 'ArrowRight':
        if (context === 'grid') {
          event.preventDefault();
          moveToNextColumn(currentElement);
        }
        break;
        
      case 'ArrowLeft':
        if (context === 'grid') {
          event.preventDefault();
          moveToPreviousColumn(currentElement);
        }
        break;
        
      case 'Home':
        event.preventDefault();
        moveToFirst(currentElement, context);
        break;
        
      case 'End':
        event.preventDefault();
        moveToLast(currentElement, context);
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        activateElement(currentElement);
        break;
    }
  };
  
  return { handleKeyboardNavigation };
};
```

**Keyboard Navigation Patterns:**
- **Content Lists**: Arrow keys for navigation, Enter/Space for activation
- **Content Grid**: Arrow keys in all directions, logical tab order
- **Navigation Menu**: Arrow keys, Home/End for first/last items
- **Content Sections**: Tab to focus, Enter to expand/collapse
- **Skip Links**: Skip to main content, skip navigation implemented

### Focus Management Approach

**Focus management for static site with progressive enhancement:**

```vue
<template>
  <div class="content-detail">
    <!-- Skip link for keyboard users -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <!-- Focus management for content sections -->
    <main id="main-content" tabindex="-1" ref="mainContent">
      <article class="content-article">
        <!-- Content with focus restoration -->
        <section 
          v-for="section in contentSections" 
          :key="section.id"
          :class="{ 'is-focused': focusedSection === section.id }"
          @focusin="handleSectionFocus(section.id)"
        >
          <!-- Section content -->
        </section>
      </article>
    </main>
    
    <!-- Focus trap for modal content (if needed) -->
    <div 
      v-if="showModal" 
      class="modal-overlay" 
      @keydown.esc="closeModal"
      ref="modalContainer"
    >
      <!-- Modal content with focus trap -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

/**
 * Focus management for content navigation
 * Ensures keyboard users can navigate content effectively
 */
const mainContent = ref<HTMLElement>();
const modalContainer = ref<HTMLElement>();
const focusedSection = ref<string | null>(null);

/**
 * Sets focus to main content area
 * Used for skip link functionality and page navigation
 */
const focusMainContent = async () => {
  await nextTick();
  mainContent.value?.focus();
};

/**
 * Manages focus when content sections change
 * Announces changes to screen readers
 */
const handleSectionFocus = (sectionId: string) => {
  focusedSection.value = sectionId;
  // Announce section change to screen readers
  announceToScreenReader(`Focused on ${getSectionTitle(sectionId)} section`);
};

/**
 * Announces text to screen readers
 * Uses aria-live region for dynamic content changes
 */
const announceToScreenReader = (text: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = text;
  
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};
</script>
```

### Screen Reader Compatibility

**Screen reader optimization for research content:**

```vue
<template>
  <!-- Enhanced content structure for screen readers -->
  <article class="research-article" role="main">
    <!-- Article metadata optimized for screen readers -->
    <header class="article-header">
      <div class="article-meta" aria-label="Article information">
        <!-- Content type announcement -->
        <span class="sr-only">Article type: {{ content.brow }}</span>
        <p class="article-category" aria-hidden="true">{{ content.brow }}</p>
        
        <!-- Title with proper heading hierarchy -->
        <h1 class="article-title">{{ content.title }}</h1>
        
        <!-- Subtitle with relationship to title -->
        <p class="article-subtitle" role="doc-subtitle">{{ content.tagline }}</p>
        
        <!-- Author and date with structured data -->
        <div class="article-byline">
          <span class="sr-only">Published by</span>
          <address class="article-author">{{ content.author }}</address>
          <span class="sr-only">on</span>
          <time 
            class="article-date" 
            :datetime="content.date.toISOString()"
            :aria-label="formatDateForScreenReader(content.date)"
          >
            {{ formatDate(content.date) }}
          </time>
        </div>
      </div>
    </header>
    
    <!-- Content with enhanced structure -->
    <div class="article-content">
      <!-- Reading time estimate for screen reader users -->
      <div class="reading-info" aria-label="Reading information">
        <p class="sr-only">
          Estimated reading time: {{ estimateReadingTime(content.content) }} minutes
        </p>
      </div>
      
      <!-- Main content with enhanced markup -->
      <div 
        class="content-body" 
        v-html="enhanceContentForAccessibility(content.content)"
      />
    </div>
    
    <!-- Related content with clear relationships -->
    <aside class="related-content" aria-labelledby="related-heading">
      <h2 id="related-heading">Related Research</h2>
      <p class="sr-only">
        The following {{ content.relationships.length }} articles are related to this content:
      </p>
      
      <nav aria-label="Related articles navigation">
        <ul role="list">
          <li v-for="(related, index) in content.relationships" :key="related.target_slug">
            <article class="related-item">
              <h3>
                <a 
                  :href="`/${related.target_type}/${related.target_slug}`"
                  :aria-describedby="`related-desc-${index}`"
                >
                  {{ getRelatedTitle(related) }}
                </a>
              </h3>
              <p :id="`related-desc-${index}`" class="related-reason">
                {{ related.computed_reason }}
              </p>
            </article>
          </li>
        </ul>
      </nav>
    </aside>
  </article>
</template>

<script setup lang="ts">
/**
 * Enhances content HTML for better screen reader experience
 * Adds ARIA labels, reading structure, and navigation aids
 */
const enhanceContentForAccessibility = (htmlContent: string): string => {
  // Add heading navigation structure
  let enhanced = htmlContent.replace(
    /<h([2-6])>(.*?)<\/h[2-6]>/g, 
    '<h$1 role="heading" aria-level="$1">$2</h$1>'
  );
  
  // Enhance lists with proper roles
  enhanced = enhanced.replace(
    /<ul>/g, 
    '<ul role="list">'
  );
  
  // Add alt text suggestions for images without alt
  enhanced = enhanced.replace(
    /<img([^>]*?)src="([^"]*?)"(?![^>]*alt=)/g,
    '<img$1src="$2" alt="Content image - description needed"'
  );
  
  // Add table headers and structure
  enhanced = enhanced.replace(
    /<table>/g,
    '<table role="table" aria-label="Data table">'
  );
  
  return enhanced;
};

/**
 * Formats date specifically for screen reader announcement
 * Provides verbose date format for clarity
 */
const formatDateForScreenReader = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Estimates reading time for screen reader users
 * Helps users understand content length
 */
const estimateReadingTime = (content: string): number => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
</script>

<style scoped>
/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Skip link styling */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .article-title {
    border: 2px solid;
  }
  
  .content-item:focus {
    outline: 3px solid;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
```

## Accessibility Testing

### Accessibility Testing Tools Integration

**Required accessibility testing tools:**

```json
// package.json accessibility testing dependencies
{
  "devDependencies": {
    "@axe-core/playwright": "^4.8.0",
    "axe-core": "^4.7.0",
    "@storybook/addon-a11y": "^7.0.0",
    "pa11y": "^6.2.3",
    "pa11y-ci": "^3.0.1",
    "lighthouse": "^10.0.0"
  }
}
```

**Automated accessibility testing integration:**

```typescript
// tests/accessibility/axe-tests.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage meets WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('blog post page meets accessibility standards', async ({ page }) => {
    await page.goto('/blog/stanford-research-center-400-percent-engagement');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#non-critical-decorative-element')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('content list keyboard navigation', async ({ page }) => {
    await page.goto('/blog');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab'); // Focus first item
    await page.keyboard.press('ArrowDown'); // Navigate to second item
    await page.keyboard.press('Enter'); // Activate item
    
    // Verify navigation worked
    await expect(page).toHaveURL(/\/blog\/.+/);
    
    // Run accessibility check on navigated page
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### Testing Process Integration

**CI/CD Pipeline Integration:**

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build site
        run: npm run generate
      
      - name: Run pa11y accessibility tests
        run: npx pa11y-ci --sitemap http://localhost:3000/sitemap.xml
        
      - name: Run Playwright accessibility tests
        run: npm run test:a11y
        
      - name: Generate accessibility report
        run: npm run lighthouse:a11y
        
      - name: Upload accessibility report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: accessibility-report
          path: |
            accessibility-report/
            lighthouse-report/
```

**Development Workflow Integration:**

```json
// package.json scripts for accessibility testing
{
  "scripts": {
    "test:a11y": "playwright test tests/accessibility/",
    "test:a11y:watch": "playwright test tests/accessibility/ --ui",
    "a11y:audit": "pa11y-ci --sitemap http://localhost:3000/sitemap.xml",
    "a11y:report": "lighthouse --chrome-flags='--headless' --output=html --output-path=./accessibility-report/lighthouse.html http://localhost:3000",
    "dev:a11y": "concurrently 'npm run dev' 'npm run a11y:audit -- --threshold 80'"
  }
}
```

### WCAG 2.1 AA Compliance Targets

**Compliance Requirements:**
- **Level A**: All Level A success criteria must be met
- **Level AA**: All Level AA success criteria must be met (target level)
- **Enhanced**: Selected Level AAA criteria for research content

**Specific WCAG 2.1 AA Requirements:**
1. **Perceivable**:
   - Text alternatives for images
   - Captions for videos (if implemented)
   - Color contrast ratio minimum 4.5:1 for normal text, 3:1 for large text
   - Text can be resized up to 200% without loss of functionality

2. **Operable**:
   - All functionality available via keyboard
   - No content flashes more than 3 times per second
   - Users can navigate and find content
   - Help users avoid and correct mistakes

3. **Understandable**:
   - Text is readable and understandable
   - Content appears and operates predictably
   - Users are helped to avoid and correct input errors

4. **Robust**:
   - Content can be interpreted by assistive technologies
   - Compatible with current and future assistive tools

### Manual Testing Procedures

**Screen Reader Testing Protocol:**

```markdown
# Screen Reader Testing Checklist

# NVDA/JAWS Testing (Windows)
1. **Navigation Testing**:
   - [ ] Skip links work correctly
   - [ ] Heading navigation (H key) provides logical structure
   - [ ] Landmark navigation (D key) identifies main regions
   - [ ] List navigation (L key) identifies content lists
   - [ ] Link navigation (TAB) reads link purpose clearly

2. **Content Testing**:
   - [ ] Article metadata announced correctly
   - [ ] Reading order is logical and complete
   - [ ] Related content relationships announced
   - [ ] Search functionality accessible and announced
   - [ ] Dynamic content changes announced

# VoiceOver Testing (macOS)
1. **Rotor Navigation**:
   - [ ] Headings rotor provides content outline
   - [ ] Landmarks rotor identifies page regions
   - [ ] Links rotor shows link purposes
   - [ ] Form controls properly labeled (future)

2. **Content Structure**:
   - [ ] Content type announced (article, navigation, etc.)
   - [ ] Author and date information accessible
   - [ ] Content relationships explained
   - [ ] Search results properly announced

# Mobile Screen Reader Testing
1. **iOS VoiceOver**:
   - [ ] Swipe navigation works through content
   - [ ] Content structure announced properly
   - [ ] Touch exploration provides accurate information

2. **Android TalkBack**:
   - [ ] Linear navigation through content
   - [ ] Proper announcement of content elements
   - [ ] Gesture navigation functional
```

**Keyboard Navigation Testing Protocol:**

```markdown
# Keyboard Navigation Testing Checklist

# Tab Navigation
- [ ] Tab order is logical and predictable
- [ ] All interactive elements reachable via keyboard
- [ ] Focus indicators clearly visible
- [ ] Skip links allow bypassing navigation

# Arrow Key Navigation
- [ ] Content lists navigable with arrow keys
- [ ] Grid layouts support 2D navigation
- [ ] Menu systems support arrow key navigation

# Keyboard Shortcuts
- [ ] Standard shortcuts work (Ctrl+F for search)
- [ ] Custom shortcuts documented and functional
- [ ] No keyboard traps prevent navigation

# Focus Management
- [ ] Focus moves logically through content
- [ ] Focus restored when returning to sections
- [ ] Modal dialogs trap focus appropriately (if implemented)
- [ ] Dynamic content updates preserve focus context
```

### Automated Testing Approach

**Build Pipeline Integration:**

```typescript
// nuxt.config.ts - accessibility testing integration
export default defineNuxtConfig({
  // ... existing config
  
  // Development mode accessibility checks
  hooks: {
    'build:before': () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Accessibility checks enabled for development build');
      }
    },
    
    'generate:page': (page) => {
      if (process.env.A11Y_AUDIT === 'true') {
        // Queue page for accessibility audit
        queueAccessibilityAudit(page.route);
      }
    }
  }
});
```

**Continuous Accessibility Monitoring:**

```javascript
// accessibility/monitor.js - Continuous accessibility monitoring
const { execSync } = require('child_process');
const pa11y = require('pa11y');

/**
 * Monitors accessibility during development
 * Runs accessibility checks on content changes
 */
const monitorAccessibility = async () => {
  const urls = [
    'http://localhost:3000',
    'http://localhost:3000/blog',
    'http://localhost:3000/case-studies'
  ];
  
  for (const url of urls) {
    try {
      const results = await pa11y(url, {
        standard: 'WCAG2AA',
        reporter: 'json',
        includeNotices: true,
        includeWarnings: true
      });
      
      if (results.issues.length > 0) {
        console.warn(`⚠️  Accessibility issues found for ${url}:`);
        results.issues.forEach(issue => {
          console.warn(`  ${issue.type}: ${issue.message}`);
        });
      } else {
        console.log(`✅ No accessibility issues found for ${url}`);
      }
    } catch (error) {
      console.error(`❌ Accessibility test failed for ${url}:`, error.message);
    }
  }
};

module.exports = { monitorAccessibility };
```

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>