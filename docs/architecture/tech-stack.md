# Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Frontend Language** | TypeScript | ^5.0.0 | Type-safe development across Vue components and composables | Existing project uses TS, essential for content pipeline type safety |
| **Frontend Framework** | Nuxt 3 | ^3.16.2 | Vue-based SSG framework with content processing | Already implemented, provides SSG capabilities needed for content piping |
| **UI Component Library** | Native Vue + CSS Layers | N/A | Custom components with existing ccm design system | Preserve existing CSS layer architecture and ccm component patterns |
| **State Management** | Vue Composition API | ^3.5.13 | Component state with composables for content processing | Lightweight approach suitable for static generation, existing pattern |
| **Backend Language** | TypeScript | ^5.0.0 | Build-time content processing and type definitions | Shared types between content pipeline and components |
| **Backend Framework** | Nuxt Content | ^3.5.1 | File-based CMS with markdown processing | Existing implementation, perfect for content piping requirements |
| **API Style** | Build-time Composables | N/A | Content queries during generation, no runtime APIs | Static generation eliminates need for runtime API layer |
| **Database** | File-based Markdown | N/A | Content stored as markdown with YAML frontmatter | Existing content structure with rich metadata (15+ fields) |
| **Cache** | Static Files + CDN | N/A | Generated HTML cached at edge locations | Static generation provides perfect caching by default |
| **File Storage** | Git Repository | N/A | Content versioning and editorial workflow | Existing approach, enables Git-based content management |
| **Authentication** | Not Required | N/A | Static site with no user accounts | Content publishing through Git, no user management needed |
| **Frontend Testing** | Vitest + Vue Test Utils | Latest | Unit testing for components and composables | Vue 3 ecosystem standard, integrated with Nuxt 3 |
| **Backend Testing** | Vitest | Latest | Testing content processing logic | Same tool for consistency, suitable for build-time logic testing |
| **E2E Testing** | Playwright | Latest | Full-site testing including content generation | Modern E2E tool with static site support |
| **Build Tool** | Vite | Latest | Development server and build optimization | Integrated with Nuxt 3, existing configuration |
| **Bundler** | Vite/Rollup | Latest | Production bundling and optimization | Nuxt 3 default, optimized for static generation |
| **IaC Tool** | Not Required | N/A | Static hosting via Netlify dashboard configuration | Simple static hosting, no infrastructure complexity |
| **CI/CD** | Netlify Build | N/A | Automated builds on Git commits with content processing | Integrated with hosting, optimized for static sites |
| **Monitoring** | Netlify Analytics | N/A | Traffic and performance monitoring | Built-in monitoring for static sites |
| **Logging** | Netlify Functions Logs | N/A | Build-time logging for content processing | Build process monitoring and debugging |
| **CSS Framework** | Custom CSS Layers | Existing | reset → defaults → utils → overrides methodology | Preserve existing sophisticated CSS architecture |
