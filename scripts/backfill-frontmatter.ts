/**
 * Backfill script: adds newsletterSent and linkedinSent flags to existing blog posts.
 *
 * Existing published posts are marked as `true` (they were already distributed
 * through old channels). Drafts and unpublished posts are skipped.
 *
 * Idempotent — running twice produces no changes on the second run.
 *
 * Usage: npx tsx scripts/backfill-frontmatter.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const BLOG_DIR = path.resolve(__dirname, '../content/blog')

function backfill() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))

  let updated = 0
  let skipped = 0

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = matter(raw)

    // Skip drafts / unpublished posts
    if (parsed.data.published === false) {
      console.log(`SKIP (unpublished): ${file}`)
      skipped++
      continue
    }

    // Check if already backfilled
    const hasNewsletter = 'newsletterSent' in parsed.data
    const hasLinkedin = 'linkedinSent' in parsed.data

    if (hasNewsletter && hasLinkedin) {
      console.log(`SKIP (already has flags): ${file}`)
      skipped++
      continue
    }

    // Add flags
    if (!hasNewsletter) parsed.data.newsletterSent = true
    if (!hasLinkedin) parsed.data.linkedinSent = true

    // Write back preserving body content
    const output = matter.stringify(parsed.content, parsed.data)
    fs.writeFileSync(filePath, output, 'utf-8')

    console.log(`UPDATED: ${file}`)
    updated++
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`)
}

backfill()
