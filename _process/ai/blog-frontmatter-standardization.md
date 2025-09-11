# Blog Post Frontmatter Standardization Instructions

## Overview
This document provides instructions for Claude Code agents to standardize frontmatter across all blog posts in the `/content/blog` directory to maintain consistency with the 2025 post structure.

## Standard Frontmatter Structure

Based on analysis of 2025 blog posts, the standard frontmatter structure is:

```yaml
---
brow: "Category/Section Name"
title: "Main Article Title"
tagline: "Compelling subtitle that explains the value proposition"
date: "YYYY-MM-DD"
author: "CCM Design Team"
categories: ["Category 1", "Category 2"]
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
seo_tags: ["seo-keyword1", "seo-keyword2", "seo-keyword3", "seo-keyword4", "seo-keyword5", "seo-keyword6", "seo-keyword7", "seo-keyword8", "seo-keyword9", "seo-keyword10"]
excerpt: "Compelling 2-3 sentence summary that includes key metrics and value proposition. Should be 150-250 characters for optimal SEO."
published: true
---
```

## Field Definitions

### Required Fields
- **brow**: Short category identifier (e.g., "Design Strategy", "Research Communication")
- **title**: Main article title (should be compelling and descriptive)
- **tagline**: Subtitle that expands on the title with value proposition
- **date**: Publication date in YYYY-MM-DD format
- **author**: Always "CCM Design Team" for consistency
- **categories**: Array of 1-2 categories from the standardized list
- **tags**: Array of 3-5 descriptive tags for content categorization
- **seo_tags**: Array of 8-10 SEO-optimized keywords/phrases
- **excerpt**: 150-250 character summary with key metrics/value proposition
- **published**: Boolean, always `true` for live posts

### Optional Fields
- **meta**: Additional metadata (can be empty string "")

## Standardized Categories

Use these 4 categories consistently:

1. **Design & Digital Strategy**
   - Design systems, UX, web development
   - Developer-designer collaboration
   - Digital transformation and modern web architecture
   - Accessibility and mobile-first approaches

2. **Research & Academic Communication**
   - Visual storytelling and research presentation
   - Adapting research for wider audiences
   - Academic writing and report design
   - Research promotion and stakeholder engagement

3. **Nonprofit & Foundation Strategy**
   - Fundraising and donor engagement
   - Digital marketing (Google Ad Grants, SEO)
   - Editorial design for publications
   - Organizational growth and sustainability

4. **Content Strategy & Workflow**
   - Content creation and optimization techniques
   - Workflow efficiency and approval processes
   - Remote work and project management
   - Modular content and long-form strategies

## Task Instructions for Claude Agents

### Step 1: Identify Posts Without Proper Frontmatter
- Search for `.md` files in `/content/blog` that don't have YAML frontmatter
- Posts from 2022-2024 typically lack proper frontmatter structure

### Step 2: Extract Existing Information
For each post without proper frontmatter:
1. Extract the title (usually first heading or filename)
2. Extract the date (from filename or content)
3. Read the content to understand the topic and theme
4. Identify the most appropriate category(ies) from the standardized list

### Step 3: Generate Missing Fields
- **brow**: Create based on the primary category
- **title**: Use existing title or create compelling version
- **tagline**: Create value-focused subtitle based on content
- **categories**: Assign 1-2 categories from standardized list
- **tags**: Generate 3-5 relevant tags based on content themes
- **seo_tags**: Create 8-10 SEO-optimized keywords
- **excerpt**: Write compelling 150-250 character summary with metrics if applicable

### Step 4: Content Categorization Guidelines

**Design & Digital Strategy**: Look for posts about design systems, UX, web development, accessibility, developer collaboration

**Research & Academic Communication**: Look for posts about research presentation, academic writing, visual storytelling, stakeholder engagement

**Nonprofit & Foundation Strategy**: Look for posts about fundraising, Google Ad Grants, nonprofit publications, donor engagement

**Content Strategy & Workflow**: Look for posts about content creation, SEO, workflow optimization, remote work, project management

### Step 5: Quality Checks
- Ensure date format is YYYY-MM-DD
- Verify categories exist in standardized list
- Check excerpt length (150-250 characters)
- Ensure tags are relevant and specific
- Verify published is set to `true`

### Step 6: Implementation
- Use MultiEdit tool to add frontmatter to beginning of each file
- Preserve all existing content below the frontmatter
- Test that frontmatter is valid YAML

## Example Transformation

### Before (2022-2024 posts):
```markdown
# Design Systems 101

Published: October 1, 2022

Design systems are becoming increasingly important...
```

### After (Standardized):
```yaml
---
brow: "Design Strategy"
title: "Design Systems 101: Building Scalable Design Foundations"
tagline: "Master the fundamentals of design systems for consistent, efficient product development"
date: "2022-10-01"
author: "CCM Design Team"
categories: ["Design & Digital Strategy"]
tags: ["design systems", "scalability", "product development", "design consistency"]
seo_tags: ["design systems guide", "scalable design", "design system fundamentals", "product design consistency", "design system benefits", "design tokens", "component libraries", "design system implementation"]
excerpt: "Learn how design systems create consistency and efficiency in product development, reducing design debt by up to 40% while accelerating team velocity."
published: true
---

# Design Systems 101: Building Scalable Design Foundations

Design systems are becoming increasingly important...
```

## Notes for Claude Agents
- Always preserve original content - only add/modify frontmatter
- Use existing titles when possible, enhance if needed
- Focus on value propositions in taglines and excerpts
- Include metrics in excerpts when possible (even estimated)
- Maintain consistency with CCM brand voice (professional, results-focused)
- Double-check YAML syntax before saving