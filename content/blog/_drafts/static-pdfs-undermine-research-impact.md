---
title: Why Static PDFs Are Undermining Your Research Impact
slug: static-pdfs-undermine-research-impact
excerpt: >-
  Static PDFs limit reach, block AI agents, and exclude disabled readers. Learn
  why shifting to HTML is critical for modern research impact.
meta_title: Why Static PDFs Undermine Research Impact
meta_description: >-
  Static PDFs limit reach, block AI agents, and exclude disabled readers. Learn
  why shifting to HTML is critical for modern research impact.
stage: researcher
category: publications
keywords:
  - research impact
  - PDF accessibility
  - single source publishing
  - JATS XML
  - digital publishing
primary_keyword: research impact
author: CCM Design
status: ready
related_posts:
  - slug: static-pdfs-undermining-research-impact
    title: Why Static PDFs Are Undermining Your Research Impact
  - slug: think-tank-website-undermining-impact
    title: Is Your Think Tank's Website Undermining Your Research Impact?
  - slug: data-visualization-research-impact
    title: 'Data Visualization Research: Why Bad Charts Kill Impact'
  - slug: poor-data-visualization-obscures-research-impact
    title: >-
      The Invisible Science: How Poor Data Visualization Obscures Research
      Impact
  - slug: 5-signs-research-publications-need-redesign
    title: 5 Signs Your Research Publications Need a Redesign
date: 2025-12-23
---
## TL;DR

- **The "Digital Paper" Paradox:** While research distribution has moved online, the primary format remains a digital simulation of print, creating friction for modern tools.
- **Three Critical Bottlenecks:** Static PDFs create systemic barriers for accessibility (excluding disabled readers), mobile experience (frustrating users), and AI synthesis (blocking discovery).
- **The Strategic Pivot:** Leading organizations are not abandoning PDFs entirely but demoting them to archival status in favor of HTML-first workflows.

We live in an era defined by fluid, semantic web technologies and instantaneous global communication. Yet, the primary vehicle for scientific knowledge remains a digital simulation of paper: the Portable Document Format (PDF). While the PDF has historically served a vital role in preserving document fidelity across platforms, its dominance as the *primary* distribution channel is now actively undermining the [research impact](/static-pdfs-undermining-research-impact) of forward-thinking organizations.

For researchers and evaluators, understanding the limitations of the PDF is no longer merely a technical concern—it is a strategic imperative. The reliance on static PDFs creates friction at every stage of the lifecycle: it blocks accessibility tools used by disabled scholars, frustrates mobile users who now constitute the majority of web traffic, and obfuscates data from the AI agents increasingly tasked with synthesizing vast libraries of literature.

This isn't an argument for eliminating the PDF. It is an argument against using it as a consumption interface. By treating PDFs as archives rather than experiences, we can unlock the full potential of digital dissemination.

## The Accessibility Crisis: An Ethical and Legal Barrier

The most immediate argument against the PDF-first workflow is its inherent hostility to accessibility. Despite legal mandates and ethical obligations to make research inclusive, the PDF format remains a significant barrier for researchers with visual, motor, or cognitive impairments.

There is a pervasive misconception that because a document is "born digital" (created in a word processor rather than scanned), it is inherently accessible. Research proves otherwise. A 2024 large-scale analysis of 20,000 scholarly PDFs revealed a systemic failure in the industry.

### The Scale of Exclusion
The study found that a staggering **74.9% of tested PDFs failed to meet even basic accessibility criteria** [1]. These aren't minor formatting errors; they are structural failures that render documents invisible or unintelligible to assistive technology.

When a screen reader encounters an untagged PDF, it often struggles to distinguish between a column of text, a header, or a footer. It may read across columns rather than down them, mashing together unrelated sentences into a chaotic stream of noise [10]. Furthermore, the vast majority of these documents lack alternative text for [figures and charts](/data-visualization-research-impact), meaning blind researchers are cut off from the core evidence of the study [11].

### The High Cost of Remediation
Fixing these issues after the fact is remarkably inefficient. Remediation—the process of retrofitting accessibility tags onto a static PDF—is a manual, labor-intensive process. While HTML accessibility can largely be handled via semantic code and CSS at the template level, PDF remediation often requires human intervention on a per-document basis.

