#!/usr/bin/env npx tsx
/**
 * ONE-TIME MIGRATION — COMPLETED 2026-03-25
 *
 * This migration has already been run against all 99 blog posts and is
 * retained for historical reference only.  Do not re-run unless you
 * are reverting the content directory to a pre-migration state.
 *
 * Replaces boolean newsletterSent/linkedinSent flags with timestamp and
 * URL fields in blog post frontmatter.
 *
 * - Posts with `newsletterSent: true` get `newsletterSentAt: "legacy"`
 * - Posts with `linkedinSent: true` get `linkedinDraftedAt: "legacy"`,
 *   `linkedinPostedAt: "legacy"`
 * - All posts get null for URL fields and any missing timestamp fields
 * - Old boolean keys are removed
 *
 * Uses regex-based patching (not matter.stringify) to preserve YAML formatting.
 * Idempotent — skips files that already have the new-schema keys.
 *
 * Usage: npx tsx scripts/migrate-to-timestamps.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const BLOG_DIR = path.resolve(__dirname, '../content/blog')

function migrate() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))

  let updated = 0
  let skipped = 0

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file)
    let raw = fs.readFileSync(filePath, 'utf-8')

    // Parse with gray-matter to read old boolean values
    const parsed = matter(raw)

    // Idempotency check: skip if already migrated
    if ('newsletterSentAt' in parsed.data) {
      console.log(`SKIP (already migrated): ${file}`)
      skipped++
      continue
    }

    // Read old boolean values (default to false if missing)
    const hadNewsletter = parsed.data.newsletterSent === true
    const hadLinkedin = parsed.data.linkedinSent === true

    // Detect line ending
    const lineEnding = raw.includes('\r\n') ? '\r\n' : '\n'

    // Extract frontmatter block
    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!fmMatch) {
      console.log(`SKIP (no frontmatter): ${file}`)
      skipped++
      continue
    }

    let fmBlock = fmMatch[1]

    // Step 1: Remove old boolean keys
    // Handle key as last line before --- (no trailing newline)
    fmBlock = fmBlock.replace(new RegExp(`${lineEnding}newsletterSent:.*$`, 'm'), '')
    fmBlock = fmBlock.replace(new RegExp(`^newsletterSent:.*${lineEnding}`, 'm'), '')
    // In case it's the only remaining content after above didn't match
    fmBlock = fmBlock.replace(/^newsletterSent:.*$/m, '')

    fmBlock = fmBlock.replace(new RegExp(`${lineEnding}linkedinSent:.*$`, 'm'), '')
    fmBlock = fmBlock.replace(new RegExp(`^linkedinSent:.*${lineEnding}`, 'm'), '')
    fmBlock = fmBlock.replace(/^linkedinSent:.*$/m, '')

    // Clean up any double line endings left by removal
    const doubleLE = lineEnding + lineEnding
    while (fmBlock.includes(doubleLE + lineEnding)) {
      fmBlock = fmBlock.replace(doubleLE + lineEnding, doubleLE)
    }

    // Step 2: Append new timestamp/URL fields
    const newsletterSentAt = hadNewsletter ? '"legacy"' : 'null'
    const newsletterPreviewUrl = 'null'
    const linkedinDraftedAt = hadLinkedin ? '"legacy"' : 'null'
    const linkedinPostUrl = 'null'
    const linkedinPostedAt = hadLinkedin ? '"legacy"' : 'null'

    fmBlock = fmBlock
      + lineEnding + `newsletterSentAt: ${newsletterSentAt}`
      + lineEnding + `newsletterPreviewUrl: ${newsletterPreviewUrl}`
      + lineEnding + `linkedinDraftedAt: ${linkedinDraftedAt}`
      + lineEnding + `linkedinPostUrl: ${linkedinPostUrl}`
      + lineEnding + `linkedinPostedAt: ${linkedinPostedAt}`

    // Step 3: Write back with regex replacement to preserve body
    const output = raw.replace(
      /^---\r?\n[\s\S]*?\r?\n---/,
      `---${lineEnding}${fmBlock}${lineEnding}---`
    )

    fs.writeFileSync(filePath, output, 'utf-8')
    console.log(`UPDATED: ${file} (newsletter: ${hadNewsletter ? 'legacy' : 'null'}, linkedin: ${hadLinkedin ? 'legacy' : 'null'})`)
    updated++
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`)
}

migrate()
