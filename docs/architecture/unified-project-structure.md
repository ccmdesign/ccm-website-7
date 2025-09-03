# Unified Project Structure

Monorepo structure accommodating content processing, static generation, and existing ccm component architecture:

```plaintext
ccm-website/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── build-deploy.yml    # Netlify build integration
│       └── content-preview.yml # PR preview builds
├── components/                 # ccm Component Library
│   ├── ccmContentMeta.vue      # Metadata display component
│   ├── ccmContentList.vue      # Content listing with relationships
│   ├── ccmContentDetail.vue    # Full content presentation
│   ├── ccmRelatedPosts.vue     # Related content recommendations
│   ├── ccmBlogIndex.vue        # Blog listing page component
│   ├── ccmCaseStudyIndex.vue   # Case study portfolio component
│   ├── ccmMasterGrid.vue       # Existing responsive grid system
│   ├── ccmTopbar.vue           # Enhanced navigation with content
│   ├── ccmHero.vue             # Existing hero component
│   ├── ccmFooter.vue           # Enhanced footer with content stats
│   ├── ccmBaseSection.vue      # Existing section wrapper
│   ├── ccmButton.vue           # Existing button component
│   └── ccmByLine.vue           # Existing byline component
├── composables/                # Content Processing Logic
│   ├── useContentPipeline.ts   # Main content processing composable
│   ├── useContentRelationships.ts # Relationship computation logic
│   ├── useStaticRoutes.ts      # Route generation for static content
│   ├── useContentMetadata.ts   # Build-time metadata processing
│   └── useContentTransforms.ts # Markdown to TypeScript transformations
├── content/                    # Nuxt Content Files
│   ├── index.md                # Homepage content
│   ├── about.md                # About page content
│   ├── blog/                   # Blog posts with rich frontmatter
│   │   ├── 2025-08-27-stanford-research-center-400-percent-engagement.md
│   │   ├── 2025-08-27-modular-content-blueprint.md
│   │   ├── 2025-08-27-interactive-stakeholder-dashboards.md
│   │   ├── 2025-08-27-executive-approval-accelerator.md
│   │   └── 2025-01-27-mobile-first-research-reports.md
│   └── case-studies/           # Case study portfolio pieces
│       ├── bfna-federalism-in-crisis.md
│       ├── bfna-how-to-fix-democracy.md
│       ├── bfna-people-led-innovation.md
│       ├── govlab-institutional-website.md
│       ├── harvard-tech-spotlight.md
│       └── 360giving-design-system.md
├── layouts/                    # Page Layout Templates
│   └── default.vue             # Enhanced with content integration
├── pages/                      # Static Route Definitions
│   ├── index.vue               # Homepage with content highlights
│   ├── about.vue               # About page
│   ├── blog/                   # Blog section pages
│   │   ├── index.vue           # Blog listing page
│   │   └── [...slug].vue       # Dynamic blog post pages
│   └── case-studies/           # Portfolio section pages
│       ├── index.vue           # Case study listing page
│       └── [...slug].vue       # Dynamic case study pages
├── public/                     # Static Assets
│   ├── css/                    # CSS Layer Architecture (preserved)
│   │   ├── base/               # Reset, fonts, typography, layout
│   │   ├── vars/               # CSS custom properties
│   │   ├── utils/              # Utility classes
│   │   └── styles.css          # Main CSS entry point
│   ├── images/                 # Image assets for content
│   └── favicon.ico             # Site favicon
├── types/                      # TypeScript Definitions
│   ├── content.ts              # BlogPost, CaseStudy, ContentRelationship
│   ├── pipeline.ts             # Content processing interfaces
│   └── components.ts           # Component prop definitions
├── utils/                      # Utility Functions
│   ├── content-transforms.ts   # Content processing utilities
│   ├── relationship-scoring.ts # Relationship algorithms
│   └── seo-optimization.ts     # SEO metadata generation
├── tests/                      # Test Suites
│   ├── components/             # Component unit tests
│   ├── composables/            # Content processing logic tests
│   ├── e2e/                    # Full-site integration tests
│   └── fixtures/               # Test content and data
├── docs/                       # Project Documentation
│   ├── prd.md                  # Product requirements document
│   ├── architecture.md         # This fullstack architecture document
│   ├── implementation-plan.md  # Development planning document
│   └── README.md               # Project setup and development guide
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore patterns
├── eslint.config.mjs           # ESLint configuration (existing)
├── nuxt.config.ts              # Nuxt configuration with SSG settings
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Main project documentation
```
