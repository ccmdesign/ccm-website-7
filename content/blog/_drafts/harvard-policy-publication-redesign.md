---
title: How We Rebuilt Harvard’s Policy Publication Ecosystem
slug: harvard-policy-publication-redesign
excerpt: >-
  See how CCM Design transformed legacy print models into scalable digital
  policy platforms for Harvard Kennedy School and the Shorenstein Center.
meta_title: How We Rebuilt Harvard’s Policy Publication Ecosystem
meta_description: >-
  See how CCM Design transformed legacy print models into scalable digital
  policy platforms for Harvard Kennedy School and the Shorenstein Center.
stage: evaluator
category: publications
keywords:
  - digital policy publication
  - higher education web design
  - data visualization case study
  - research dissemination strategy
primary_keyword: digital policy publication
author: CCM Design
status: ready
related_posts:
  - slug: designing-scalable-system-idrc
    title: A Strategic Design System Roadmap for the IDRC
  - slug: strategic-publication-design-methodology
    title: 'De-Risking Publication Design: A 9-Step Strategic Methodology'
  - slug: publication-design-vs-marketing-design
    title: 'Publication Design vs. Marketing Design: The Hidden Differences'
  - slug: evaluate-research-publication-design-partners
    title: How to Evaluate Design Partners for Research Publications
  - slug: design-resourcing-agency-vs-inhouse
    title: 'Agency vs. In-House Design: A Strategic Resourcing Guide'
date: 2025-04-22
---
## TL;DR

- **Context:** The COVID-19 pandemic forced a rapid pivot from physical events and static PDFs to digital-first ecosystems for Harvard's Belfer and Shorenstein Centers.
- **Strategy:** We shifted the engagement from "event branding" to "product design," treating policy research as a dynamic digital product rather than a static document.
- **Architecture:** The solution involved building a "Central Hub" for complex data and a modular "Casebook" system for scalable award portfolios.
- **Outcome:** The platforms enabled the Tech Spotlight to proceed virtually with Ash Carter and helped the Indie Film Landscape project reach industry stakeholders with critical market data.

When the mechanism for delivering high-stakes policy research breaks down, the research itself risks irrelevance. For decades, academic institutions relied on a dissemination model built around physical symposia, printed casebooks, and static PDFs. These formats signal authority, but they often fail on accessibility and resilience.

We encountered this friction directly when partnering with Harvard University on two critical initiatives: the **Tech Spotlight Award** at the Harvard Kennedy School’s Belfer Center, and the **Indie Film Landscape** project at the Shorenstein Center. Both projects faced a crisis of continuity. The Tech Spotlight was originally conceived as an in-person ceremony, a plan rendered impossible by the onset of the COVID-19 pandemic [1]. Meanwhile, the Indie Film Landscape project possessed data so complex that a standard academic report would likely bury the lede [2].

This case study outlines how we rebuilt these legacy publication models into resilient digital ecosystems. We moved beyond simple digitization—scanning a paper document into a PDF—and instead architected platforms that treat policy research as a scalable, interactive product.

## The Challenge: When Legacy Models Meet Crisis

Academic policy publishing often operates on a "publish and store" model. Research is conducted, compiled into a document, printed or uploaded as a static file, and then archived. While this serves the historical record, it struggles to engage active stakeholders—policymakers, technologists, and industry leaders—who need navigable, actionable insights.

For Harvard, this structural limitation collided with immediate external pressures.

### The Event Constraint
The Tech Spotlight Award, an initiative under the Technology and Public Purpose (TAPP) project led by former U.S. Secretary of Defense Ash Carter, was designed to recognize technological innovations that serve the public good [3]. The original brief called for branding and collateral for a physical event. When the pandemic forced the cancellation of in-person gatherings, the project faced an existential risk. Without a physical venue, the university needed a way to ensure "running-ups and the public can immediately recognize the link between the award and the University" [1]. The challenge was not just hosting a video call; it was translating the prestige and ceremony of a Harvard award into a digital format that commanded the same respect.

