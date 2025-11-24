# CCM Website v7

This is the 7th iteration of the CCM Website, a modern web application built with the Nuxt.js 3 framework.

This document serves as a comprehensive guide for developers and contributors, outlining the project's architecture, conventions, and development processes.

## Table of Contents

- [Project Overview](#project-overview)
- [Guiding Principles](#guiding-principles)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Architectural Deep Dive](#architectural-deep-dive)
  - [Component-Based Architecture](#component-based-architecture)
  - [Working with Nuxt Content](#working-with-nuxt-content)
  - [CSS Architecture](#css-architecture)
- [Linting and Formatting](#linting-and-formatting)
- [Further Assistance](#further-assistance)

## Project Overview

`ccm-website-7` is a web application developed using Nuxt.js 3. It leverages the power of Vue.js for building user interfaces, with server-side rendering (SSR) capabilities provided by Nuxt for enhanced performance and SEO.

## Guiding Principles

*   **Component-Based**: We build with small, reusable, and auto-imported Vue components.
*   **Content-Driven**: Content is managed in Markdown files within the `content/` directory.
*   **Utility-First CSS**: Styling is handled via a custom CSS framework using layers for a clean and scalable system.

## Technology Stack

*   **Framework**: Nuxt.js 3
*   **UI Library**: Vue.js 3
*   **Build Tool**: Vite (default for Nuxt 3)
*   **Package Manager**: npm
*   **Content**: Nuxt Content (Markdown-based)
*   **Deployment Target**: Netlify (inferred from dependencies)

## Project Structure

The project follows the standard Nuxt.js 3 directory structure. Here are some of the key directories:

```
ccm-website-7/
├── .nuxt/            # Build directory (auto-generated)
├── .output/          # Production build output
├── assets/           # Un-compiled assets like styles or images
├── components/       # Reusable Vue components
├── layouts/          # Application layouts
├── middleware/       # Route middleware
├── node_modules/     # Project dependencies
├── pages/            # Application pages and routes
├── plugins/          # Nuxt plugins
├── public/           # Static assets served at the root
├── server/           # Server-side API routes and middleware (Nitro)
├── _process/         # Project process documentation (e.g., for AI collaboration)
├── nuxt.config.ts    # Nuxt configuration file
├── package.json      # Project dependencies and scripts
└── README.md         # This file
```

## Prerequisites

Ensure you have the following installed on your local development machine:

*   Node.js (LTS version recommended, check `.nvmrc` if available)
*   npm (comes with Node.js)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ccm-website-7
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Development

To start the development server with hot-reloading, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

To build the application for production, which includes server-side rendering and static site generation as configured:

```bash
npm run build
```

This command creates the `.output` directory with the production-ready application.

To preview the production build locally:
```bash
npm run preview
```

## Deployment

This project appears to be configured for deployment on Netlify. Pushing to the main branch of the connected GitHub repository should trigger an automatic build and deployment.

## Architectural Deep Dive

This section provides a more detailed look into the project's architecture and conventions.

### Component-Based Architecture

We follow a strict component-based approach. All components are located in the `~/components` directory and are globally auto-imported by Nuxt.

#### Naming Conventions

*   **File Names**: Components should be named in `camelCase` with a `ccm` prefix (e.g., `ccmButton.vue`, `ccmHero.vue`).
*   **Usage in Templates**: When using components in templates, they should be in `PascalCase` (e.g., `<CcmButton />`, `<CcmHero />`).

#### Component Structure

Components should use the Vue 3 Composition API with `<script setup lang="ts">`.

```vue
<!-- ~/components/ccmMyComponent.vue -->
<script setup lang="ts">
// Props, emits, and logic go here
defineProps({
  title: {
    type: String,
    required: true,
  }
});
</script>

<template>
  <div class="my-component">
    <h1>{{ title }}</h1>
  </div>
</template>

<style scoped>
/* Scoped styles for the component */
.my-component {
  /* ... */
}
</style>
```

#### Extending Base Components

To extend a base component (e.g., `ccmBaseSection`), you can wrap it in a new, more specific component. This promotes reusability and keeps the system consistent.

### Working with Nuxt Content

The site uses Nuxt Content as a file-based CMS. All content is stored in Markdown (`.md`) files within the `~/content` directory.

*   **Routing**: Markdown files automatically create routes based on their file path. For example, `content/services/design-subscription.md` becomes available at the `/services/design-subscription` URL.
*   **Frontmatter**: Each file uses YAML frontmatter to define metadata for the page (e.g., `title`, `tagline`, `slug`). This data is accessible within your Vue components.
*   **Rendering Content**: To render the body of the Markdown file within a page or layout, use the `<ContentDoc />` component provided by Nuxt Content.

### CSS Architecture

The project uses a custom CSS architecture organized with `@layer`. This provides a clear structure for styles and ensures predictability. The main stylesheet is `public/css/styles.css`.

The layers are defined in the following order:

1.  `reset`: Resets default browser styling.
2.  `defaults`: Base styles for HTML elements, typography, and layout systems.
3.  `utils`: Utility classes for common styling needs like colors and spacing.
4.  `overrides`: High-specificity styles used to override defaults or utilities in specific cases.

#### Extending Styles

When you need to add or modify styles, first check if a utility class in `utils/` can accomplish the task. If not, add styles to the appropriate layer in the modular CSS files located under `/public/css/`. For component-specific styles, always use `<style scoped>` within the `.vue` file itself.

## Linting and Formatting

To ensure code quality and consistency, it's recommended to use tools like ESLint and Prettier. If configured, you can run them with:

```bash
# (Example commands, update if different)
npm run lint
npm run format
```

## Further Assistance

For more information on Nuxt.js, refer to the Nuxt 3 documentation.