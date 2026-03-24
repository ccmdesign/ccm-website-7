#!/usr/bin/env npx tsx
/**
 * CLI script for distributing blog posts to newsletter and LinkedIn services.
 *
 * Usage:
 *   npx tsx scripts/distribute.ts --service newsletter --slug <slug>
 *   npx tsx scripts/distribute.ts --service linkedin --slug <slug>
 *   npx tsx scripts/distribute.ts --service newsletter --all-unsent
 *   npx tsx scripts/distribute.ts --service linkedin --all-unsent
 *   npx tsx scripts/distribute.ts --status
 *   npx tsx scripts/distribute.ts --service newsletter --all-unsent --dry-run
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import * as dotenv from 'dotenv'

// Load env vars from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Import shared utilities via relative path
import { resolvePostPath, readPostFrontmatter, updateFrontmatter } from '../server/utils/updateFrontmatter'
import { sendNewsletter, sendLinkedInPost } from '../server/utils/serviceClient'

const BLOG_DIR = path.resolve(__dirname, '../content/blog')
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://ccmdesign.com'

// Throttle delay between batch sends (ms) — respects Resend 2 req/sec limit
const SEND_DELAY_MS = 600

interface PostInfo {
  slug: string
  title: string
  excerpt: string
  date: string
  published: boolean
  newsletterSent: boolean
  linkedinSent: boolean
  content: string
}

function getAllPosts(): PostInfo[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
  const posts: PostInfo[] = []

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = matter(raw)
    const slug = file.replace(/\.md$/, '')

    posts.push({
      slug,
      title: (parsed.data.title as string) || slug,
      excerpt: (parsed.data.excerpt as string) || '',
      date: (parsed.data.date as string) || '',
      published: parsed.data.published !== false,
      newsletterSent: parsed.data.newsletterSent === true,
      linkedinSent: parsed.data.linkedinSent === true,
      content: parsed.content,
    })
  }

  return posts.sort((a, b) => (b.date > a.date ? 1 : -1))
}

function printStatus() {
  const posts = getAllPosts()
  const maxTitle = Math.min(50, Math.max(...posts.map((p) => p.title.length), 5))

  console.log('')
  console.log(
    'Title'.padEnd(maxTitle) + '  ' +
    'Date'.padEnd(12) + '  ' +
    'Newsletter'.padEnd(12) + '  ' +
    'LinkedIn'
  )
  console.log('-'.repeat(maxTitle + 40))

  for (const p of posts) {
    const title = p.title.length > maxTitle ? p.title.slice(0, maxTitle - 3) + '...' : p.title
    const nl = p.newsletterSent ? 'Sent' : 'UNSENT'
    const li = p.linkedinSent ? 'Sent' : 'UNSENT'
    console.log(
      title.padEnd(maxTitle) + '  ' +
      (p.date || 'n/a').padEnd(12) + '  ' +
      nl.padEnd(12) + '  ' +
      li
    )
  }

  const unsentNl = posts.filter((p) => !p.newsletterSent && p.published).length
  const unsentLi = posts.filter((p) => !p.linkedinSent && p.published).length
  console.log('')
  console.log(`Unsent newsletters: ${unsentNl} | Unsent LinkedIn: ${unsentLi} | Total posts: ${posts.length}`)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sendSingle(
  slug: string,
  service: 'newsletter' | 'linkedin',
  dryRun: boolean
): Promise<{ ok: boolean; error?: string; warning?: string }> {
  const filePath = resolvePostPath(slug)

  let post: ReturnType<typeof readPostFrontmatter>
  try {
    post = readPostFrontmatter(filePath)
  } catch {
    return { ok: false, error: `Post not found: ${slug}` }
  }

  const flagKey = service === 'newsletter' ? 'newsletterSent' : 'linkedinSent'
  if (post[flagKey] === true) {
    return { ok: true, warning: `Already sent (${service}), skipping` }
  }

  if (dryRun) {
    console.log(`  [DRY RUN] Would send ${service} for: ${post.title || slug}`)
    return { ok: true }
  }

  const payload = {
    title: post.title as string,
    excerpt: post.excerpt as string,
    url: `${SITE_URL}/blog/${slug}`,
    body: post.content,
  }

  const result = service === 'newsletter'
    ? await sendNewsletter(payload)
    : await sendLinkedInPost(payload)

  if (!result.ok) {
    return { ok: false, error: result.error }
  }

  // Update frontmatter
  try {
    await updateFrontmatter(filePath, { [flagKey]: true })
  } catch (err) {
    return {
      ok: true,
      warning: `${service} sent successfully, but frontmatter update failed: ${(err as Error).message}. Please manually set ${flagKey}: true in ${slug}.md`,
    }
  }

  return { ok: true }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--status')) {
    printStatus()
    process.exit(0)
  }

  const serviceIdx = args.indexOf('--service')
  const slugIdx = args.indexOf('--slug')
  const allUnsent = args.includes('--all-unsent')
  const dryRun = args.includes('--dry-run')

  if (serviceIdx === -1 || !args[serviceIdx + 1]) {
    console.error('Usage: npx tsx scripts/distribute.ts --service <newsletter|linkedin> --slug <slug>')
    console.error('       npx tsx scripts/distribute.ts --service <newsletter|linkedin> --all-unsent [--dry-run]')
    console.error('       npx tsx scripts/distribute.ts --status')
    process.exit(1)
  }

  const service = args[serviceIdx + 1] as 'newsletter' | 'linkedin'
  if (service !== 'newsletter' && service !== 'linkedin') {
    console.error(`Invalid service: ${service}. Must be "newsletter" or "linkedin".`)
    process.exit(1)
  }

  if (slugIdx !== -1) {
    const slug = args[slugIdx + 1]
    if (!slug) {
      console.error('Missing slug value after --slug')
      process.exit(1)
    }

    console.log(`Sending ${service} for: ${slug}${dryRun ? ' (dry run)' : ''}`)
    const result = await sendSingle(slug, service, dryRun)

    if (result.warning) console.warn(`  WARNING: ${result.warning}`)
    if (!result.ok) {
      console.error(`  FAILED: ${result.error}`)
      process.exit(1)
    }
    console.log('  Done.')
    process.exit(0)
  }

  if (allUnsent) {
    const flagKey = service === 'newsletter' ? 'newsletterSent' : 'linkedinSent'
    const posts = getAllPosts().filter((p) => p.published && !p[flagKey])

    if (posts.length === 0) {
      console.log(`No unsent ${service} posts found.`)
      process.exit(0)
    }

    console.log(`Found ${posts.length} unsent ${service} post(s)${dryRun ? ' (dry run)' : ''}:`)

    const errors: Array<{ slug: string; error: string }> = []
    const warnings: Array<{ slug: string; warning: string }> = []
    let successCount = 0

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      console.log(`  [${i + 1}/${posts.length}] ${post.title}`)

      const result = await sendSingle(post.slug, service, dryRun)

      if (result.warning) {
        warnings.push({ slug: post.slug, warning: result.warning })
        console.warn(`    WARNING: ${result.warning}`)
      }

      if (!result.ok) {
        errors.push({ slug: post.slug, error: result.error || 'Unknown error' })
        console.error(`    FAILED: ${result.error}`)
      } else {
        successCount++
      }

      // Throttle between sends to respect rate limits
      if (!dryRun && i < posts.length - 1) {
        await sleep(SEND_DELAY_MS)
      }
    }

    // Summary
    console.log('')
    console.log(`Results: ${successCount} succeeded, ${errors.length} failed, ${warnings.length} warnings`)

    if (errors.length > 0) {
      console.log('\nFailures:')
      for (const e of errors) {
        console.log(`  - ${e.slug}: ${e.error}`)
      }
    }

    if (warnings.length > 0) {
      console.log('\nWarnings:')
      for (const w of warnings) {
        console.log(`  - ${w.slug}: ${w.warning}`)
      }
    }

    process.exit(errors.length > 0 ? 1 : 0)
  }

  console.error('Must specify --slug <slug> or --all-unsent')
  process.exit(1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
