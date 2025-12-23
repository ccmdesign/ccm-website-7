const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const draftsDir = path.join(__dirname, '..', 'content', 'blog', '_drafts');
const blogDir = path.join(__dirname, '..', 'content', 'blog');

// Get all markdown files in drafts
const draftFiles = fs.readdirSync(draftsDir).filter(f => f.endsWith('.md'));

function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return null;
  }
  
  const frontmatterContent = match[1];
  const body = match[2];
  
  let frontmatter;
  try {
    frontmatter = yaml.load(frontmatterContent) || {};
  } catch (e) {
    console.error(`Error parsing YAML in ${filePath}:`, e.message);
    return null;
  }
  
  return { frontmatter, body, content };
}

function getNewFilename(frontmatter, originalFilename) {
  // Extract date
  let date = frontmatter.date;
  if (!date) {
    console.warn(`No date found in ${originalFilename}, skipping`);
    return null;
  }
  
  // Handle Date objects or ISO strings
  if (date instanceof Date) {
    date = date.toISOString().split('T')[0];
  } else if (typeof date === 'string') {
    // Remove quotes if present
    date = date.replace(/^["']|["']$/g, '');
    // Extract date part if it's an ISO string
    if (date.includes('T')) {
      date = date.split('T')[0];
    }
  }
  
  // Extract slug
  let slug = frontmatter.slug;
  if (!slug) {
    // Generate slug from filename if not in frontmatter
    slug = originalFilename.replace('.md', '');
  }
  
  // Format: YYYY-MM-DD-slug.md
  return `${date}-${slug}.md`;
}

// Process each draft file
let processed = 0;
let skipped = 0;
const errors = [];

for (const draftFile of draftFiles) {
  const draftPath = path.join(draftsDir, draftFile);
  const parsed = parseMarkdown(draftPath);
  
  if (!parsed) {
    console.error(`✗ Failed to parse ${draftFile}`);
    errors.push(draftFile);
    skipped++;
    continue;
  }
  
  const { frontmatter } = parsed;
  const newFilename = getNewFilename(frontmatter, draftFile);
  
  if (!newFilename) {
    skipped++;
    continue;
  }
  
  const newPath = path.join(blogDir, newFilename);
  
  // Check if target file already exists
  if (fs.existsSync(newPath)) {
    console.warn(`⚠ Target file already exists: ${newFilename}`);
    errors.push(`${draftFile} → ${newFilename} (target exists)`);
    skipped++;
    continue;
  }
  
  try {
    // Move file
    fs.renameSync(draftPath, newPath);
    console.log(`✓ ${draftFile} → ${newFilename}`);
    processed++;
  } catch (e) {
    console.error(`✗ Error moving ${draftFile}:`, e.message);
    errors.push(`${draftFile}: ${e.message}`);
    skipped++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`  Processed: ${processed} files`);
console.log(`  Skipped: ${skipped} files`);

if (errors.length > 0) {
  console.log(`\n⚠ Errors:`);
  errors.forEach(err => console.log(`  - ${err}`));
}

