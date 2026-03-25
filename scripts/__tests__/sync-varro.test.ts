/**
 * Tests for scripts/sync-varro.ts
 *
 * Run: npx tsx node_modules/.bin/vitest run scripts/__tests__/sync-varro.test.ts
 * Or with the project test runner if configured.
 */

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import matter from 'gray-matter'
import { parseISO, isMonday as isMon, isThursday as isThu } from 'date-fns'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  getLatestBlogDate,
  getNextPostDate,
  generatePostDates,
  migrateFrontmatter,
  extractLinkedInContent,
  sync,
} from '../sync-varro'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'varro-test-'))
}

function writeFile(dir: string, ...segments: string[]): (...args: string[]) => void {
  return (content: string) => {
    const filePath = path.join(dir, ...segments)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, content, 'utf-8')
  }
}

// ---------------------------------------------------------------------------
// Unit 1: Frontmatter migration
// ---------------------------------------------------------------------------

describe('migrateFrontmatter', () => {
  it('converts category string to categories array', () => {
    const result = migrateFrontmatter({ category: 'digital' }, '2026-07-09')
    expect(result.categories).toEqual(['digital'])
  })

  it('merges primary_keyword and keywords into deduplicated seo_tags', () => {
    const result = migrateFrontmatter(
      {
        primary_keyword: 'AI publishing',
        keywords: ['AI publishing', 'digital workflow', 'automation'],
      },
      '2026-07-09',
    )
    expect(result.seo_tags).toEqual(['AI publishing', 'digital workflow', 'automation'])
  })

  it('sets author to CCM Design Team', () => {
    const result = migrateFrontmatter({ author: 'Someone Else' }, '2026-07-09')
    expect(result.author).toBe('CCM Design Team')
  })

  it('copies excerpt to tldr', () => {
    const result = migrateFrontmatter({ excerpt: 'A summary.' }, '2026-07-09')
    expect(result.tldr).toBe('A summary.')
    expect(result.excerpt).toBe('A summary.')
  })

  it('adds blank brow, tagline, and tags', () => {
    const result = migrateFrontmatter({}, '2026-07-09')
    expect(result.brow).toBe('')
    expect(result.tagline).toBe('')
    expect(result.tags).toEqual([])
  })

  it('adds distribution timestamps as null', () => {
    const result = migrateFrontmatter({}, '2026-07-09')
    expect(result.newsletterSentAt).toBeNull()
    expect(result.newsletterPreviewUrl).toBeNull()
    expect(result.linkedinDraftedAt).toBeNull()
    expect(result.linkedinPostUrl).toBeNull()
    expect(result.linkedinPostedAt).toBeNull()
  })

  it('drops meta_title, meta_description, status, related_posts, cta', () => {
    const result = migrateFrontmatter(
      {
        meta_title: 'Some Title',
        meta_description: 'Desc',
        status: 'published',
        related_posts: ['a', 'b'],
        cta: { text: 'Go' },
      },
      '2026-07-09',
    )
    expect(result).not.toHaveProperty('meta_title')
    expect(result).not.toHaveProperty('meta_description')
    expect(result).not.toHaveProperty('status')
    expect(result).not.toHaveProperty('related_posts')
    expect(result).not.toHaveProperty('cta')
  })

  it('preserves stage when present', () => {
    const result = migrateFrontmatter({ stage: 'researcher' }, '2026-07-09')
    expect(result.stage).toBe('researcher')
  })

  it('omits stage when not present', () => {
    const result = migrateFrontmatter({}, '2026-07-09')
    expect(result).not.toHaveProperty('stage')
  })

  it('embeds marketing linkedin content when provided', () => {
    const result = migrateFrontmatter({}, '2026-07-09', { longForm: 'Some text' })
    expect(result.marketing).toEqual({ linkedin: { longForm: 'Some text' } })
  })

  it('omits marketing key when no linkedin content', () => {
    const result = migrateFrontmatter({}, '2026-07-09', null)
    expect(result).not.toHaveProperty('marketing')
  })
})

// ---------------------------------------------------------------------------
// Unit 1: Date format preservation
// ---------------------------------------------------------------------------

