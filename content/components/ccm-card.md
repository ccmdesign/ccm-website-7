---
title: "ccm-card"
tagline: "Versatile linking card component with responsive layout and image support"
category: "Content"
props:
  - name: "to"
    type: "String"
    required: true
    description: "Link destination (Nuxt router path)"
  - name: "title"
    type: "String"
    required: true
    description: "Card title for accessibility (used in aria-label)"
  - name: "image"
    type: "String"
    required: false
    description: "Optional image URL"
  - name: "size"
    type: "String"
    default: "l"
    description: "Controls padding using design tokens (xs, s, m, l, xl, 2xl, 3xl)"
  - name: "backgroundColor"
    type: "String"
    default: "color-primary-tint-20"
    description: "CSS custom property name for background color"
slots:
  - name: "default"
    description: "Main card content area"
  - name: "image"
    description: "Custom image content (overrides default image display)"
examples:
  - title: "Text-only Card"
    code: |
      <ccm-card to="/about" title="About Us">
        <h3>About Our Company</h3>
        <p>Learn more about our mission and values.</p>
      </ccm-card>
  - title: "Card with Image"
    code: |
      <ccm-card 
        to="/services" 
        title="Our Services"
        image="/images/services-hero.jpg"
      >
        <h3>What We Do</h3>
        <p>Discover our comprehensive service offerings.</p>
      </ccm-card>
  - title: "Custom Styling"
    code: |
      <ccm-card 
        to="/contact" 
        title="Contact Us"
        size="xl"
        background-color="color-secondary-tint-20"
      >
        <h3>Get In Touch</h3>
        <p>Ready to start your project? Let's talk.</p>
      </ccm-card>
  - title: "Custom Image Slot"
    code: |
      <ccm-card to="/portfolio" title="Portfolio">
        <template #image>
          <div class="custom-image-area">
            <icon name="portfolio" size="large" />
          </div>
        </template>
        <h3>Our Work</h3>
        <p>Explore our latest projects and case studies.</p>
      </ccm-card>
---

The `ccm-card` component is a flexible linking component that adapts its layout based on screen size. It's built on top of `nuxt-link` for optimal routing performance and supports both image and text-only configurations.

## Responsive Behavior

The card automatically adapts its layout for different screen sizes:

- **Mobile (< 768px)**: Stacked layout with image on top, text below
- **Desktop (≥ 768px)**: Side-by-side layout with alternating image positions

### Desktop Layout Pattern

On desktop screens, cards automatically alternate their layout:
- **Odd cards**: Image left, text right
- **Even cards**: Image right, text left (with right-aligned text)

## Image Handling

When no image is provided, the component displays a colored background area maintaining the same aspect ratios:
- **Mobile**: 16:9 aspect ratio
- **Desktop**: 1:1 aspect ratio

## Accessibility Features

- Uses semantic `nuxt-link` for proper navigation
- Includes `aria-label` with the provided title
- Maintains proper heading hierarchy within card content
- Keyboard navigation support through native link behavior

## Design System Integration

- **Spacing**: Uses design token system for consistent padding
- **Colors**: Integrates with CSS custom property color tokens
- **Typography**: Inherits text styling from parent contexts
- **Layout**: Responsive grid-friendly sizing