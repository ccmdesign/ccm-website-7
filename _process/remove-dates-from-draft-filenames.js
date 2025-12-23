const fs = require('fs');
const path = require('path');

const draftsDir = path.join(__dirname, '..', 'content', 'blog', '_drafts');

// Get all markdown files in drafts directory
const draftFiles = fs.readdirSync(draftsDir)
  .filter(f => f.endsWith('.md'))
  .map(f => ({
    filename: f,
    path: path.join(draftsDir, f)
  }));

function removeDatePrefix(filename) {
  // Match YYYY-MM-DD- pattern at the start
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  if (!dateMatch) {
    return null; // No date prefix found
  }
  
  return dateMatch[2]; // Return the part after the date
}

let processed = 0;
let skipped = 0;
const errors = [];

draftFiles.forEach(({ filename, path: filePath }) => {
  const newFilename = removeDatePrefix(filename);
  
  if (!newFilename) {
    console.log(`⊘ Skipping ${filename} (no date prefix)`);
    skipped++;
    return;
  }
  
  const newPath = path.join(draftsDir, newFilename);
  
  // Check if target file already exists
  if (fs.existsSync(newPath)) {
    console.warn(`⚠ Target file already exists: ${newFilename}`);
    errors.push(`${filename} → ${newFilename} (target exists)`);
    skipped++;
    return;
  }
  
  try {
    // Rename file
    fs.renameSync(filePath, newPath);
    console.log(`✓ ${filename} → ${newFilename}`);
    processed++;
  } catch (e) {
    console.error(`✗ Error renaming ${filename}:`, e.message);
    errors.push(`${filename}: ${e.message}`);
    skipped++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`  Processed: ${processed} files`);
console.log(`  Skipped: ${skipped} files`);

if (errors.length > 0) {
  console.log(`\n⚠ Errors:`);
  errors.forEach(err => console.log(`  - ${err}`));
}

