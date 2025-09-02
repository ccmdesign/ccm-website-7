# Project Brief: CCM Website Component Development

## Executive Summary

The CCM website is a Nuxt 3 project with Vue 3 composition API that requires a comprehensive component architecture to display content across multiple content types (blog posts, case studies, general pages). The project currently has basic components and Nuxt Content integration but needs a complete data-driven component system to dynamically render content without requiring CSS development.

**Primary Problem Being Solved:** The website needs robust Vue components and data handling to present content from multiple sources (blog posts, case studies, pages) in a structured, maintainable way while separating content logic from styling concerns.

**Target Market:** Internal development team building a professional services website showcasing work and thought leadership.

**Key Value Proposition:** A complete component architecture that handles all data presentation needs, allowing CSS styling to be applied independently later.

### Detailed Project Context

**Current State Analysis:**
- **Existing Infrastructure:** Nuxt 3 with client-side rendering (SSR disabled), Vue 3 composition API, Nuxt Content for file-based CMS
- **Content Structure:** 
  - Blog posts (5 substantial articles with rich frontmatter: dates, authors, engagement metrics)
  - Case studies (6 detailed project showcases with consistent metadata structure)
  - Static pages (about, contact, what-we-do, index)
- **Component Foundation:** 11 base components including ccmMasterGrid (12-column responsive grid), ccmHero, ccmPostHero, ccmTopbar, ccmFooter, and specialized content components
- **Technical Stack:** Vue 3, Pinia for state management, integrated media players (Vimeo, YouTube), axios for API calls

**Specific Development Scope:**
- **Data Layer:** Complete composables and utilities for content fetching, filtering, and transformation from Nuxt Content
- **Component Expansion:** Build missing components for content display, navigation, media handling, and interactive elements
- **Page Templates:** Dynamic page generation for blog indices, case study galleries, search/filtering interfaces
- **Content Rendering:** Standard markdown processing with existing ContentRenderer, with custom component enhancements deferred to later phases
- **Responsive Data Handling:** Ensure all components adapt to different data states (loading, error, empty, populated)

## ⚠️ CRITICAL SCOPE LIMITATION: NO CSS IMPLEMENTATION

**HTML + JavaScript ONLY Development:**
This project focuses exclusively on functional component development without any visual styling. All components will provide semantic HTML structure and Vue.js functionality while preserving existing CSS classes. The website will appear "naked" without styling - this is intentional and correct.

**Components Include:**
✅ Vue 3 Composition API logic and functionality  
✅ Semantic HTML5 structure and accessibility  
✅ Data handling, state management, and interactivity  
✅ Nuxt Content integration and content processing  
✅ PX methodology logic (primary actions, flow control)  
✅ Component APIs, props, and event handling  

**Components DO NOT Include:**  
❌ CSS styles, classes, or visual presentation  
❌ Layout styling, positioning, or responsive design  
❌ Color schemes, typography, or visual hierarchy  
❌ Animation, transitions, or visual effects  
❌ New CSS classes (preserve existing ones only)  

**Existing CSS Preservation:**
- Maintain all existing CSS classes currently in the codebase
- Preserve class structure: `component-name | utility-classes | prose`
- Do not add new styling classes - only functional classes for JavaScript

**Business Impact:** This foundation enables rapid content publishing, professional presentation of work portfolios, and scalable content management without ongoing developer intervention for content updates. The client-project relationship architecture transforms the website into a comprehensive business development platform where prospects can explore work by client industry, project type, or specific expertise areas, while existing clients can easily access their complete project portfolio and related thought leadership content.

**PX Methodology Integration:** All components must support CCM's Prospect Experience (PX) methodology, which differs fundamentally from traditional UX. While UX helps users accomplish their own goals, PX guides specific prospects through specific actions YOU define, creating predictable prospect behavior that moves them through the buyer journey: Researcher → Evaluator → Buyer. Every component must support the critical page flow: Home → Capabilities → Services → Case Studies, with single primary actions guiding prospects toward business conversations.

## Problem Statement

### Current State and Pain Points

