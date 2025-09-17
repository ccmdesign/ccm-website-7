---
title: "ccm-section"
tagline: "Foundational layout component with consistent spacing and theming"
category: "Layout"
props:
  - name: "size"
    type: "String"
    default: "l"
    description: "Controls padding using design tokens (xs, s, m, l, xl, 2xl, 3xl)"
  - name: "backgroundColor"
    type: "String"
    default: "transparent"
    description: "CSS custom property name for background color"
  - name: "fullWidth"
    type: "Boolean"
    default: false
    description: "Controls container centering behavior"
slots:
  - name: "default"
    description: "Main content area"
examples:
  - title: "Basic Usage"
    code: |
      <ccm-section>
        <h2>Section Content</h2>
        <p>This is the default section styling.</p>
      </ccm-section>
  - title: "With Background and Size"
    code: |
      <ccm-section size="xl" background-color="color-primary-tint-20">
        <h2>Large Section with Background</h2>
        <p>This section has extra padding and a colored background.</p>
      </ccm-section>
  - title: "Full Width"
    code: |
      <ccm-section full-width>
        <div class="custom-layout">
          <p>This section doesn't apply centering constraints.</p>
        </div>
      </ccm-section>
---

The `ccm-section` component is the foundational layout building block that provides consistent vertical spacing and optional background styling. It follows the programmatic CSS custom property pattern for flexible theming.

## Implementation Details

The component uses the `:style` binding to dynamically set CSS custom properties:

```vue
:style="{
  '--_ccm-section-background-color': `var(--${backgroundColor})`,
  '--_ccm-section-padding-block': `var(--space-${size})`
}"
```

This approach eliminates the need for CSS attribute selectors while maintaining full flexibility over spacing and theming.

## Design System Integration

- **Spacing**: Integrates with the design token system using `--space-*` custom properties
- **Colors**: References color tokens via CSS custom properties (e.g., `color-primary-tint-20`)
- **Layout**: Provides optional centering via the `center` utility class

## Best Practices

- Use as the primary wrapper for page content sections
- Combine different sizes to create visual hierarchy
- Leverage background colors sparingly for emphasis
- Consider full-width usage for custom layouts that need to break out of the container