### The Data Complexity Constraint
Simultaneously, the Shorenstein Center was preparing to release the "US Independent Film Audience and Landscape Study." This was not a light overview; it was a "detailed, data-driven report" analyzing audience fragmentation, distribution bottlenecks, and market sustainability [1].

The density of the information posed a usability problem. In a traditional PDF format, connecting a specific data point about audience demographics to a broader conclusion about distribution requires the reader to flip back and forth, holding complex correlations in their head. The Shorenstein Center needed a "Central Hub" that could untangle this complexity, making the research accessible to filmmakers and distributors without diluting its academic rigor [2].

## Our Approach: From Static Documents to Digital Products

The solution required a fundamental shift in how we categorized the engagement. We moved the project scope from "branding and collateral"—which implies decorating a finished product—to "Product Design and User Experience" [1]. This reframing allowed us to treat the policy content not as reading material, but as user data that required architecture, hierarchy, and interface design.

### The User-Centric Pivot
In academic publishing, the "user" is often an afterthought to the "reader." We reversed this polarity. We analyzed who would be consuming this data:
1.  **The Policymaker:** Needs to verify the methodology and cite the findings rapidly.
2.  **The Industry Practitioner:** Needs actionable roadmaps to navigate market shifts.
3.  **The General Public:** Needs a clear narrative to understand why this research matters.

For the Tech Spotlight, this meant creating a digital experience that emulated the flow of an award ceremony. We couldn't just list names; we had to present the participants in a "unique and intuitive way" that guided the user through the cohort, establishing the prestige of the selection [1].

### Visual Authority and Institutional Nuance
Designing for an institution like Harvard requires navigating a specific tension: the new project must have its own identity, but it cannot clash with or attempt to overpower the parent brand.

For the Tech Spotlight, we developed a visual identity centered on a logo where "stage lights flashing from three spotlights" formed a crown [1]. This imagery bridged the gap between the concept of "spotlighting" technology and the "crowning" achievement of the award. Crucially, the design system was calibrated to stand out enough to give the project its own character, yet remain disciplined enough not to "rival the institutions" of Harvard and the Belfer Center [1]. This balance is vital for evaluators in higher education; the goal is innovation that respects the legacy, not innovation that erases it.

## Architecture: Building the "Casebook" and the "Hub"

To solve the dual challenges of event displacement and data complexity, we engineered two distinct architectural models: the Modular Casebook and the Central Hub.

### The Modular Casebook (Tech Spotlight)
The Tech Spotlight needed to showcase a diverse range of winners, from "Project Galileo" to "Dataset Nutrition Labels" [5]. A static list would fail to capture the nuance of these projects.

We built a **Casebook architecture**. In this model, every award winner is treated as a distinct "case study" module. These modules are standardized in structure—problem, solution, impact—but flexible in content. This approach offered two strategic advantages:
1.  **Scalability:** The system is designed to accommodate future cohorts. New winners can be added as new modules without requiring a redesign of the platform's core logic.
2.  **Narrative Control:** By structuring the content as case studies, we controlled the pacing of the information, ensuring that complex technical interventions were explained clearly to a lay audience.

Crucially, we maintained a hybrid output workflow. While the web experience was the primary interface, we ensured the system could generate high-fidelity digital publications (PDFs) [5]. This acknowledged the reality of the academic sector: while the web is for engagement, the PDF remains the currency of archival citation.

### The Central Hub (Indie Film Landscape)
For the Shorenstein Center, the architecture focused on data synthesis. We designed the website as a "central hub" where users could navigate the "heterogeneous content" of the report [1].

Instead of a linear scroll, the architecture used a hub-and-spoke model. The core findings—such as the "Roadmap" for the future of independent film—served as the central navigation point. Users could drill down into specific data sets regarding audience behavior or distribution channels and then easily return to the synthesis [2]. This transformed the report from a passive reading experience into an active research tool, allowing filmmakers to find the specific data relevant to their market segment.

