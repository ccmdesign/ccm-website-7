import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

// Simple per-file mutex to prevent concurrent writes to the same file
const locks = new Map<string, Promise<void>>()

async function withFileLock<T>(filePath: string, fn: () => Promise<T>): Promise<T> {
  const existing = locks.get(filePath) || Promise.resolve()
  let resolve: () => void
  const newLock = new Promise<void>((r) => { resolve = r })
  locks.set(filePath, newLock)

  await existing
  try {
    return await fn()
  } finally {
    resolve!()
    if (locks.get(filePath) === newLock) {
      locks.delete(filePath)
    }
  }
}

/**
 * Resolves a blog slug to its absolute file path.
 * Convention: content/blog/{slug}.md
 */
export function resolvePostPath(slug: string): string {
  // Sanitize slug to prevent path traversal
  const safeSlug = path.basename(slug)
  return path.resolve(process.cwd(), 'content', 'blog', `${safeSlug}.md`)
}

/**
 * Reads a .md file, parses YAML frontmatter, updates specified fields, writes back.
 * Preserves existing frontmatter key order and markdown body.
 * Uses per-file locking to prevent concurrent write corruption.
 */
export async function updateFrontmatter(
  filePath: string,
  updates: Record<string, unknown>
): Promise<void> {
  return withFileLock(filePath, async () => {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = matter(raw)

    // Apply updates
    for (const [key, value] of Object.entries(updates)) {
      parsed.data[key] = value
    }

    // Write back preserving body content
    const output = matter.stringify(parsed.content, parsed.data)
    fs.writeFileSync(filePath, output, 'utf-8')
  })
}

/**
 * Reads frontmatter from a blog post file.
 */
export function readPostFrontmatter(filePath: string): Record<string, unknown> & { content: string } {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const parsed = matter(raw)
  return { ...parsed.data, content: parsed.content }
}
