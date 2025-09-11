---
name: verify-blog-frontmatter
description: Triggers the blog-frontformatter agent to verify and standardize blog post frontmatter according to CCM's 2025 content standards. Can process a single .md file or an entire directory of blog posts.
tools: Read, Write, Glob
---

# /verify-blog-frontmatter Command

When this command is used, execute the following task:

## Description
Triggers the blog-frontformatter agent to verify and standardize blog post frontmatter according to CCM's 2025 content standards. Can process a single .md file or an entire directory of blog posts.

## Usage
- `/verify-blog-frontmatter <file_path>` - Verify a single blog post
- `/verify-blog-frontmatter <directory_path>` - Verify all .md files in a directory

## Execution Flow

### Step 1: Validate Input
1. Check if the provided path exists
2. Determine if path is a file or directory
3. If file: Verify it has .md extension
4. If directory: Find all .md files recursively

### Step 2: Process Files
**For Single File:**
- Launch blog-frontformatter agent with the specific file path
- Agent will validate and standardize the frontmatter

**For Directory:**
- Find all .md files in the directory (recursively)
- If 1-3 files: Process sequentially with single agent
- If 4+ files: Launch multiple blog-frontformatter agents in parallel for efficiency
- Each agent processes a subset of files

### Step 3: Agent Task Instructions
Each blog-frontformatter agent should be given this task:

```
Analyze and standardize the frontmatter for the blog post(s) at: [file_path(s)]

Tasks:
1. Read the blog post file(s)
2. Validate existing frontmatter against CCM's 2025 standard structure
3. Identify any missing or incorrectly formatted fields
4. Standardize the frontmatter according to the specification
5. Generate appropriate content for missing fields based on article analysis
6. Update the file(s) with standardized frontmatter
7. Report what changes were made

Focus on:
- Proper category assignment from the standardized list
- SEO-optimized tags and excerpts
- Consistent formatting and required fields
- Preserving all original article content below frontmatter
```

### Step 4: Coordination for Multiple Files
When processing directories with multiple agents:
1. Split files evenly across agents (max 4 agents)
2. Launch agents in parallel using Task tool
3. Wait for all agents to complete
4. Summarize results from all agents

### Step 5: Results Summary
After processing, provide:
- Total files processed
- Number of files that needed updates
- Summary of common issues found
- List of any errors encountered

## Error Handling
- Invalid path: Report error and request valid path
- No .md files found: Report and suggest checking directory
- Agent failures: Report which files couldn't be processed

## Examples
```
/verify-blog-frontmatter content/blog/my-post.md
/verify-blog-frontmatter content/blog/
/verify-blog-frontmatter content/
```