describe('date format preservation', () => {
  it('outputs date as YYYY-MM-DD string in frontmatter', () => {
    const migrated = migrateFrontmatter({ title: 'Test', slug: 'test', excerpt: 'X' }, '2026-07-09')
    const output = matter.stringify('Body', migrated)
    // The date should appear as a string, not a JS Date timestamp
    expect(output).toMatch(/date: '?2026-07-09'?/)
    expect(output).not.toMatch(/date:.*T\d{2}:\d{2}/)
  })
})

// ---------------------------------------------------------------------------
// Unit 2: Date scheduling
// ---------------------------------------------------------------------------

describe('getNextPostDate', () => {
  it('returns Thursday after a Monday', () => {
    const monday = new Date(2026, 6, 6) // 2026-07-06 is Monday
    const next = getNextPostDate(monday)
    expect(next.getDay()).toBe(4) // Thursday
    expect(next.getFullYear()).toBe(2026)
    expect(next.getMonth()).toBe(6)
    expect(next.getDate()).toBe(9)
  })

  it('returns Monday after a Thursday', () => {
    const thursday = new Date(2026, 6, 9) // 2026-07-09 is Thursday
    const next = getNextPostDate(thursday)
    expect(next.getDay()).toBe(1) // Monday
    expect(next.getFullYear()).toBe(2026)
    expect(next.getMonth()).toBe(6)
    expect(next.getDate()).toBe(13)
  })

  it('returns next Thursday when reference is Wednesday', () => {
    const wednesday = new Date(2026, 6, 8) // 2026-07-08 is Wednesday
    const next = getNextPostDate(wednesday)
    expect(next.getDay()).toBe(4) // Thursday
    expect(next.getDate()).toBe(9)
  })

  it('returns next Monday when reference is Friday', () => {
    const friday = new Date(2026, 6, 10) // 2026-07-10 is Friday
    const next = getNextPostDate(friday)
    expect(next.getDay()).toBe(1) // Monday
    expect(next.getDate()).toBe(13)
  })
})

describe('generatePostDates', () => {
  it('generates consecutive Mon/Thu pairs', () => {
    const monday = new Date(2026, 6, 6) // 2026-07-06 Monday
    const dates = generatePostDates(monday, 4)
    expect(dates.map((d) => d.getDate())).toEqual([9, 13, 16, 20])
    expect(dates.map((d) => d.getDay())).toEqual([4, 1, 4, 1]) // Thu, Mon, Thu, Mon
  })

  it('generates 0 dates for empty count', () => {
    const dates = generatePostDates(new Date(2026, 6, 6), 0)
    expect(dates).toEqual([])
  })
})

describe('getLatestBlogDate', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = makeTmpDir()
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('returns null for empty directory', () => {
    expect(getLatestBlogDate(tmpDir)).toBeNull()
  })

  it('returns null for nonexistent directory', () => {
    expect(getLatestBlogDate(path.join(tmpDir, 'nonexistent'))).toBeNull()
  })

  it('finds the latest date from blog posts', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'a.md'),
      matter.stringify('Body A', { date: '2026-06-01' }),
    )
    fs.writeFileSync(
      path.join(tmpDir, 'b.md'),
      matter.stringify('Body B', { date: '2026-07-06' }),
    )
    const latest = getLatestBlogDate(tmpDir)
    expect(latest).not.toBeNull()
    expect(latest!.getFullYear()).toBe(2026)
    expect(latest!.getMonth()).toBe(6) // July = 6
    expect(latest!.getDate()).toBe(6)
  })
})

// ---------------------------------------------------------------------------
// Unit 3: LinkedIn content extraction
// ---------------------------------------------------------------------------

describe('extractLinkedInContent', () => {
  it('extracts LinkedIn long-form content from expected structure', () => {
    const body = `## Professional Posts

### LinkedIn

#### Long-Form Post

AI is transforming digital publishing. Here are the key points.

1. First point
2. Second point

#AI #Publishing

#### Short Post

Short version of the post.

### Twitter

#### Thread

1/ Some tweet thread.
`
    const result = extractLinkedInContent(body)
    expect(result).toContain('AI is transforming digital publishing')
    expect(result).toContain('#AI #Publishing')
    // Should not include content from Short Post or Twitter
    expect(result).not.toContain('Short version')
    expect(result).not.toContain('tweet thread')
  })

  it('returns null for unexpected structure', () => {
    const body = `## Some Other Heading

Just regular content without LinkedIn section.
`
    expect(extractLinkedInContent(body)).toBeNull()
  })

  it('returns null for empty body', () => {
    expect(extractLinkedInContent('')).toBeNull()
  })

  it('handles Long-Form Post as last section', () => {
    const body = `#### Long-Form Post

This is the content at the end of the file.
`
    const result = extractLinkedInContent(body)
    expect(result).toContain('This is the content at the end of the file.')
  })
})

