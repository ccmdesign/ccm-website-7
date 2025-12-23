const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const blogDir = path.join(__dirname, '..', 'content', 'blog');
const draftsDir = path.join(blogDir, '_drafts');

// Recursively get all markdown files
function getAllMarkdownFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

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
  // Check for ## TL;DR, ## TLDR;, ## TLDR variations
  const tldrHeadingRegex = /##\s*TL;DR\s*\n([\s\S]*?)(?=\n##|\n---|$)/i;
  const headingMatch = body.match(tldrHeadingRegex);
  
  if (headingMatch) {
    return {
      tldr: headingMatch[1].trim(),
      bodyWithoutTldr: body.replace(tldrHeadingRegex, '').trim()
    };
  }
  
  // Try TLDR; variation
  const tldrSemicolonRegex = /##\s*TLDR;\s*\n([\s\S]*?)(?=\n##|\n---|$)/i;
  const semicolonMatch = body.match(tldrSemicolonRegex);
  
  if (semicolonMatch) {
    return {
      tldr: semicolonMatch[1].trim(),
      bodyWithoutTldr: body.replace(tldrSemicolonRegex, '').trim()
    };
  }
  
  // Try TLDR without semicolon
  const tldrNoSemicolonRegex = /##\s*TLDR\s*\n([\s\S]*?)(?=\n##|\n---|$)/i;
  const noSemicolonMatch = body.match(tldrNoSemicolonRegex);
  
  if (noSemicolonMatch) {
    return {
      tldr: noSemicolonMatch[1].trim(),
      bodyWithoutTldr: body.replace(tldrNoSemicolonRegex, '').trim()
    };
  }
  
  return null;
}