**Incomplete Content Presentation System:**
The current implementation has a foundation but lacks the comprehensive component ecosystem needed to present rich content effectively. While Nuxt Content provides the data layer, there's a significant gap between raw content and polished presentation:

- **Missing Content Components:** No dedicated components for rendering blog post lists, case study galleries, content filtering, or advanced markdown elements
- **Inadequate Data Flow:** Limited composables and utilities for content transformation, pagination, search, and state management  
- **Static Page Templates:** Current pages (blog/[...slug].vue, case-studies/[...slug].vue) are basic and don't leverage the rich metadata available in content files
- **No Interactive Elements:** Missing components for content discovery, related articles, author profiles, tag systems, or engagement features

**Specific Content Richness Being Underutilized:**

*Blog Content Complexity:*
- **Rich Frontmatter:** Posts contain 15+ metadata fields including brow, tagline, author, categories, tags, seo_tags, date, excerpt
- **Advanced Markdown Structures:** Custom prose-section and prose-hgroup components exist but are cosmetic enhancements for later implementation
- **SEO and Categorization:** Extensive tagging systems (categories: ["Research Communication", "Digital Strategy"]) aren't being leveraged for navigation or discovery
- **Professional Presentation:** Content like "Interactive Stakeholder Dashboards" contains detailed metrics (78% meeting attendance, 15% survey improvements) that need special formatting

*Case Study Portfolio Depth:*
- **Project Showcase Format:** Structured presentation with client, challenge, solution, impact sections
- **Measurable Outcomes:** Quantified results ("Team independently built 2 new products after handover")  
- **Visual Content Integration:** References to images and interactive elements not currently supported
- **Professional Services Positioning:** Content demonstrates expertise through detailed methodology explanations

**Current Template Limitations Exposed:**

*Basic Content Rendering:*
```vue
<ContentRenderer v-if="post" :value="post" class="post-main-content | prose" />
```
This simple renderer doesn't:
- Enhance metadata presentation beyond basic ccmPostHero
- Support content relationship mapping (related posts, similar case studies)
- Provide interactive elements for complex content structures
- Enable content discovery through tags, categories, or author filtering

*Missing Index Pages:*
- No blog index with filtering, search, or categorization
- No case study gallery with project type filtering or client industry sorting
- No author profile pages linking related content
- No tag-based content discovery system

**Impact of the Problem:**

- **Content Publishing Friction:** Each new content type or presentation style requires custom development work
- **Inconsistent User Experience:** Without standardized components, content presentation varies unpredictably across the site
- **Maintenance Burden:** Manual template updates needed for each content addition or layout change
- **Scalability Limitations:** Current architecture can't easily adapt to new content types, metadata fields, or presentation requirements

**Why Existing Solutions Fall Short:**

- **Generic CMS Solutions:** Don't provide the customization needed for a professional services showcase
- **Template-based Approaches:** Too rigid for the diverse content types (technical case studies, thought leadership blogs, project portfolios)
- **Component Libraries:** Don't address content-specific needs like frontmatter rendering, markdown enhancement, or content relationship mapping

**Urgency and Importance:**

This system needs to be built now because:
- Content creation is accelerating (5 blog posts and 6 case studies already in pipeline)
- Professional presentation is critical for business development and thought leadership positioning  
- CSS development timeline is separate and shouldn't block content presentation capabilities
- Foundation must be solid before scaling content operations

## Proposed Solution

### Core Concept and Approach

**Comprehensive Content Component Ecosystem:**
Build a complete Vue component architecture that transforms raw Nuxt Content into polished, interactive presentations while maintaining strict separation between content logic and visual styling. The solution creates a self-service content publishing system where authors can leverage rich metadata and advanced formatting without requiring developer intervention for each publication.

**Design System Architecture with Atomic Design Methodology:**

**1. Data Layer (Composables & Utilities)**
- Content fetching composables with built-in filtering, sorting, and pagination
- Metadata transformation utilities for consistent data structures across components  
- Search and discovery functions leveraging tags, categories, and full-text indexing
- Related content algorithms connecting posts, case studies, authors, clients, and projects
- Client-project relationship mapping with many-to-many association handling
- Cross-referencing utilities linking case studies to projects to clients
- Portfolio aggregation composables for client-specific content collection
- Project timeline and status tracking across multiple content types

