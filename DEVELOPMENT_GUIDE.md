# CCM Website 7 Development Guide

This guide provides a comprehensive overview of the development standards, architecture, and workflows for the CCM Website 7 project. It is designed to help developers maintain consistency and leverage the existing systems effectively.

## 1. Technology Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Language**: TypeScript
- **UI Library**: Vue 3 (Composition API)
- **Styling**: Native CSS with [CSS Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) and Design Tokens
- **Content**: [@nuxt/content](https://content.nuxt.com/) (v3)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Testing**: [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing)

## 2. Project Structure

The project follows a standard Nuxt 3 structure with specific conventions for components and styling.

```
├── components/          # Vue components organized by Atomic Design
│   ├── atoms/           # Basic building blocks (Buttons, Inputs)
│   ├── molecules/       # Groups of atoms (Cards, List items)
│   ├── organisms/       # Complex sections (Header, Footer)
│   └── snowflakes/      # One-off unique components
├── content/             # Markdown content for the site
├── layouts/             # Page layouts (default.vue)
├── pages/               # Application routes
├── public/
│   └── css/             # CSS Architecture (Tokens, Layers, Utils)
├── utils/               # Helper functions
├── content.config.ts    # Content collection definitions
└── nuxt.config.ts       # Main configuration
```

## 3. Component Standards

### Naming Convention
All components must use **PascalCase** and be prefixed with `ccm`.
- **Correct**: `ccmButton.vue`, `ccmHero.vue`
- **Incorrect**: `Button.vue`, `ccm-button.vue`

### Atomic Design
Components should be placed in the appropriate subdirectory within `components/`:
- **Atoms**: Indivisible components (e.g., `ccmButton`, `ccmIcon`).
- **Molecules**: Simple groups of UI elements (e.g., `ccmCard`, `ccmInputGroup`).
- **Organisms**: Complex UI sections (e.g., `ccmNavbar`, `ccmFooter`).
- **Snowflakes**: Unique, non-reusable components specific to a context.

### Component Anatomy
Components should use `<script setup>` and define props clearly. Styles should rely on CSS variables for customization.

**Example Pattern (`ccmButton.vue`):**

```vue
<template>
  <component :is="tag" class="ccm-component" :class="modifiers">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'm' }
})

// Logic to determine tag (button vs a vs NuxtLink)
const tag = computed(() => ...)
</script>

<style>
/* Use CSS Variables for theming */
.ccm-component {
  --_local-color: var(--color-primary);
  padding: var(--space-m);
}
</style>
```

## 4. Styling Architecture

The project uses **CSS Layers** to manage specificity and cascade. The entry point is `public/css/styles.css`.

### Layer Order
1. `reset`: Browser resets.
2. `defaults`: Base element styles.
3. `tokens`: Design tokens (colors, spacing).
4. `themes`: Theme-specific overrides.
5. `components`: Component-specific styles.
6. `utils`: Utility classes.
7. `overrides`: Final overrides (dev styles).

### Design Tokens
Always use defined tokens instead of hardcoded values.
- **Colors**: `var(--color-primary)`, `var(--color-base)`, `var(--color-text)`
- **Spacing**: `var(--space-xs)`, `var(--space-m)`, `var(--space-xl)`
- **Typography**: `var(--font-family-base)`, `var(--font-size-m)`

### Component Styling
- Avoid `scoped` styles if you want to allow easy theming via CSS variables from parent components.
- Define "private" variables (e.g., `--_button-bg`) that map to global tokens.
- Use `data-attributes` for variants (e.g., `data-variant="primary"`).

## 5. Content Management

Content is managed via Markdown files in the `content/` directory.

### Collections
Collections are defined in `content.config.ts` using Zod schemas.
- **Blog**: `content/blog/*.md`
- **Case Studies**: `content/case-studies/*.md`
- **Services**: `content/services/*.md`

### Adding New Content
1. Create a markdown file in the appropriate directory.
2. Ensure Frontmatter matches the Zod schema defined in `content.config.ts`.

```yaml
---
title: My New Post
published: true
date: 2023-10-27
---
```

## 6. Development Workflow

### Creating a New Component
1. **Identify Type**: Is it an atom, molecule, or organism?
2. **Create File**: `components/<type>/ccm<Name>.vue`.
3. **Implement**:
    - Define props for content and configuration.
    - Use semantic HTML.
    - Apply styles using CSS variables.
4. **Register**: Components are auto-imported, so no manual registration is needed.

### Adding a Page
1. Create a `.vue` file in `pages/`.
2. Use `ccm` components to build the UI.
3. Fetch content using `useAsyncData` and `queryCollection` if needed.

### Testing
- Run tests with `npm run test`.
- Write tests in `tests/` directory.

## 7. Key Commands

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run generate`: Generate static site.
- `npm run preview`: Preview production build.