Industry estimates suggest that professional remediation can be resource-intensive, with costs scaling significantly based on page count and complexity [14]. For an archive of thousands of papers, this represents a massive financial liability. In contrast, accessibility in HTML is inherent to the medium when proper semantic tags are used during content creation.

## The Mobile Disconnect: A User Experience Barrier

The consumption habits of researchers have shifted dramatically toward mobile devices, yet the PDF remains stubbornly desktop-centric. This disconnect creates a friction point that reduces engagement and readership.

### The Reality of Traffic
Your audience is not always sitting at a desk with dual monitors. Data indicates that mobile devices now account for approximately 64% of global web traffic [4, 5]. Whether they are commuting, moving between meetings, or doing quick reference checks in the field, researchers are accessing content on 6-inch screens.

### "Pinch and Zoom" Fatigue
PDFs are fixed-layout documents designed for A4 or Letter paper. On a smartphone, this rigidity forces the user into a cycle of "pinch-to-zoom" and horizontal scrolling just to read a single sentence. This experience is frequently cited as a major friction point that leads to high bounce rates and abandonment [13, 20].

HTML, by contrast, is responsive. It reflows text to fit the device, scales images appropriately, and creates a native reading experience. Beyond the reading experience, PDFs also sever the feedback loop. While HTML allows for granular analytics—tracking scroll depth, time on page, and interaction with specific figures—PDFs effectively offer a "black hole" of data. You know someone downloaded the file, but you have no idea if they read it [6].

## The AI Bottleneck: The Future Barrier

A critical, emerging angle for research leaders is the relationship between publication formats and Artificial Intelligence. As the volume of scientific literature explodes, researchers increasingly rely on AI agents and Large Language Models (LLMs) to discover, synthesize, and summarize papers. PDFs are actively hindering this process.

### Tokenization and Semantic Drift
AI models process text as sequences of tokens and rely on semantic coherence to understand context. PDFs, however, store information based on visual layout coordinates, not logical structure.

When text is extracted from a PDF, layout elements like page breaks, running headers, and multi-column formats often interrupt the text stream. This creates "semantic drift," where the model loses the context of the sentence or hallucinates connections between unrelated text blocks [2, 3].

### The "Garbage In" Problem
Extracting structured data from static documents is equally problematic. Reconstructing the logic of a table from a PDF—where the relationship between a cell and its header is visual rather than coded—is computationally expensive and error-prone [15, 16].

If an AI agent cannot cleanly parse your [policy paper](/think-tank-website-undermining-impact) or technical report, that research effectively becomes invisible to the synthesis tools of the future. Content published in structured formats like XML or HTML, however, provides the machine-readable tags that allow AI systems to accurately ingest and cite your work [8, 19].

## Strategic Solutions: What Leading Organizations Do

The solution is not to kill the PDF. It still serves a valid purpose for printing and offline archiving. The solution is to pivot your publishing workflow. The industry is moving toward "Single Source Publishing," where semantic XML serves as the source of truth, generating both HTML for consumption and PDF for archiving.

### The Role of JATS XML
JATS (Journal Article Tag Suite) XML is the NISO standard for archiving and exchanging scientific content. By adopting an XML-first workflow, organizations can automate the production of multiple formats [8, 9]. This ensures that the HTML version is accessible and mobile-friendly by default, while the PDF is generated automatically without manual typesetting.

### Case Study: arXiv's Shift
arXiv, the premier preprint repository, recently launched HTML formatted papers to address these exact issues. Their move was driven by the urgent need for accessibility and the recognition that PDFs were excluding scientists with disabilities [28]. By converting source files directly to HTML5, they provided a responsive, accessible reading experience while retaining the PDF for those who specifically need a fixed layout [30].

## Key Takeaways

For researchers and evaluators assessing their publishing infrastructure, the path forward involves three clear steps:

1.  **Audit Your Archive:** Review your current accessibility compliance. If you rely solely on PDFs, your research impact is likely restricted by the barriers described above.
2.  **Demote the PDF:** Shift your default view to HTML. The PDF should be a secondary download option for printing, not the primary interface for reading.
3.  **Future-Proof with Structure:** Adopt workflows that generate structured data (XML/HTML) from the start. This ensures your research remains readable by both humans and the AI agents that will assist them.