**2. Component Layer (Atomic Design System)**

*Atoms (Foundational Elements):*
- `ccmTag` - Individual tag display with consistent styling hooks
- `ccmDate` - Formatted date display with multiple format options
- `ccmAuthor` - Author name with optional linking capability
- `ccmMetric` - Quantified outcome display (e.g., "78% meeting attendance")
- `ccmExcerpt` - Content preview with truncation and expansion
- `ccmContentType` - Content type indicator (blog, case-study, etc.)
- `ccmClient` - Client name with optional logo and linking capability
- `ccmProject` - Project title with status and timeline indicators

*Note: Custom markdown components (prose-section, prose-hgroup, callouts, etc.) are cosmetic enhancements that will be implemented in a later phase, separate from the core content architecture.*

**PX Methodology Requirements:**

*Critical PX Components (Atoms/Molecules):*
- `ccmPrimaryAction` - Single, clear primary action component for every page/section
- `ccmSecondaryActions` - 1-3 alternative actions for prospects not ready to proceed  
- `ccmProgressiveEngagement` - Components supporting buyer journey progression
- `ccmProspectFlow` - Navigation components supporting Home → Capabilities → Services → Case Studies flow
- `ccmOrientationPattern` - Components for visitors who enter site elsewhere to navigate to Home
- `ccmBuyerFriendlyCTA` - "Let's Talk" / "Request Meeting" style actions for ready prospects

*Page-Specific PX Organisms:*
- `ccmHomePageHero` - "What You Do" positioning statement with primary action to Capabilities
- `ccmCapabilitiesList` - Scannable service list with click-through to Service pages
- `ccmServiceProblemSolution` - Problem/method/success measurement presentation (~250 words)
- `ccmCaseStudyImpact` - Problem → Solution → Results narrative (~500 words, scanner-friendly)
- `ccmContentHub` - Three-column layout: filters (left), content list (center), CTAs (right)
- `ccmArticleRelated` - 3-5 related articles affirming positioning and encouraging engagement

*PX Templates Implementing 7 Critical Pages:*
- `ccmHomePage` - Priority order: What You Do → What You've Done → Client Testimonials → Latest Content
- `ccmCapabilitiesPage` - Mission/approach → testimonial → scannable services → buyer CTA
- `ccmServicePage` - Service description → testimonial → related case studies → buyer CTA  
- `ccmCaseStudyPage` - Impact story → testimonial → related services (NOT case studies) → buyer CTA
- `ccmContentHubPage` - Dogmatic three-column "information desk" layout
- `ccmArticlePage` - Content → related articles → researcher/evaluator CTAs
- `ccmGatedContentPage` - Lead capture mechanism for high-value content

*Molecules (Functional Components):*
- `ccmTagList` - Collection of ccmTag atoms with interaction logic
- `ccmMetadata` - Author + date + category molecule for content attribution
- `ccmContentCard` - Title + excerpt + metadata + tags for list displays
- `ccmMetricsList` - Multiple ccmMetric atoms for outcomes presentation
- `ccmRelatedLink` - Internal content linking with type indication
- `ccmContentFilter` - Interactive filtering controls combining multiple atoms
- `ccmClientInfo` - Client name + logo + relationship indicator molecule
- `ccmProjectSummary` - Project + client + key metrics summary molecule
- `ccmProjectList` - Multiple ccmProject atoms for client portfolio display
- `ccmClientRelationships` - Multi-client molecule for complex project structures

*Organisms (Content Sections):*
- `ccmContentGrid` - Responsive grid of ccmContentCard molecules with filtering
- `ccmContentHero` - Enhanced hero sections combining metadata, title, and context
- `ccmRelatedContent` - Section displaying related articles using ccmContentCard molecules
- `ccmAuthorProfile` - Author bio + content list using existing molecules
- `ccmTagCloud` - Interactive tag exploration using ccmTag atoms with weighting
- `ccmContentNavigation` - Category and tag-based navigation systems
- `ccmClientPortfolio` - Client showcase with all associated projects and case studies
- `ccmProjectShowcase` - Multi-project display with client relationship mapping
- `ccmCaseStudyGrid` - Specialized grid for case studies with project-client filtering
- `ccmClientDirectory` - Comprehensive client listing with project counts and relationships
- `ccmProjectTimeline` - Chronological project display with client attribution

