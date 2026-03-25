/**
 * Sync script: copies articles and marketing files from a Varro content archive
 * into the CCM website repo with frontmatter migration and automatic date scheduling.
 *
 * Usage: npx tsx scripts/sync-varro.ts --source /path/to/archive [--dry-run] [--force]
 *
 * Source can also be set via the VARRO_CONTENT_ARCHIVE environment variable.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import {
  parseISO,
  isMonday,
  isThursday,
  nextMonday,
  nextThursday,
  format,
  isBefore,
  startOfDay,
} from 'date-fns'

// ---------------------------------------------------------------------------
// Slug sanitization
// ---------------------------------------------------------------------------

/**
 * Sanitize a slug to prevent path traversal and ensure it is safe for use as
 * a filename. Strips path separators, `..`, and non-URL-safe characters.
 */
export function sanitizeSlug(raw: string): string {
  // Collapse any path separators and parent-directory references
  let slug = raw.replace(/\.\./g, '').replace(/[/\\]/g, '')
  // Keep only alphanumeric, hyphens, and underscores
  slug = slug.replace(/[^a-zA-Z0-9_-]/g, '')
  // Remove leading/trailing hyphens or underscores left over from stripping
  slug = slug.replace(/^[-_]+|[-_]+$/g, '')
  return slug
}

/**
 * Verify that a resolved file path is contained within the expected directory.
 * Throws if the path escapes the directory.
 */
export function assertPathContained(filePath: string, containerDir: string): void {
  const resolved = path.resolve(filePath)
  const resolvedDir = path.resolve(containerDir) + path.sep
  if (!resolved.startsWith(resolvedDir) && resolved !== path.resolve(containerDir)) {
    throw new Error(
      `Path traversal detected: "${filePath}" resolves outside "${containerDir}"`,
    )
  }
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const BLOG_DIR = path.resolve(__dirname, '../content/blog')
const MARKETING_DIR = path.resolve(__dirname, '../content/marketing')

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

interface CliArgs {
  source: string | null
  dryRun: boolean
  force: boolean
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { source: null, dryRun: false, force: false }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--source' && argv[i + 1]) {
      args.source = argv[++i]
    } else if (argv[i] === '--dry-run') {
      args.dryRun = true
    } else if (argv[i] === '--force') {
      args.force = true
    }
  }
  return args
}

// ---------------------------------------------------------------------------
// Date scheduling helpers
// ---------------------------------------------------------------------------

/**
 * Scan existing blog posts and return the latest `date` value as a Date,
 * or null if no posts exist.
 */
export function getLatestBlogDate(blogDir: string): Date | null {
  if (!fs.existsSync(blogDir)) return null
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'))

  let latest: Date | null = null

  for (const file of files) {
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8')
    const parsed = matter(raw)
    const dateStr = parsed.data.date
    if (!dateStr) continue

    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr)
    if (!latest || d > latest) {
      latest = d
    }
  }

  return latest
}

/**
 * Given a reference date, return the next Mon or Thu (whichever comes first).
 * If the reference is a Monday, next is the following Thursday.
 * If the reference is a Thursday, next is the following Monday.
 * Otherwise, next is whichever of Mon/Thu comes first after the reference.
 */
export function getNextPostDate(reference: Date): Date {
  if (isMonday(reference)) {
    return nextThursday(reference)
  }
  if (isThursday(reference)) {
    return nextMonday(reference)
  }
  // Neither Mon nor Thu -- pick the nearest upcoming one
  const mon = nextMonday(reference)
  const thu = nextThursday(reference)
  return mon < thu ? mon : thu
}

/**
 * Generate an array of `count` posting dates starting from the given reference.
 */
export function generatePostDates(reference: Date, count: number): Date[] {
  const dates: Date[] = []
  let cursor = reference
  for (let i = 0; i < count; i++) {
    cursor = getNextPostDate(cursor)
    dates.push(cursor)
  }
  return dates
}

// ---------------------------------------------------------------------------
// Frontmatter migration
// ---------------------------------------------------------------------------

interface VarroFrontmatter {
  title?: string
  slug?: string
  date?: string
  author?: string
  excerpt?: string
  published?: boolean
  category?: string
  categories?: string[]
  keywords?: string[]
  primary_keyword?: string
  meta_title?: string
  meta_description?: string
  status?: string
  related_posts?: unknown[]
  cta?: unknown
  stage?: string
  [key: string]: unknown
}

