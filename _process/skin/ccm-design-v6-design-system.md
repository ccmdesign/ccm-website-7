# CCM Design v6.1 Design System Documentation

This document captures the visual design system from the ccm-design-v6.1 implementation to guide the migration to the Nuxt-based website.

## 1. Color System

### Base Colors
- **White**: `hsla(0, 0%, 100%, 1)`
- **Black**: `hsla(0, 0%, 5%, 1)` (Note: Not pure black, 5% lightness)
- **Red**: `hsla(347, 58%, 46%, 1)` (Used for error/fail states)
- **Green**: `hsla(174, 62%, 47%, 1)` (Used for success states)
- **Yellow**: `hsla(37, 98%, 53%, 1)` (Used for warning states)

### Theme Colors
- **Primary**: `hsla(217, 81%, 10%, 1)` (Deep navy blue)
- **Secondary**: `hsla(182, 43%, 76%, 1)` (Light teal)
- **Accent**: `hsla(54, 100%, 47%, 1)` (Bright yellow)
- **Base**: `hsla(217, 81%, 10%, 1)` (Same as primary, used for text)

### Color Usage Pattern
The system uses HSL values stored as CSS custom properties with separate hue/saturation/lightness values for flexibility. All colors support opacity adjustments through the alpha channel.

## 2. Typography System

### Font Families
- **Display Font**: "Sentinel SSm A", "Sentinel SSm B", serif
- **Body Font**: urw-din, sans-serif

### Type Scale
The typography system uses a responsive base font size with fluid scaling:
- **Base Size**: `clamp(1rem, 0.3vw + 0.9rem, 1.5rem)`
- **Line Height**: Based on the modular scale ratio (1.62)

### Heading Hierarchy
- **H1**: 300% (3x base size), line-height: 130%
- **H2**: 250% (2.5x base size), line-height: 130%
- **H3**: 200% (2x base size), line-height: 140%
- **H4**: 160% (1.6x base size), line-height: 150%
- **H5**: 120% (1.2x base size), line-height: 150%
- **H6**: 100% (1x base size), line-height: ratio-based

### Typography Features
- Lining numerals enabled by default
- Display font (Sentinel) used for all headings
- Body font (URW DIN) used for all other text

## 3. Spacing System

### Modular Scale
The spacing system uses a **golden ratio-based scale (1.62)** with the following values:
- **--s-5**: calc(--s0 / 1.62^5)
- **--s-4**: calc(--s0 / 1.62^4)
- **--s-3**: calc(--s0 / 1.62^3)
- **--s-2**: calc(--s0 / 1.62^2)
- **--s-1**: calc(--s0 / 1.62)
- **--s0**: 1rem (base unit)
- **--s1**: calc(--s0 × 1.62)
- **--s2**: calc(--s1 × 1.62)
- **--s3**: calc(--s2 × 1.62)
- **--s4**: calc(--s3 × 1.62)
- **--s5**: calc(--s4 × 1.62)

### Default Spacing Values
- **Base Gap**: var(--s1)
- **Base Padding**: var(--s1)

## 4. Layout System

### Container Widths
- **Wrapper**: 1280px (main content container)
- **Narrow**: 700px (narrow content container)
- **Measure**: 80ch (ideal reading width)

### Site Structure
- Uses flexbox-based layout with `min-height: 100vh`
- Main content area uses `flex: 1` to fill available space
- Flexible column-based structure

## 5. Visual Properties

### Borders
- **Base Border Width**: 2px
- **Base Border**: 2px solid (uses base color)
- **Base Border Radius**: 4px

### Shadows
- **Base Shadow**: `2px 2px 8px hsla(217, 81%, 10%, 0.15)`
  - Uses primary/base color at 15% opacity
  - Subtle drop shadow for depth

### Form Styling
- **Form Color**: Uses primary color
- **Form Text**: Uses base color
- **Form Font Weight**: 400
- **Form Border Width**: Inherits base border width (2px)

### Z-Index Layers
- **Menu Layer**: 100
- **Modal Layer**: 1000

### Links
- **Default Link Color**: Accent color (bright yellow)
- **Link Decoration**: None by default, underline on hover
- **Link applies to**: Links without explicit classes

### Text Highlighting
- **Mark/Highlight**: Accent color at 16% opacity
- **Padding**: 2px horizontal padding with negative margins

## 6. Component Architecture

The old system follows an atomic design pattern with numbered folders:
- **0-resets**: Normalizations and base resets
- **1-tokens**: Design tokens (colors, scale, skin, wrappers)
- **2-elements**: Basic HTML elements styling
- **3-objects**: Layout primitives (center, grid, stack, etc.)
- **4-components**: UI components (buttons, inputs)
- **5-modules**: Complex components (cards, forms, navigation)
- **6-sections**: Page sections (footer, hero, byline)
- **7-snowflakes**: Unique/one-off components

## 7. Component Patterns