*Templates (Page Layouts):*
- `ccmBlogIndex` - Blog listing page combining ccmContentGrid + ccmContentFilter
- `ccmCaseStudyGallery` - Case study showcase with project-client filtering capabilities
- `ccmContentDetail` - Single content page with ccmRelatedContent integration
- `ccmAuthorIndex` - Author profile pages with content aggregation
- `ccmTagLanding` - Tag-specific content discovery pages
- `ccmClientProfile` - Individual client pages with complete project portfolio
- `ccmClientDirectory` - Master client listing with search and filtering
- `ccmProjectIndex` - Project-focused listing with client relationship display
- `ccmWorkShowcase` - Combined case studies, projects, and client relationship hub

**3. Page Template Layer (Route Handlers)**
- Dynamic content indexes: blog, case studies, insights with advanced filtering
- Enhanced single-content pages with intelligent related content suggestions
- Client relationship pages: individual client profiles with complete project portfolios
- Project-focused displays: cross-client project listings and timelines
- Multi-dimensional discovery: content by author, tag, client, project, or content type
- Unified work showcase: integrated case study, client, and project navigation hub

### Key Differentiators from Existing Solutions

**Atomic Design System Foundation:**
Unlike ad-hoc component development, this solution builds a systematic design system using atomic design methodology. Each component has a clear role and consistent interface, enabling predictable composition and effortless scaling. The atomic approach ensures components can be recombined in infinite ways without breaking consistency or requiring custom development for new content presentations.

**Content-First Atomic Components:**
Every atom, molecule, and organism is designed specifically for content presentation needs. Rather than adapting generic UI components, each element understands frontmatter structures (ccmTag knows about SEO implications, ccmMetric handles quantified outcomes formatting), markdown enhancement requirements, and content relationship mapping. This content-specific design eliminates adaptation friction and ensures professional presentation standards.

**PX-Driven Component Design:**
Unlike traditional component libraries focused on user convenience, every component is designed to support CCM's Prospect Experience methodology. Components prioritize single primary actions, progressive engagement, and purposeful prospect flow over generic usability. This approach creates predictable prospect behavior that advances business objectives rather than simply accommodating user preferences.

**Strategic Differentiation from Traditional CMS Approaches:**
This component system fundamentally differs from typical content management solutions:

*Traditional CMS Approach:*
- Maximizes user choice and navigation options
- Provides comprehensive content discovery tools  
- Optimizes for content consumption and exploration
- Success measured by time-on-site and page views

*CCM's PX-Driven Approach:*
- Deliberately constrains choices to guide prospect behavior
- Limits navigation to purposeful positioning flow
- Optimizes for lead generation and business conversations
- Success measured by prospect progression and qualified inquiries

This philosophical difference impacts every component decision: rather than building tools that help users find what they want, components guide prospects toward what CCM needs them to do to become qualified business opportunities.

**Scalable Component Composition:**
The atomic design approach creates unlimited presentation possibilities through systematic composition. Need a new content type? Combine existing atoms and molecules. Want different metadata layouts? Rearrange molecules within organisms. Require specialized landing pages? Compose organisms into new templates. This compositional flexibility prevents custom development for evolving content strategy.

**Metadata-Driven Intelligence:**
The system leverages your rich metadata (15+ fields per post) through specialized atomic components that create intelligent content connections, automated tagging systems, and enhanced SEO presentation. Rather than treating metadata as simple display values, atoms like ccmTag and ccmMetric use metadata for content discovery, relationship mapping, and dynamic presentation enhancement.

**Professional Services Optimization:**  
Components specifically handle the presentation needs of professional services content: ccmMetric atoms for quantified outcomes display, specialized molecules for structured case study formats, organisms optimized for thought leadership positioning, and templates designed for client work showcasing. This specialization ensures content serves business development objectives effectively.