## The Results: Impact Beyond the Launch

The true measure of a policy publication system is not just its launch, but its ability to sustain engagement and support high-level discourse.

### Operational Resilience
The digital platform for the Tech Spotlight successfully mitigated the risk of the pandemic. By providing a robust online venue, the initiative was able to proceed with a virtual "fireside chat" featuring Ash Carter [3]. The platform became the stage, allowing the TAPP project to continue its mission to "swing technology toward the public good" without interruption. The "running-ups" and winners received the public recognition they deserved, preserving the momentum of the award for future years [1].

### Market Penetration
The Indie Film Landscape project achieved a level of industry permeation that is rare for academic studies. The research identified a massive opportunity: an "untapped market of 40 million viewers" for independent film [9]. Because the digital architecture made this finding accessible and shareable, it traveled beyond the university and into industry trade publications and strategy meetings. Nancy Gibbs, Director of the Shorenstein Center, noted the significance of this work in supporting "exceptional leaders" and "groundbreaking work" in the field [10].

### Institutional Trust
Perhaps the most critical outcome for an evaluator is the caliber of stakeholders the system supported. The platforms we built successfully hosted and represented projects from global giants like IBM, Google, and the New York Times [1]. That these organizations were comfortable being showcased within the environment we architected speaks to the system's polish, stability, and brand safety.

## What This Means for Your Organization

The transition from legacy publishing to digital ecosystems is not merely a technical upgrade; it is a strategic necessity for organizations that trade in knowledge.

If your organization produces high-value research, you likely face the same friction points Harvard did. You may have "landmark" reports locked in PDFs that no one reads past the executive summary. You may rely on physical events that leave no digital footprint once the attendees go home.

Our work with Harvard demonstrates that you can decouple your authority from your medium. By adopting a product-focused mindset, you can build systems that:
1.  **Survive Disruption:** Digital-first architectures ensure your research reaches its audience regardless of physical restrictions.
2.  **Unlock Data:** transforming static charts into interactive hubs allows your stakeholders to use your data, not just look at it.
3.  **Scale Gracefully:** Modular design systems allow you to build an archive of impact over time, rather than a graveyard of old links.

---

Are you evaluating a migration from legacy publication models to a digital-first ecosystem? See how our process ensures your research retains its rigor while gaining accessibility. [Learn about our approach](/process).

## Footnotes

[1] CCM Design, "Harvard - ccm.design," 2024. [Link](https://www.ccmdesign.ca/clients/harvard/) Confidence: Medium

[2] Shorenstein Center, "US Independent Film Audience and Landscape Study," 2024. [Link](https://shorensteincenter.org/wp-content/uploads/2024/11/us-independent-film-study-kerith-putnam.pdf) Confidence: Medium

[3] Harvard Gazette, "Bending technology toward the light," 2020. [Link](https://news.harvard.edu/gazette/story/2020/10/tech-spotlight-honors-three-for-responsible-technology/) Confidence: Medium

[5] Tech Spotlight, "Tech Spotlight Casebook 2021," 2021. [Link](https://hks-spotlight.netlify.app/assets/tech-spotlight-casebook-2021.pdf) Confidence: Medium

[9] NATO California/Nevada, "Indie Film Market is Ready for a Rebound," 2024. [Link](https://www.natocalnev.org/index.php/blog/indie-film-market-is-ready-for-a-rebound-12-24) Confidence: Medium

[10] Filmmaker Magazine, "Patricia Aufderheide, Jax Deluca Named Fall 2025 Shorenstein Center Fellows," 2024. [Link](https://filmmakermagazine.com/131762-patricia-auferheide-jax-deluca-named-fall-2025-shorenstein-center-fellows/) Confidence: Medium
