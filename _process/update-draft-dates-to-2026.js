const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const draftsDir = path.join(__dirname, '..', 'content', 'blog', '_drafts');

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

function stringifyFrontmatter(frontmatter) {
  try {
    return yaml.dump(frontmatter, {
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
      sortKeys: false
    }).trim();
  } catch (e) {
    console.error('Error stringifying YAML:', e.message);
    return yaml.dump(frontmatter).trim();
  }
}

function getDateForWeek(weekNumber, year = 2026) {
  // Start from January 1, 2026 (which is a Thursday)
  // We'll start weeks on Sunday for consistency
  const jan1 = new Date(year, 0, 1); // January 1, 2026
  const dayOfWeek = jan1.getDay(); // 0 = Sunday, 4 = Thursday
  
  // Find the first Sunday of 2026 (or use Jan 1 if it's Sunday)
  let firstSunday;
  if (dayOfWeek === 0) {
    firstSunday = jan1;
  } else {
    // Move to next Sunday
    const daysUntilSunday = 7 - dayOfWeek;
    firstSunday = new Date(jan1);
    firstSunday.setDate(jan1.getDate() + daysUntilSunday);
  }
  
  // Add weeks (weekNumber - 1) to get the date for that week
  const targetDate = new Date(firstSunday);
  targetDate.setDate(firstSunday.getDate() + ((weekNumber - 1) * 7));
  
  // Format as YYYY-MM-DD
  const yearStr = targetDate.getFullYear();
  const monthStr = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(targetDate.getDate()).padStart(2, '0');
  
  return `${yearStr}-${monthStr}-${dayStr}`;
}

// Process each draft file
let processed = 0;
const updates = [];

draftFiles.forEach((filename, index) => {
  const filePath = path.join(draftsDir, filename);
  const parsed = parseMarkdown(filePath);
  
  if (!parsed) {
    console.error(`✗ Failed to parse ${filename}`);
    return;
  }
  
  const { frontmatter, body } = parsed;
  
  // Assign dates starting from week 1 of 2026
  const weekNumber = index + 1;
  const newDate = getDateForWeek(weekNumber, 2026);
  
  // Update date in frontmatter
  const oldDate = frontmatter.date;
  // Store as plain string, YAML will handle quoting
  frontmatter.date = newDate;
  
  // Write updated file
  const newContent = `---\n${stringifyFrontmatter(frontmatter)}\n---\n\n${body}\n`;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  
  console.log(`✓ ${filename}`);
  console.log(`  ${oldDate} → ${newDate} (Week ${weekNumber})`);
  
  updates.push({ filename, oldDate, newDate, weekNumber });
  processed++;
});

console.log(`\n📊 Summary:`);
console.log(`  Processed: ${processed} files`);
console.log(`  Date range: ${updates[0]?.newDate} to ${updates[updates.length - 1]?.newDate}`);