### High-Level Vision for the Product

**Self-Service Content Publishing Platform:**
Authors create markdown files with rich frontmatter and immediately gain access to professional presentation capabilities: automatic related content suggestions, enhanced metadata display, interactive content discovery, and consistent professional formatting across all content types.

**Scalable Content Operations:**
New content types, metadata fields, or presentation requirements integrate seamlessly without custom development. The component architecture adapts to evolving content strategy while maintaining consistent user experience and professional presentation standards.

**Business Development Enablement:**
Every piece of content becomes a business development asset through enhanced presentation, discoverability, and professional positioning. Case studies showcase expertise effectively, blog posts establish thought leadership, and the overall content experience reinforces professional credibility.

### Why This Solution Will Succeed

**Built for Your Specific Content Structure:**
Unlike generic solutions, this architecture is designed around your actual content patterns, metadata richness, and professional services positioning. Components handle your specific needs (prose-sections, quantified outcomes, client showcases) without requiring adaptation or compromise.

**Separation of Concerns Maintained:**
The solution respects your CSS development timeline by handling all content logic, data flow, and structural presentation while leaving visual styling completely independent. This allows parallel development streams and prevents blocking dependencies.

**Foundation for Scale:**
Rather than solving immediate presentation needs, the architecture creates infrastructure for long-term content operations growth. New authors, content types, or presentation requirements integrate without disrupting existing functionality or requiring architectural changes.

### PX Implementation Strategy

**Single Primary Action Architecture:**
Every component, organism, and template enforces the PX principle that each page has exactly one primary action. Components include built-in logic to suppress competing actions and guide attention to the designated primary objective. This systematic approach ensures that prospect attention is channeled purposefully rather than dispersed across multiple options.

**Progressive Engagement System:**
Components implement graduated engagement levels matching prospect readiness:
- **Researcher Stage:** Content consumption actions (read article, download resource, subscribe)
- **Evaluator Stage:** Positioning exploration actions (view capabilities, explore services, read case studies)  
- **Buyer Stage:** Direct engagement actions (schedule consultation, request proposal, contact directly)

**Purposeful User Flow Enforcement:**
The component architecture enforces CCM's critical page progression through systematic navigation logic:
1. **Home Page** → Primary action to **Capabilities Page**
2. **Capabilities Page** → Primary action to specific **Service Pages**  
3. **Service Page** → Primary action to relevant **Case Studies**
4. **Case Study Page** → Primary action to **Business Conversation** (buyer-friendly CTA)

This flow is hard-coded into component relationships, ensuring prospects follow the intended journey regardless of entry point.

**Content Hub as Information Desk:**
The blog/content system implements the "information desk" philosophy rather than "content library" approach:
- **Three-Column Dogmatic Layout:** Tools (left), content list (center), CTAs (right)
- **Single-Column Content List:** Reverse-chronological, no grid layouts (reduces cognitive load)
- **Strategic CTA Placement:** Right sidebar (horizontal browsers) + inline (vertical scrollers)
- **Related Content Strategy:** Links to services, not just more content, preventing "content cul-de-sacs"

**Client-Project Showcase Strategy:**
Case study presentation prioritizes business development over portfolio browsing:
- **Impact-Focused Narratives:** Problem → Solution → Results format (~500 words)
- **Scanner-Friendly Design:** Specific headlines, standalone stats, visual pull quotes
- **Service Connection:** Case studies link to related services (not other case studies) to move prospects toward business conversations
- **Solution-Focused Titles:** "Social Media Strategy for Non-Profits" not "Our Work for UNICEF"

**Technical Implementation Requirements:**
- **Route-Level Primary Actions:** Every page route enforces single primary action through component props
- **Engagement State Tracking:** Components track and respond to prospect engagement level
- **Flow Analytics:** Built-in measurement of prospect progression through positioning flow
- **CTA Optimization:** A/B testing capabilities for primary actions while maintaining single-action principle

## Target Users

