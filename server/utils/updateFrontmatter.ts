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

    // Use regex-based patching to avoid gray-matter stringify reordering YAML keys.
    // This preserves original formatting and only touches the updated fields.
    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!fmMatch) {
      throw new Error(`No frontmatter found in: ${filePath}`)
    }

    let fmBlock = fmMatch[1]
    const lineEnding = raw.includes('\r\n') ? '\r\n' : '\n'

    for (const [key, value] of Object.entries(updates)) {
      const serialized = typeof value === 'string' ? `"${value}"` : String(value)
      const keyPattern = new RegExp(`^(${key}:\\s*).*$`, 'm')
      if (keyPattern.test(fmBlock)) {
        // Replace existing key value
        fmBlock = fmBlock.replace(keyPattern, `$1${serialized}`)
      } else {
        // Append new key at end of frontmatter block
        fmBlock = fmBlock + lineEnding + `${key}: ${serialized}`
      }
    }

    const output = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, `---${lineEnding}${fmBlock}${lineEnding}---`)
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
