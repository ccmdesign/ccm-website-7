---
title: "Design System Overview"
tagline: "Programmatic approach to consistent, scalable component design"
category: "Foundation"
order: 1
examples:
  - title: "Programmatic Pattern"
    code: |
      <!-- Template -->
      <component 
        :style="{
          '--_component-padding': `var(--space-${size})`,
          '--_component-bg': `var(--${backgroundColor})`
        }"
      >

      <!-- CSS -->
      <style>
      .component {
        --_component-padding: var(--space-l); /* fallback */
        --_component-bg: transparent; /* fallback */
        
        padding: var(--_component-padding);
        background: var(--_component-bg);
      }
      </style>
  - title: "Size Prop Implementation"
    code: |
      const props = defineProps({
        size: {
          type: String,
          default: 'l',
          validator: (value) => ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl'].includes(value)
        }
      })
---

## Core Principles

Our design system follows a **programmatic approach** where component props dynamically set CSS custom properties, enabling flexible theming and consistent spacing without relying on CSS attribute selectors.

### Key Benefits

1. **Runtime Flexibility**: Props can accept any valid design token value
2. **Performance**: No CSS specificity battles or attribute selector overhead  
3. **Maintainability**: Single source of truth for design token values
4. **Scalability**: Easy to extend with new size or color variants

## Design Token System

### Spacing Scale
The system uses a consistent spacing scale accessible via CSS custom properties:

- `--space-xs` - Extra small spacing
- `--space-s` - Small spacing  
- `--space-m` - Medium spacing
- `--space-l` - Large spacing (default for most components)
- `--space-xl` - Extra large spacing
- `--space-2xl` - 2x large spacing
- `--space-3xl` - 3x large spacing

### Color Tokens
Colors follow a systematic naming convention:

- `--color-primary` - Primary brand color
- `--color-primary-tint-20` - 20% tint of primary
- `--color-primary-tint-95` - 95% tint of primary (very light)
- `--color-secondary` - Secondary color
- `--color-neutral-tint-95` - Light neutral background

## Implementation Pattern

All components follow this consistent pattern:

1. **Props Definition**: Accept `size` and `backgroundColor` props with sensible defaults
2. **Style Binding**: Use `:style` to set CSS custom properties dynamically  
3. **CSS Variables**: Define fallback values and consume the dynamic properties
4. **Validation**: Ensure prop values match available design tokens

## Component Categories

### Layout Components
- **ccm-section**: Foundational spacing and background wrapper
- **ccm-hero**: Header component with flexible content areas

### Content Components  
- **ccm-card**: Responsive linking cards with image support
- **ccm-button**: Interactive elements with consistent styling

### Utility Components
- **ccm-topbar**: Navigation and header utilities

## Responsive Strategy

Components use CSS Grid, Flexbox, and media queries for responsive behavior rather than breakpoint-specific classes. This approach provides more predictable layouts and better performance.

## Future Considerations

This programmatic approach enables future enhancements like:
- Theme switching capabilities
- User preference customization
- Dynamic design token loading
- Component variant systems