export function migrateFrontmatter(
  source: VarroFrontmatter,
  assignedDate: string,
  marketingLinkedin?: Record<string, unknown> | null,
): Record<string, unknown> {
  // Build categories from category or existing categories
  const categories: string[] = []
  if (source.category) {
    categories.push(source.category)
  } else if (source.categories && Array.isArray(source.categories)) {
    categories.push(...source.categories)
  }

  // Build seo_tags from primary_keyword + keywords, deduplicated
  const seoTags: string[] = []
  if (source.primary_keyword) {
    seoTags.push(source.primary_keyword)
  }
  if (source.keywords && Array.isArray(source.keywords)) {
    for (const kw of source.keywords) {
      if (!seoTags.includes(kw)) {
        seoTags.push(kw)
      }
    }
  }

  const migrated: Record<string, unknown> = {
    title: source.title || '',
    slug: source.slug || '',
    brow: '',
    tagline: '',
    date: assignedDate,
    author: 'CCM Design Team',
    categories,
    tags: [],
    seo_tags: seoTags,
    excerpt: source.excerpt || '',
    tldr: source.excerpt || '',
    published: source.published !== undefined ? source.published : true,
  }

  // Preserve stage if present (valid optional schema field)
  if (source.stage) {
    migrated.stage = source.stage
  }

  // Distribution timestamps -- null for new posts
  migrated.newsletterSentAt = null
  migrated.newsletterPreviewUrl = null
  migrated.linkedinDraftedAt = null
  migrated.linkedinPostUrl = null
  migrated.linkedinPostedAt = null

  // Marketing content embedding (LinkedIn)
  if (marketingLinkedin) {
    migrated.marketing = { linkedin: marketingLinkedin }
  }

  return migrated
}

// ---------------------------------------------------------------------------
// LinkedIn content extraction from marketing.md
// ---------------------------------------------------------------------------

/**
 * Extract LinkedIn long-form post content from marketing.md body.
 * Expected heading structure:
 *   ## Professional Posts
 *     ### LinkedIn
 *       #### Long-Form Post
 *         <content here>
 *
 * Returns the extracted text, or null if the structure doesn't match.
 */
export function extractLinkedInContent(markdownBody: string): string | null {
  // Find the #### Long-Form Post heading
  const longFormMatch = markdownBody.match(
    /####\s+Long-Form Post\s*\n([\s\S]*?)(?=\n#{1,4}\s|\n*$)/,
  )
  if (!longFormMatch || !longFormMatch[1]) return null

  const content = longFormMatch[1].trim()
  return content.length > 0 ? content : null
}

// ---------------------------------------------------------------------------
// gray-matter stringify helper -- ensures dates stay as YYYY-MM-DD strings
// ---------------------------------------------------------------------------

