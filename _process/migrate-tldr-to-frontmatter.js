const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const blogDir = path.join(__dirname, '..', 'content', 'blog');

// Read all markdown files
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Split frontmatter and body
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    console.warn(`No frontmatter found in ${filePath}`);
    return null;
  }
  
  const frontmatterContent = match[1];
  const body = match[2];
  
  // Parse YAML frontmatter
  let frontmatter;
  try {
    frontmatter = yaml.load(frontmatterContent) || {};
  } catch (e) {
    console.error(`Error parsing YAML in ${filePath}:`, e.message);
    return null;
  }
  
  return { frontmatter, body, originalContent: content };
}

function extractTldrFromBody(body) {
  // Check for ::tldr-section component
  const tldrSectionRegex = /::tldr-section\n([\s\S]*?)\n::/;
  const tldrMatch = body.match(tldrSectionRegex);
  
  if (tldrMatch) {
    return {
      tldr: tldrMatch[1].trim(),
      bodyWithoutTldr: body.replace(tldrSectionRegex, '').trim()
    };
  }
  
  // Check for ## TLDR, ## TLDR;, or ## TD;DR heading
  // First try TD;DR specifically (with semicolon in the middle)
  const tldrHeadingRegex2 = /##\s*TD;DR\s*\n([\s\S]*?)(?=\n##|\n---|$)/i;
  const headingMatch2 = body.match(tldrHeadingRegex2);
  
  if (headingMatch2) {
    return {
      tldr: headingMatch2[1].trim(),
      bodyWithoutTldr: body.replace(tldrHeadingRegex2, '').trim()
    };
  }
  
  // Then try TLDR variations
  const tldrHeadingRegex = /##\s*TLDR;?\s*\n([\s\S]*?)(?=\n##|\n---|$)/i;
  const headingMatch = body.match(tldrHeadingRegex);
  
  if (headingMatch) {
    return {
      tldr: headingMatch[1].trim(),
      bodyWithoutTldr: body.replace(tldrHeadingRegex, '').trim()
    };
  }
  
  return null;
}

function generateSummary(frontmatter, body) {
  // Use excerpt if available
  if (frontmatter.excerpt) {
    return frontmatter.excerpt;
  }
  
  // Use tagline if available
  if (frontmatter.tagline) {
    return frontmatter.tagline;
  }
  
  // Extract first meaningful paragraph
  const paragraphs = body.split('\n\n').filter(p => p.trim().length > 0);
  for (const para of paragraphs) {
    // Skip headings and component syntax
    if (!para.startsWith('#') && !para.startsWith('::') && para.length > 50) {
      // Clean up markdown formatting
      let summary = para
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
        .replace(/\*\*([^\*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^\*]+)\*/g, '$1') // Remove italic
        .replace(/^#+\s*/, '') // Remove headings
        .trim();
      
      if (summary.length > 100 && summary.length < 500) {
        return summary;
      }
    }
  }
  
  // Fallback: first 200 characters
  const firstText = body.replace(/^#+\s*/gm, '').replace(/::[\w-]+\n/g, '').trim();
  return firstText.substring(0, 200).trim() + (firstText.length > 200 ? '...' : '');
}

function stringifyFrontmatter(frontmatter) {
  try {
    return yaml.dump(frontmatter, {
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false
    }).trim();
  } catch (e) {
    console.error('Error stringifying YAML:', e.message);
    return '';
  }
}

// Process each file
let processed = 0;
let withTldr = 0;
let generated = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const parsed = parseMarkdown(filePath);
  
  if (!parsed) continue;
  
  const { frontmatter, body } = parsed;
  
  // Try to extract from body first (even if tldr exists in frontmatter, we want to remove it from body)
  const extracted = extractTldrFromBody(body);
  
  let tldr;
  let newBody = body;
  let needsUpdate = false;
  
  if (extracted) {
    // If we extracted tldr and it's different from frontmatter, update it
    if (!frontmatter.tldr || frontmatter.tldr !== extracted.tldr) {
      tldr = extracted.tldr;
      needsUpdate = true;
    } else {
      tldr = frontmatter.tldr;
    }
    newBody = extracted.bodyWithoutTldr;
    if (extracted.bodyWithoutTldr !== body) {
      needsUpdate = true;
    }
    if (!frontmatter.tldr) {
      withTldr++;
      console.log(`✓ ${file} - extracted tldr from body`);
    } else {
      console.log(`✓ ${file} - removed tldr from body`);
    }
  } else if (!frontmatter.tldr) {
    // Generate summary only if tldr doesn't exist
    tldr = generateSummary(frontmatter, body);
    generated++;
    needsUpdate = true;
    console.log(`✓ ${file} - generated tldr summary`);
  } else {
    console.log(`✓ ${file} already has tldr in frontmatter and no tldr in body`);
    processed++;
    continue;
  }
  
  if (!needsUpdate) {
    processed++;
    continue;
  }
  
  // Add tldr to frontmatter if it doesn't exist or update it
  frontmatter.tldr = tldr;
  
  // Write updated file
  const newContent = `---\n${stringifyFrontmatter(frontmatter)}\n---\n\n${newBody}\n`;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  
  processed++;
}

console.log(`\nProcessed ${processed} files:`);
console.log(`  - ${withTldr} had tldr extracted from body`);
console.log(`  - ${generated} had tldr generated`);