### Primary User Segment: CCM Development Team (Internal)

**Demographic/Firmographic Profile:**
- Internal CCM development team building a digital platform for mission-driven organizations
- Technical proficiency with Vue 3, Nuxt, and modern web development practices
- Responsible for creating a professional services website that serves research institutions, non-profits, think tanks, academic centers, and policy groups
- Working within strategic design consultancy specializing in translating complex ideas into clear, effective digital experiences

**Current Behaviors and Workflows:**
- Implementing CCM's PX (Prospect Experience) methodology through purposeful content presentation
- Creating content that follows "Novel, Specific, Profound" quality standards
- Managing complex client-project relationships across interface design & development, publication services, and branding projects
- Balancing rapid development with CCM's voice & tone standards ("Confident, Clear-Sighted Guide")
- Building components that support CCM's buyer journey stages (Researcher → Evaluator → Buyer)

**Specific Needs and Pain Points:**
- **Mission-Driven Presentation:** Need components that reflect CCM's purpose-driven approach and social impact focus
- **Professional Authority:** Require systematic way to present CCM's expertise for impact-driven researchers, high-stakes communicators, and lead-driven marketers
- **Client Relationship Complexity:** Need to showcase projects for research institutions, non-profits, think tanks without losing individual client identity
- **Content Strategy Alignment:** Components must support "Problem → Solution → Results" structure and reference/credibility standards
- **Scalable Professional Standards:** Need atomic design system that maintains CCM's consultative tone and empathetic expertise positioning

**Goals They're Trying to Achieve:**
- **Strategic Business Development:** Present CCM's work to attract ideal prospects (research institutions, policy groups, academic centers)
- **Thought Leadership Platform:** Enable content that establishes CCM as the "seasoned guide" for complex digital challenges
- **Client Credibility Showcase:** Display comprehensive project portfolios that demonstrate CCM's impact on social change and knowledge advancement
- **Prospect Experience Optimization:** Create purposeful content flow that guides prospects through defined actions toward business conversations

### Secondary User Segment: CCM's Target Prospects (External)

**Demographic/Firmographic Profile:**
Based on CCM's documented audience personas:

- **Impact-Driven Researchers:** Leaders at university research centers, non-profits, think tanks, foundations focused on translating research into actionable insights
- **High-Stakes Communicators:** Directors of Corporate Communications, Investor Relations managers needing flawless execution and bulletproof recommendations  
- **Lead-Driven Marketers:** Directors of Content Marketing, Product Marketing Managers (B2B Tech) focused on lead generation and thought leadership
- **Creative Partners:** Creative Directors, Art Directors, Principals at agencies seeking flawless creative execution

**Current Behaviors and Workflows:**
- **Researcher Stage:** Consuming expert content to understand complex problems, seeking "Novel, Specific, Profound" insights
- **Evaluator Stage:** Understanding problems, evaluating solutions and providers, comparing expertise and approach
- **Buyer Stage:** Ready for business conversation, looking for proof of impact and contact opportunities
- Struggling with data visualization, static formats, brand inconsistency, resource scarcity (Impact-Driven Researchers)
- Managing delegation weight, finding true expertise, tight processes (High-Stakes Communicators)

**Specific Needs and Pain Points:**
- **Credible Expertise Validation:** Need to assess CCM's depth in "building resilient, flexible platforms that adapt to future needs"
- **Social Impact Evidence:** Want to see how CCM's work advances knowledge and drives social change
- **Process Transparency:** Need clear understanding of CCM's "Foundation → Framework → Fulfillment → Finish & Follow-through" methodology
- **Mission Alignment:** Require evidence that CCM understands their world of groundbreaking research, policy work, and social goals

**Goals They're Trying to Achieve:**
- **Digital Platform Transformation:** Move from clunky, outdated websites to platforms that reflect work quality and engage stakeholders
- **Mission Advancement:** Find strategic partners who can build digital experiences that serve their social impact objectives
- **Stakeholder Engagement:** Create central hubs for global networks, flexible platforms for new initiatives
- **Professional Presentation:** Ensure digital presence communicates value with clarity and authority their work deserves