### Button System
The button component uses a flexible CSS variable-based theming system:

#### Button Structure
- Base padding: `calc(var(--s-1) + 4px) var(--s0)`
- Uses transparent backgrounds with border styling by default
- Hover states use semi-transparent overlays

#### Button Modifiers
**Hierarchy:**
- `.button--primary`: Solid background, no borders
- `.button--secondary`: Transparent with borders
- `.button--unstyled`: No borders or background

**Colors:** Can be combined with color classes:
- `.button--primary-color`, `.button--secondary-color`, `.button--accent-color`
- `.button--success`, `.button--cancel`, `.button--warning`

**Sizes:**
- Small: `--s-2` vertical, `--s-1` horizontal padding, 75% font size
- Default: `calc(--s-1 + 4px)` vertical, `--s0` horizontal padding
- Large: `--s0` vertical, `--s1` horizontal padding, 120% font size

### Card System
- Uses CSS Grid with `auto-fill` and minimum card width of 15rem
- Cards have flex column layout with auto-spacing for last child
- Grid gap uses the `--grid-gap` variable
- Includes focus states for accessibility

## 8. Layout Patterns

### Grid Object
Simple auto-responsive grid using CSS Grid:
```css
display: grid;
grid-gap: var(--base-gap, 1rem);
grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
```

### Stack Pattern
Vertical spacing utility using flexbox:
- Default spacing: `--s1`
- Applies margin only between elements (using `* + *` selector)
- Customizable via `--space` CSS variable

### Base Section
Standard page section with:
- Vertical padding: `--s3` (top and bottom)
- Color theming via CSS variables
- Responsive heading sizes
- Pre-defined color schemes:
  - `data-color="base-faded"`: 5% opacity base color background
  - `data-color="accent-faded"`: 10% opacity accent color background

### Focus States
- Uses `--focus-effect` variable for consistent focus styling
- Cards have complex focus-within states for keyboard navigation

## 9. Utility Classes

The system includes comprehensive utility classes following a consistent naming pattern:

### Spacing Utilities
**Margin and Padding:** Available for all scale values (s-5 through s5)
- Pattern: `.margin-{direction}\:{scale}` and `.padding-{direction}\:{scale}`
- Directions: `top`, `bottom`, `left`, `right`
- Example: `.margin-top\:s2`, `.padding-left\:s-1`

### Width Utilities
- `.max-width\:measure` - Max width of 80ch
- `.max-width\:measure\/2` - Max width of 40ch
- `.width\:full` - 100% width
- `.width\:half` - 50% width
- `.width\:quarter` - 25% width
- `.width\:third` - 33.33% width

### Typography Utilities
- **Font Size**: `.font-size\:s-1` through `.font-size\:s5`
- **Font Weight**: `.font-weight\:300`, `.font-weight\:400`, `.font-weight\:700`
- **Font Style**: `.font-style\:italic`
- **Text Align**: `.text-align\:center`, `.text-align\:left`, `.text-align\:right`

### Visibility Utilities
- `.hide-in-mobile` - Hidden on screens < 40em
- `.hide-in-large` - Hidden on screens ≥ 40em
- `.sr-only` - Screen reader only (visually hidden)

### Accessibility
- Skip link styling with focus states
- Disabled link styling with `a[data-disabled]`

## 10. Motion System

The design includes a sophisticated motion system using CSS custom properties:

### Motion API
```css
--diff: calc(var(--start) - var(--value));
--speed: 1;
--direction: -1;
--origin: right;
--ratio: 0.1;
--base-motion: calc(var(--diff) * var(--speed) * var(--direction) * 0.005vw);
--base-scale: calc(var(--diff) * var(--ratio));
```

### Motion Types
- **Translate X**: `data-motion="translate-x"`
- **Scale X**: `data-motion="scale-x"`
- **Custom animations**: Various `ccm-bar` and `ccm-outline` animations

### Animation Properties
- Smooth scroll behavior by default
- Linear transitions (0.2s duration)
- Transform origin control via `--origin` variable
- Speed and direction multipliers for fine control

## Migration Notes

### Key Differences to Consider
1. The old system uses SCSS with heavy use of CSS custom properties
2. Typography is percentage-based relative to a fluid base size
3. Spacing uses a mathematical scale based on the golden ratio
4. Colors are defined in HSL format for easier manipulation
5. The component organization follows atomic design principles
6. Components use data attributes for variants (e.g., `data-color`)
7. Heavy use of CSS custom properties for component theming

### Recommended Migration Strategy
1. Convert SCSS variables to CSS custom properties in Nuxt
2. Maintain the modular scale system for consistent spacing
3. Preserve the HSL color format for flexibility
4. Keep the atomic design structure in component organization
5. Ensure responsive typography using clamp() functions
6. Implement the same CSS variable-based theming approach for components
7. Use similar layout patterns (Grid, Stack) as composable utilities
