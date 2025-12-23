const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'content', 'blog');
const draftsDir = path.join(__dirname, '..', 'content', 'blog', '_drafts');

// Ensure drafts directory exists
if (!fs.existsSync(draftsDir)) {
  fs.mkdirSync(draftsDir, { recursive: true });
}

// Get all markdown files in blog directory (excluding _drafts)
const blogFiles = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.md'))
  .map(f => ({
    filename: f,
    path: path.join(blogDir, f)
  }));

// Group files by week (YYYY-WW format)
const postsByWeek = {};

blogFiles.forEach(({ filename, path: filePath }) => {
  // Extract date from filename (YYYY-MM-DD-slug.md)
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
  if (!dateMatch) {
    console.warn(`⚠ Skipping file without date prefix: ${filename}`);
    return;
  }
  
  const dateStr = dateMatch[1];
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  // Get ISO week (YYYY-WW format)
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
  const weekYear = weekStart.getFullYear();
  const weekStartOfYear = new Date(weekYear, 0, 1);
  const weekNumber = Math.ceil((((weekStart - weekStartOfYear) / 86400000) + weekStartOfYear.getDay() + 1) / 7);
  const weekKey = `${weekYear}-W${String(weekNumber).padStart(2, '0')}`;
  
  if (!postsByWeek[weekKey]) {
    postsByWeek[weekKey] = [];
  }
  
  postsByWeek[weekKey].push({
    filename,
    path: filePath,
    date: dateStr,
    dateObj: date
  });
});

// Find weeks with more than one post
const weeksWithMultiple = Object.entries(postsByWeek)
  .filter(([week, posts]) => posts.length > 1)
  .sort(([weekA], [weekB]) => weekA.localeCompare(weekB));

console.log(`Found ${weeksWithMultiple.length} weeks with multiple posts\n`);

let moved = 0;
const movedFiles = [];

weeksWithMultiple.forEach(([week, posts]) => {
  // Sort posts by date, then by filename (keep the first one)
  posts.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.filename.localeCompare(b.filename);
  });
  
  // Keep the first post, move the rest
  const keepPost = posts[0];
  const movePosts = posts.slice(1);
  
  console.log(`📅 Week ${week}:`);
  console.log(`   ✓ Keeping: ${keepPost.filename}`);
  
  movePosts.forEach(post => {
    const sourcePath = post.path;
    const targetPath = path.join(draftsDir, post.filename);
    
    try {
      fs.renameSync(sourcePath, targetPath);
      console.log(`   → Moved to drafts: ${post.filename}`);
      moved++;
      movedFiles.push(post.filename);
    } catch (e) {
      console.error(`   ✗ Error moving ${post.filename}:`, e.message);
    }
  });
  console.log('');
});

console.log(`\n📊 Summary:`);
console.log(`  Weeks with multiple posts: ${weeksWithMultiple.length}`);
console.log(`  Posts moved to drafts: ${moved}`);
console.log(`  Posts kept: ${blogFiles.length - moved}`);

if (movedFiles.length > 0) {
  console.log(`\n📝 Moved files:`);
  movedFiles.forEach(f => console.log(`  - ${f}`));
}

