const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '..', 'content', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

function fixTldrComponentTags(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Split frontmatter and body
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return false;
  }
  
  const frontmatterContent = match[1];
  const body = match[2];
  
  // Find tldr field - handle both multiline (|-) and single line formats
  // For multiline, capture until we hit a non-indented line or end of frontmatter
  const lines = frontmatterContent.split('\n');
  let tldrStartIndex = -1;
  let tldrEndIndex = -1;
  let isMultiline = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^tldr:\s*\|-?\s*$/)) {
      tldrStartIndex = i;
      isMultiline = true;
      // Find where tldr ends - next non-indented line or empty line followed by non-indented
      for (let j = i + 1; j < lines.length; j++) {
        const line = lines[j];
        // Stop at non-indented line (starts with letter or ---)
        if (line.match(/^[a-z-]/) && !line.match(/^  /)) {
          tldrEndIndex = j;
          break;
        }
        // Also stop if we hit empty line followed by non-indented
        if (line.trim() === '' && j + 1 < lines.length && lines[j + 1].match(/^[a-z-]/) && !lines[j + 1].match(/^  /)) {
          tldrEndIndex = j;
          break;
        }
      }
      if (tldrEndIndex === -1) {
        tldrEndIndex = lines.length;
      }
      break;
    } else if (lines[i].match(/^tldr:\s*.+$/)) {
      // Single line tldr
      tldrStartIndex = i;
      tldrEndIndex = i + 1;
      isMultiline = false;
      break;
    }
  }
  
  if (tldrStartIndex === -1) {
    return false;
  }
  
  let tldrValue;
  if (isMultiline) {
    tldrValue = lines.slice(tldrStartIndex + 1, tldrEndIndex).join('\n');
  } else {
    tldrValue = lines[tldrStartIndex].replace(/^tldr:\s*/, '');
  }
  
  const originalTldr = tldrValue;
  
  if (isMultiline) {
    // Remove lines containing :: component tags (standalone or with component name)
    tldrValue = tldrValue.split('\n')
      .filter(line => !line.trim().match(/^::/)) // Remove any line starting with ::
      .map(line => line.replace(/\s+::.*$/, '')) // Remove :: and anything after from end of lines
      .join('\n');
  } else {
    // Single line - remove :: if present
    tldrValue = tldrValue.replace(/\s+::.*$/, '').trim();
  }
  
  // Trim trailing whitespace
  tldrValue = tldrValue.trim();
  
  if (tldrValue === originalTldr.trim()) {
    return false;
  }
  
  // Reconstruct frontmatter
  let newFrontmatter;
  if (isMultiline) {
    const tldrLines = tldrValue.split('\n').filter(l => l.trim() || l === '');
    const indentedLines = tldrLines.map(l => l.trim() ? `  ${l.trim()}` : '').join('\n');
    const beforeTldr = lines.slice(0, tldrStartIndex).join('\n');
    const afterTldr = lines.slice(tldrEndIndex).join('\n');
    newFrontmatter = `${beforeTldr}\ntldr: |-\n${indentedLines}\n${afterTldr}`;
  } else {
    lines[tldrStartIndex] = `tldr: ${tldrValue}`;
    newFrontmatter = lines.join('\n');
  }
  
  // Write updated file
  const newContent = `---\n${newFrontmatter}\n---\n${body}`;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  
  return true;
}

let fixed = 0;
for (const file of files) {
  const filePath = path.join(blogDir, file);
  if (fixTldrComponentTags(filePath)) {
    console.log(`✓ Fixed ${file}`);
    fixed++;
  }
}

console.log(`\nFixed ${fixed} files`);