// ---------------------------------------------------------------------------
// Unit 4: Integration tests with fixtures
// ---------------------------------------------------------------------------

describe('sync (integration)', () => {
  const FIXTURE_DIR = path.resolve(__dirname, 'fixtures/varro-archive')
  let tmpBlogDir: string
  let tmpMarketingDir: string
  let tmpRoot: string

  beforeEach(() => {
    tmpRoot = makeTmpDir()
    tmpBlogDir = path.join(tmpRoot, 'blog')
    tmpMarketingDir = path.join(tmpRoot, 'marketing')
    fs.mkdirSync(tmpBlogDir, { recursive: true })
    fs.mkdirSync(tmpMarketingDir, { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true })
  })

  it('syncs both blog and marketing files from fixture archive', () => {
    const result = sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, {
      dryRun: false,
      force: false,
    })

    expect(result.synced).toBe(2)
    expect(result.skipped).toBe(0)

    // Blog posts created
    expect(fs.existsSync(path.join(tmpBlogDir, 'ai-transforming-digital-publishing.md'))).toBe(true)
    expect(fs.existsSync(path.join(tmpBlogDir, 'design-systems-research-organizations.md'))).toBe(true)

    // Marketing file created only for abc123
    expect(fs.existsSync(path.join(tmpMarketingDir, 'ai-transforming-digital-publishing.md'))).toBe(true)
    expect(fs.existsSync(path.join(tmpMarketingDir, 'design-systems-research-organizations.md'))).toBe(false)
  })

  it('correctly migrates frontmatter in blog posts', () => {
    sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, { dryRun: false, force: false })

    const blogPath = path.join(tmpBlogDir, 'ai-transforming-digital-publishing.md')
    const raw = fs.readFileSync(blogPath, 'utf-8')
    const parsed = matter(raw)

    // Schema translation
    expect(parsed.data.categories).toEqual(['digital'])
    expect(parsed.data.seo_tags).toEqual(['AI publishing', 'digital publishing', 'AI workflow', 'automation'])
    expect(parsed.data.author).toBe('CCM Design Team')
    expect(parsed.data.tldr).toBe(parsed.data.excerpt)
    expect(parsed.data.brow).toBe('')
    expect(parsed.data.tagline).toBe('')
    expect(parsed.data.tags).toEqual([])
    expect(parsed.data.stage).toBe('researcher')

    // Dropped fields
    expect(parsed.data).not.toHaveProperty('meta_title')
    expect(parsed.data).not.toHaveProperty('meta_description')
    expect(parsed.data).not.toHaveProperty('status')
    expect(parsed.data).not.toHaveProperty('related_posts')
    expect(parsed.data).not.toHaveProperty('cta')
    expect(parsed.data).not.toHaveProperty('category')
    expect(parsed.data).not.toHaveProperty('primary_keyword')
    expect(parsed.data).not.toHaveProperty('keywords')

    // Distribution timestamps
    expect(parsed.data.newsletterSentAt).toBeNull()
    expect(parsed.data.linkedinDraftedAt).toBeNull()
  })

  it('embeds LinkedIn content in blog frontmatter from abc123', () => {
    sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, { dryRun: false, force: false })

    const blogPath = path.join(tmpBlogDir, 'ai-transforming-digital-publishing.md')
    const parsed = matter(fs.readFileSync(blogPath, 'utf-8'))

    expect(parsed.data.marketing).toBeDefined()
    expect(parsed.data.marketing.linkedin).toBeDefined()
    expect(parsed.data.marketing.linkedin.longForm).toContain('AI is fundamentally reshaping')
  })

  it('does not embed marketing key for def456 (no marketing.md)', () => {
    sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, { dryRun: false, force: false })

    const blogPath = path.join(tmpBlogDir, 'design-systems-research-organizations.md')
    const parsed = matter(fs.readFileSync(blogPath, 'utf-8'))

    expect(parsed.data).not.toHaveProperty('marketing')
  })

  it('warns about missing marketing file for def456', () => {
    const result = sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, {
      dryRun: false,
      force: false,
    })

    expect(result.warnings.some((w) => w.includes('def456'))).toBe(true)
  })

  it('preserves body content verbatim', () => {
    sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, { dryRun: false, force: false })

    const blogPath = path.join(tmpBlogDir, 'ai-transforming-digital-publishing.md')
    const parsed = matter(fs.readFileSync(blogPath, 'utf-8'))

    expect(parsed.content).toContain('## TL;DR')
    expect(parsed.content).toContain('AI is transforming digital publishing workflows')
  })

  it('copies marketing file verbatim (no transformation)', () => {
    sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, { dryRun: false, force: false })

    const sourcePath = path.resolve(FIXTURE_DIR, 'abc123/marketing.md')
    const targetPath = path.join(tmpMarketingDir, 'ai-transforming-digital-publishing.md')

    const sourceContent = fs.readFileSync(sourcePath, 'utf-8')
    const targetContent = fs.readFileSync(targetPath, 'utf-8')

    expect(targetContent).toBe(sourceContent)
  })

  it('assigns dates in Mon/Thu cadence', () => {
    sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, { dryRun: false, force: false })

    const files = fs.readdirSync(tmpBlogDir).filter((f) => f.endsWith('.md')).sort()
    const dates = files.map((f) => {
      const parsed = matter(fs.readFileSync(path.join(tmpBlogDir, f), 'utf-8'))
      return parsed.data.date
    })

    // Both dates should be strings in YYYY-MM-DD format
    for (const d of dates) {
      expect(typeof d).toBe('string')
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }

    // Dates should be consecutive Mon/Thu -- use parseISO to avoid timezone issues
    const date1 = parseISO(dates[0])
    const date2 = parseISO(dates[1])
    // Should be Mon or Thu
    expect(isMon(date1) || isThu(date1)).toBe(true)
    expect(isMon(date2) || isThu(date2)).toBe(true)
    expect(date2 > date1).toBe(true)
  })

  it('skips existing posts on second run (idempotent)', () => {
    // First run
    sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, { dryRun: false, force: false })

    // Second run
    const result = sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, {
      dryRun: false,
      force: false,
    })

    expect(result.synced).toBe(0)
    expect(result.skipped).toBe(2)
  })

  it('overwrites existing posts with --force', () => {
    // First run
    sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, { dryRun: false, force: false })

    // Second run with force
    const result = sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, {
      dryRun: false,
      force: true,
    })

    expect(result.synced).toBe(2)
    expect(result.skipped).toBe(0)
  })

  it('dry-run produces no files', () => {
    const result = sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, {
      dryRun: true,
      force: false,
    })

    expect(result.synced).toBe(2)
    // Blog dir should have no .md files (only the dir itself exists)
    const blogFiles = fs.readdirSync(tmpBlogDir).filter((f) => f.endsWith('.md'))
    expect(blogFiles).toHaveLength(0)

    const marketingFiles = fs.readdirSync(tmpMarketingDir).filter((f) => f.endsWith('.md'))
    expect(marketingFiles).toHaveLength(0)
  })

  it('date format in output files is YYYY-MM-DD string', () => {
    sync(FIXTURE_DIR, tmpBlogDir, tmpMarketingDir, { dryRun: false, force: false })

    const files = fs.readdirSync(tmpBlogDir).filter((f) => f.endsWith('.md'))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(tmpBlogDir, file), 'utf-8')
      // Check the raw YAML -- date should not have a T in it (no ISO timestamp)
      const dateMatch = raw.match(/^date:\s*(.+)$/m)
      expect(dateMatch).not.toBeNull()
      expect(dateMatch![1]).not.toMatch(/T\d{2}:\d{2}/)
      // Should match YYYY-MM-DD pattern (possibly with quotes)
      expect(dateMatch![1]).toMatch(/['"]?\d{4}-\d{2}-\d{2}['"]?/)
    }
  })
})