function stringifyPost(
  body: string,
  data: Record<string, unknown>,
): string {
  // Ensure the date field is a quoted string so gray-matter won't coerce it
  // into a Date object. We wrap it in single quotes so YAML treats it as a
  // plain string, then also apply the regex fallback for safety.
  const safeCopy = { ...data }
  if (typeof safeCopy.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(safeCopy.date)) {
    safeCopy.date = safeCopy.date // keep as string
  }

  const output = matter.stringify(body, safeCopy)
  // Fallback regex: fix any Date objects that gray-matter may have emitted
  // as full ISO timestamps (handles timezone offsets, Z suffix, quoted or not)
  return output.replace(
    /^(date:\s*)'?(\d{4}-\d{2}-\d{2})T[\d:.+-Z]+'?/gm,
    "$1'$2'",
  )
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

interface VarroFolder {
  dirPath: string
  dirName: string
  hasFinal: boolean
  hasMarketing: boolean
}

function discoverArchive(source: string): VarroFolder[] {
  const entries = fs.readdirSync(source, { withFileTypes: true })
  const folders: VarroFolder[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const dirPath = path.join(source, entry.name)
    const hasFinal = fs.existsSync(path.join(dirPath, 'final.md'))
    const hasMarketing = fs.existsSync(path.join(dirPath, 'marketing.md'))

    if (hasFinal || hasMarketing) {
      folders.push({
        dirPath,
        dirName: entry.name,
        hasFinal,
        hasMarketing,
      })
    }
  }

  return folders
}

// ---------------------------------------------------------------------------
// Main sync logic
// ---------------------------------------------------------------------------

interface SyncResult {
  synced: number
  skipped: number
  warnings: string[]
}

export function sync(
  source: string,
  blogDir: string,
  marketingDir: string,
  options: { dryRun: boolean; force: boolean },
): SyncResult {
  const result: SyncResult = { synced: 0, skipped: 0, warnings: [] }

  // Discover archive folders
  const folders = discoverArchive(source)
  if (folders.length === 0) {
    console.log('No Varro content folders found in source directory.')
    return result
  }

  // Collect posts to process
  interface PostEntry {
    slug: string
    body: string
    varroData: VarroFrontmatter
    marketingRaw: string | null
    marketingLinkedin: Record<string, unknown> | null
    dirName: string
  }

  const posts: PostEntry[] = []

  for (const folder of folders) {
    // Skip folders without final.md
    if (!folder.hasFinal) {
      if (folder.hasMarketing) {
        const msg = `WARN: ${folder.dirName} has marketing.md but no final.md -- skipping folder`
        console.log(msg)
        result.warnings.push(msg)
      }
      continue
    }

    // Parse final.md
    const finalPath = path.join(folder.dirPath, 'final.md')
    const finalRaw = fs.readFileSync(finalPath, 'utf-8')
    const parsed = matter(finalRaw)
    const rawSlug = parsed.data.slug || folder.dirName
    const slug = sanitizeSlug(rawSlug)
    if (!slug) {
      const msg = `WARN: ${folder.dirName} -- slug "${rawSlug}" is empty after sanitization, skipping`
      console.log(msg)
      result.warnings.push(msg)
      continue
    }

    // Check if already exists
    const targetPath = path.join(blogDir, `${slug}.md`)
    assertPathContained(targetPath, blogDir)
    if (fs.existsSync(targetPath) && !options.force) {
      console.log(`SKIP (exists): ${slug}`)
      result.skipped++
      continue
    }

    // Handle marketing file
    let marketingRaw: string | null = null
    let marketingLinkedin: Record<string, unknown> | null = null

    if (folder.hasMarketing) {
      const marketingPath = path.join(folder.dirPath, 'marketing.md')
      marketingRaw = fs.readFileSync(marketingPath, 'utf-8')

      // Try to extract LinkedIn content
      const linkedinText = extractLinkedInContent(marketingRaw)
      if (linkedinText) {
        marketingLinkedin = { longForm: linkedinText }
      } else {
        const msg = `WARN: Could not extract LinkedIn content from ${folder.dirName}/marketing.md`
        console.log(msg)
        result.warnings.push(msg)
      }
    } else {
      const msg = `WARN: No marketing.md found in ${folder.dirName}`
      console.log(msg)
      result.warnings.push(msg)
    }

    posts.push({
      slug,
      body: parsed.content,
      varroData: parsed.data as VarroFrontmatter,
      marketingRaw,
      marketingLinkedin,
      dirName: folder.dirName,
    })
  }

  if (posts.length === 0) {
    console.log('No new posts to sync.')
    return result
  }

  // Sort alphabetically by slug for deterministic date assignment
  posts.sort((a, b) => a.slug.localeCompare(b.slug))

  // Calculate posting dates
  const latestDate = getLatestBlogDate(blogDir)
  const today = startOfDay(new Date())
  const reference = latestDate && latestDate >= today ? latestDate : today
  const dates = generatePostDates(reference, posts.length)

  // Ensure output directories exist
  if (!options.dryRun) {
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true })
    if (!fs.existsSync(marketingDir)) fs.mkdirSync(marketingDir, { recursive: true })
  }

  // Write files
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const dateStr = format(dates[i], 'yyyy-MM-dd')

    const migrated = migrateFrontmatter(post.varroData, dateStr, post.marketingLinkedin)
    const blogOutput = stringifyPost(post.body, migrated)
    const blogPath = path.join(blogDir, `${post.slug}.md`)

    if (options.dryRun) {
      console.log(`DRY-RUN: Would write blog post -> ${blogPath} (date: ${dateStr})`)
    } else {
      fs.writeFileSync(blogPath, blogOutput, 'utf-8')
      console.log(`SYNCED: ${post.slug} (date: ${dateStr})`)
    }

    // Write marketing file
    if (post.marketingRaw) {
      const marketingPath = path.join(marketingDir, `${post.slug}.md`)
      if (options.dryRun) {
        console.log(`DRY-RUN: Would write marketing file -> ${marketingPath}`)
      } else {
        fs.writeFileSync(marketingPath, post.marketingRaw, 'utf-8')
        console.log(`SYNCED marketing: ${post.slug}`)
      }
    }

    result.synced++
  }

  return result
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv)

  // Resolve source path
  const source = args.source || process.env.VARRO_CONTENT_ARCHIVE
  if (!source) {
    console.error(
      'Error: No source path provided.\n\n' +
        'Usage: npx tsx scripts/sync-varro.ts --source /path/to/archive [--dry-run] [--force]\n\n' +
        'Or set the VARRO_CONTENT_ARCHIVE environment variable.',
    )
    process.exit(1)
  }

  const resolvedSource = path.resolve(source)
  if (!fs.existsSync(resolvedSource)) {
    console.error(`Error: Source path does not exist: ${resolvedSource}`)
    process.exit(1)
  }

  console.log(`Source: ${resolvedSource}`)
  if (args.dryRun) console.log('Mode: DRY RUN')
  if (args.force) console.log('Mode: FORCE (overwrite existing)')
  console.log('')

  const result = sync(resolvedSource, BLOG_DIR, MARKETING_DIR, {
    dryRun: args.dryRun,
    force: args.force,
  })

  console.log(
    `\nDone. Synced: ${result.synced}, Skipped: ${result.skipped}, Warnings: ${result.warnings.length}`,
  )
}

// Guard: only run main() when executed directly (not when imported by tests)
const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  main()
}
