---
name: batch-format-blogs
description: Processes multiple blog posts with the blog-formatter agent to standardize frontmatter and content structure. Can process a single .md file or an entire directory of blog posts, intelligently skipping already-formatted posts.
tools: Read, Write, Glob, Task
---

# /batch-format-blogs Command

When this command is used, execute the following task:

## Description
Processes multiple blog posts with the blog-formatter agent to standardize frontmatter and content structure according to CCM's 2025 content standards. Intelligently detects which posts need formatting and skips those already properly formatted.

## Usage
- `/batch-format-blogs <file_path>` - Format a single blog post
- `/batch-format-blogs <directory_path>` - Format all .md files in a directory

## Execution Flow

### Step 1: Validate Input
1. Check if the provided path exists
2. Determine if path is a file or directory
3. If file: Verify it has .md extension
4. If directory: Find all .md files recursively

### Step 2: Pre-Analysis (Directory Processing Only)
**For Directory Processing:**
1. Scan all .md files found in the directory
2. Perform quick formatting status check on each file:
   - Has complete frontmatter with slug field?
   - Starts with ::tldr-section?
   - Contains ::cta-section?
   - Ends with ::sources-section?
3. Create two lists:
   - **Needs Formatting**: Files missing required formatting elements
   - **Already Formatted**: Files that meet all formatting criteria
4. Report the analysis summary to user

### Step 3: Process Files That Need Formatting
**For Single File:**
- Launch blog-formatter agent with the specific file path
- Agent will analyze and apply necessary formatting

**For Directory (Files Needing Formatting Only):**
- If 1-3 files need formatting: Process sequentially with single agent calls
- If 4+ files need formatting: Launch multiple blog-formatter agents in parallel
- Each agent processes a specific file (not batches - the agent only handles single files)
- Skip all files identified as already formatted

### Step 4: Agent Task Instructions
Each blog-formatter agent should be given this task for a specific file:

```
Analyze and format the blog post at: [specific_file_path]

The blog-formatter agent will:
1. Read and analyze the specific blog post
2. Check if formatting work is necessary 
3. If needed, standardize frontmatter and content structure
4. If already well-formatted, report status and skip processing
5. Apply only the necessary formatting components for this article
6. Report specific changes made or confirm no changes needed

The agent is designed to work on single files and will intelligently determine what formatting work is required.
```

### Step 5: Coordination for Multiple Files
When processing directories with multiple files needing formatting:
1. Launch one blog-formatter agent per file that needs formatting
2. Use Task tool to run agents in parallel (up to 4 concurrent agents)
3. Wait for all agents to complete
4. Collect and summarize results from all agents

### Step 6: Results Summary
After processing, provide:
- **Total files scanned**
- **Files already formatted** (skipped)
- **Files processed** (had formatting applied)
- **Summary of changes made** across all processed files
- **Any errors encountered**

## Smart Processing Logic
```
1. Scan directory for .md files
2. For each file, check formatting status:
   - Complete frontmatter with slug? → Continue checking
   - Content starts with ::tldr-section? → Continue checking  
   - Contains ::cta-section? → Continue checking
   - Ends with ::sources-section? → Mark as formatted, skip
   - Missing any of above? → Mark as needs formatting
3. Process only files that need formatting
4. Generate summary report
```

## Error Handling
- **Invalid path**: Report error and request valid path
- **No .md files found**: Report and suggest checking directory
- **Agent failures**: Report which files couldn't be processed
- **All files already formatted**: Report success with no changes needed

## Examples
```
/batch-format-blogs content/blog/my-post.md
/batch-format-blogs content/blog/
/batch-format-blogs content/
```

## Efficiency Features
- **Skip already-formatted posts**: Reduces unnecessary processing
- **Parallel processing**: Multiple agents for large directories
- **Targeted analysis**: Only processes files that actually need work
- **Progress reporting**: Shows which files were skipped vs processed