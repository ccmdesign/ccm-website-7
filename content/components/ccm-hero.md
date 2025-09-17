---
title: "ccm-hero"
tagline: "Flexible hero component with topbar integration and responsive layout"
category: "Layout"
props:
  - name: "brow"
    type: "String"
    default: "Brow"
    description: "Small text above the main title"
  - name: "title"
    type: "String" 
    default: "Hero"
    description: "Main heading text"
  - name: "tagline"
    type: "String"
    default: "Tagline"
    description: "Subtitle or descriptive text"
  - name: "size"
    type: "String"
    default: "l"
    description: "Controls padding using design tokens (xs, s, m, l, xl, 2xl, 3xl)"
  - name: "backgroundColor"
    type: "String"
    default: "transparent"
    description: "CSS custom property name for background color"
  - name: "variant"
    type: "String"
    default: "default"
    description: "Layout variant ('default' has 16/7 aspect ratio, 'minimal' removes aspect ratio)"
  - name: "hideTop"
    type: "Boolean"
    default: false
    description: "Hide the top topbar section"
  - name: "hideBottom"
    type: "Boolean"
    default: true
    description: "Hide the bottom footer section"
slots:
  - name: "default"
    description: "Main hero content (replaces default hgroup if provided)"
  - name: "footer"
    description: "Bottom section content"
examples:
  - title: "Default Hero"
    code: |
      <ccm-hero 
        brow="Welcome"
        title="Component Library" 
        tagline="Building consistent, scalable interfaces"
      />
  - title: "Minimal Variant"
    code: |
      <ccm-hero 
        variant="minimal"
        size="m"
        background-color="color-primary-tint-95"
        title="Compact Hero"
        tagline="No aspect ratio constraints"
      />
  - title: "Custom Content"
    code: |
      <ccm-hero>
        <div class="custom-hero-content">
          <h1>Custom Layout</h1>
          <p>Use the default slot for complete control over hero content.</p>
          <button>Call to Action</button>
        </div>
      </ccm-hero>
---

The `ccm-hero` component provides a flexible header solution with integrated topbar, responsive layout, and customizable content areas. It's designed to work as a standalone header or as part of a larger page layout system.

## Layout Structure

The hero component uses a flexbox layout with three main sections:

1. **Top**: Contains the `ccm-topbar` component (can be hidden)
2. **Main**: Primary content area with automatic centering
3. **Bottom**: Footer section for additional content (hidden by default)

## Responsive Behavior

- **Default variant**: Maintains a 16/7 aspect ratio for consistent proportions
- **Minimal variant**: Removes aspect ratio constraints for content-driven sizing
- All content areas use the `center` utility class for responsive width constraints

## Integration Features

- **Topbar Integration**: Automatically includes `ccm-topbar` unless hidden
- **Page Meta**: Works with Nuxt's `definePageMeta` for consistent hero data
- **Programmatic Styling**: Dynamic CSS custom properties for size and background color

## Advanced Usage

The component supports both default content (brow, title, tagline) and custom content via slots. For complex layouts, use the default slot to provide complete control over the hero content structure.