---

Subscribe to our insights to learn more about modernizing your digital publishing workflow.

## Footnotes

[1] arxiv.org, "Uncovering the New Accessibility Crisis in Scholarly PDFs," 2024. [Link](https://arxiv.org/html/2410.03022v1) Confidence: Medium

[2] unstract.com, "PDF Hell and Practical RAG Applications," 2024. [Link](https://unstract.com/blog/pdf-hell-and-practical-rag-applications/) Confidence: Medium

[3] huggingface.co, "Challenges of Using PDF Documents as Input for RAG: Text Flow, Tokenization, and Semantic Coherence - Beginners - Hugging Face Forums," 2024. [Link](https://discuss.huggingface.co/t/challenges-of-using-pdf-documents-as-input-for-rag-text-flow-tokenization-and-semantic-coherence/115662) Confidence: Medium

[4] soax.com, "What percentage of internet traffic is mobile? (July 2025)," 2025. [Link](https://soax.com/research/mobile-website-traffic) Confidence: Medium

[5] explodingtopics.com, "Internet Traffic from Mobile Devices (July 2025)," 2025. [Link](https://explodingtopics.com/blog/mobile-internet-traffic) Confidence: Medium

[6] ccdaily.com, "The problem with PDFs: It’s an accessibility thing," 2022. [Link](https://www.ccdaily.com/2022/12/the-problem-with-pdfs-its-an-accessibility-thing/) Confidence: Medium

[8] digital-publishing-report.de, "Source from digital-publishing-report.de," 2024. [Link](https://magazin.digital-publishing-report.de/en/scholarly-publishing-technology/jats-xml-1) Confidence: Medium

[9] highwirepress.com, "Enhancing Scholarly Communication Through Collaborative Publishing Systems," 2024. [Link](https://www.highwirepress.com/blog/enhancing-scholarly-communication-through-collaborative-publishing-systems/) Confidence: Medium

[10] equidox.co, "Inaccessible PDFs are Damaging Your User Experience," 2024. [Link](https://equidox.co/blog/inaccessible-pdfs-are-damaging-your-user-experience/) Confidence: Medium

[11] unimelb.edu.au, "Source from unimelb.edu.au," 2024. [Link](https://www.unimelb.edu.au/tli/news/articles/the-problem-with-pdfs) Confidence: Medium

[13] shorthand.com, "Why you need to stop using PDFs," 2023. [Link](https://shorthand.com/the-craft/the-pdf-is-in-terminal-decline/index.html) Confidence: Medium

[14] title2.info, "Comparing Human and Automated Document Remediation: Cost, Speed, and Compliance," 2025. [Link](https://title2.info/article/comparing-human-and-automated-document-remediation-cost-speed-and-compliance/) Confidence: Medium

[15] infinityai.medium.com, "Source from medium.com," 2025. [Link](https://infinityai.medium.com/3-proven-techniques-to-accurately-parse-your-pdfs-2c01c5badb84) Confidence: Medium

[16] medium.com, "Source from medium.com," 2025. [Link](https://medium.com/@dennis.somerville/an-ai-journey-of-learning-pdf-data-extraction-with-llm-a78bd9904d4f) Confidence: Medium

[19] medium.com, "PDF vs. HTML: Which Is Better for Online Content?," 2023. [Link](https://medium.com/@thepdfspace/pdf-vs-html-which-is-better-for-online-content-7db9c6a627d1) Confidence: Medium

[20] borealis.agency, "Why you need to stop using PDFs for web content," 2023. [Link](https://borealis.agency/why-you-need-to-stop-using-pdfs-for-web-content/) Confidence: Medium

[28] arxiv.org, "HTML as an accessible format for papers," 2024. [Link](https://info.arxiv.org/about/accessible_HTML.html) Confidence: Medium

[30] themoonlight.io, "[Literature Review] HTML papers on arXiv -- why it is important, and how we made it happen," 2024. [Link](https://www.themoonlight.io/en/review/html-papers-on-arxiv-why-it-is-important-and-how-we-made-it-happen) Confidence: Medium