function transformFrontmatter(frontmatter, body, filePath) {
  const transformed = { ...frontmatter };
  let bodyChanged = false;
  let newBody = body;
  
  // 1. Normalize author
  if (transformed.author) {
    if (transformed.author === 'CCM Design' || transformed.author === 'CCM') {
      transformed.author = 'CCM Design Team';
    }
  } else {
    transformed.author = 'CCM Design Team';
  }
  
  // 2. Convert category (string) to categories (array)
  if (transformed.category && !transformed.categories) {
    transformed.categories = [transformed.category];
    delete transformed.category;
  }
  
  // 3. Convert keywords to tags
  if (transformed.keywords && !transformed.tags) {
    transformed.tags = transformed.keywords;
    delete transformed.keywords;
  }
  
  // 4. Convert status to published
  if (transformed.status !== undefined) {
    if (!transformed.published) {
      transformed.published = transformed.status === 'ready';
    }
    delete transformed.status;
  }
  
  // 5. Normalize date format (ensure string format YYYY-MM-DD)
  if (transformed.date) {
    if (transformed.date instanceof Date) {
      // Convert Date object to YYYY-MM-DD string
      transformed.date = transformed.date.toISOString().split('T')[0];
    } else if (typeof transformed.date === 'string') {
      // Remove quotes if present and extract just the date part
      let dateValue = transformed.date.replace(/^["']|["']$/g, '');
      // If it's an ISO string, extract just the date part
      if (dateValue.includes('T')) {
        dateValue = dateValue.split('T')[0];
      }
      transformed.date = dateValue;
    }
  }
  
  // 6. Extract TL;DR from body if not in frontmatter
  if (!transformed.tldr) {
    const extracted = extractTldrFromBody(body);
    if (extracted) {
      transformed.tldr = extracted.tldr;
      newBody = extracted.bodyWithoutTldr;
      bodyChanged = true;
    }
  } else {
    // Even if tldr exists in frontmatter, remove it from body
    const extracted = extractTldrFromBody(body);
    if (extracted) {
      newBody = extracted.bodyWithoutTldr;
      bodyChanged = true;
    }
  }
  
  // 7. Remove meta_title and meta_description (use title and excerpt for SEO)
  if (transformed.meta_title) {
    delete transformed.meta_title;
  }
  if (transformed.meta_description) {
    delete transformed.meta_description;
  }
  
  // 8. Remove primary_keyword (use first seo_tags entry if needed)
  if (transformed.primary_keyword) {
    delete transformed.primary_keyword;
  }
  
  // 9. Ensure required fields exist
  if (!transformed.title) {
    console.warn(`Missing title in ${filePath}`);
  }
  if (!transformed.date) {
    console.warn(`Missing date in ${filePath}`);
  }
  if (!transformed.excerpt) {
    console.warn(`Missing excerpt in ${filePath}`);
  }
  
  // 10. Generate brow from first category if missing
  if (!transformed.brow && transformed.categories && transformed.categories.length > 0) {
    transformed.brow = transformed.categories[0];
  }
  
  // 11. Generate tagline from excerpt if missing
  if (!transformed.tagline && transformed.excerpt) {
    // Use first sentence of excerpt
    const firstSentence = transformed.excerpt.split(/[.!?]/)[0].trim();
    if (firstSentence.length > 0 && firstSentence.length < 100) {
      transformed.tagline = firstSentence;
    }
  }
  
  return { transformed, bodyChanged, newBody };
}

function stringifyFrontmatter(frontmatter) {
  // Sort fields for consistency
  const orderedFields = [
    'title',
    'slug',
    'brow',
    'tagline',
    'date',
    'author',
    'categories',
    'tags',
    'seo_tags',
    'excerpt',
    'tldr',
    'stage',
    'related_posts',
    'published'
  ];
  
  const ordered = {};
  const rest = {};
  
  // Add ordered fields first
  for (const field of orderedFields) {
    if (frontmatter[field] !== undefined) {
      ordered[field] = frontmatter[field];
    }
  }
  
  // Add any remaining fields
  for (const key in frontmatter) {
    if (!orderedFields.includes(key)) {
      rest[key] = frontmatter[key];
    }
  }
  
  const final = { ...ordered, ...rest };
  
  try {
    return yaml.dump(final, {
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
      sortKeys: false
    }).trim();
  } catch (e) {
    console.error('Error stringifying YAML:', e.message);
    return yaml.dump(final).trim();
  }
}

function migrateFile(filePath, dryRun = false) {
  const parsed = parseMarkdown(filePath);
  
  if (!parsed) {
    return { success: false, changes: [] };
  }
  
  const { frontmatter, body } = parsed;
  const { transformed, bodyChanged, newBody } = transformFrontmatter(frontmatter, body, filePath);
  
  const changes = [];
  let needsUpdate = false;
  
  // Check what changed
  const originalKeys = Object.keys(frontmatter).sort();
  const transformedKeys = Object.keys(transformed).sort();
  
  // Check for deleted keys (keys in original but not in transformed)
  const deletedKeys = originalKeys.filter(k => !transformedKeys.includes(k));
  const addedKeys = transformedKeys.filter(k => !originalKeys.includes(k));
  
  if (deletedKeys.length > 0 || addedKeys.length > 0) {
    changes.push('frontmatter fields changed');
    needsUpdate = true;
  }
  
  // Check for value changes
  for (const key in transformed) {
    if (JSON.stringify(frontmatter[key]) !== JSON.stringify(transformed[key])) {
      if (!changes.includes('frontmatter values changed')) {
        changes.push('frontmatter values changed');
      }
      needsUpdate = true;
    }
  }
  
  // Also check for keys that were deleted (exist in original but not transformed)
  for (const key in frontmatter) {
    if (!(key in transformed)) {
      needsUpdate = true;
      if (!changes.includes('frontmatter fields changed')) {
        changes.push('frontmatter fields changed');
      }
    }
  }
  
  if (bodyChanged) {
    changes.push('TL;DR extracted from body');
    needsUpdate = true;
  }
  
  if (!needsUpdate) {
    return { success: true, changes: [], needsUpdate: false };
  }
  
  if (!dryRun) {
    // Write updated file
    const newContent = `---\n${stringifyFrontmatter(transformed)}\n---\n\n${newBody}\n`;
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }
  
  return { success: true, changes, needsUpdate: true };
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  const files = getAllMarkdownFiles(blogDir);
  console.log(`Found ${files.length} markdown files\n`);
  
  let processed = 0;
  let updated = 0;
  const stats = {
    authorNormalized: 0,
    categoryConverted: 0,
    keywordsRenamed: 0,
    statusConverted: 0,
    tldrExtracted: 0,
    metaFieldsRemoved: 0,
    browGenerated: 0,
    taglineGenerated: 0
  };
  
  for (const filePath of files) {
    const relativePath = path.relative(blogDir, filePath);
    const result = migrateFile(filePath, dryRun);
    
    if (result.success) {
      processed++;
      if (result.needsUpdate) {
        updated++;
        console.log(`✓ ${relativePath}`);
        result.changes.forEach(change => console.log(`  → ${change}`));
      }
    } else {
      console.error(`✗ ${relativePath} - Failed to process`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`  Processed: ${processed} files`);
  console.log(`  Updated: ${updated} files`);
  console.log(`  Unchanged: ${processed - updated} files`);
  
  if (dryRun) {
    console.log(`\n💡 Run without --dry-run to apply changes`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { migrateFile, transformFrontmatter, extractTldrFromBody };

