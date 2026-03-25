#!/usr/bin/env npx tsx
/**
 * CLI script for distributing blog posts to newsletter and LinkedIn services.
 *
 * Usage:
 *   npx tsx scripts/distribute.ts --action test-newsletter --slug <slug>
 *   npx tsx scripts/distribute.ts --action send-newsletter --slug <slug>
 *   npx tsx scripts/distribute.ts --action draft-linkedin --slug <slug>
 *   npx tsx scripts/distribute.ts --action publish-linkedin --slug <slug>
 *   npx tsx scripts/distribute.ts --action send-newsletter --all-unsent
 *   npx tsx scripts/distribute.ts --action draft-linkedin --all-unsent
 *   npx tsx scripts/distribute.ts --action publish-linkedin --all-unsent
 *   npx tsx scripts/distribute.ts --status
 *   npx tsx scripts/distribute.ts --action send-newsletter --all-unsent --dry-run
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import * as dotenv from 'dotenv'

// Load env vars from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Import shared utilities via relative path
import { resolvePostPath, readPostFrontmatter, updateFrontmatter } from '../server/utils/updateFrontmatter'
import { sendNewsletter, sendTestNewsletter, draftLinkedInPost, publishLinkedInPost } from '../server/utils/serviceClient'

const BLOG_DIR = path.resolve(__dirname, '../content/blog')
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://ccmdesign.com'

// Throttle delay between batch sends (ms) — respects Resend 2 req/sec limit
const SEND_DELAY_MS = 600

type Action = 'test-newsletter' | 'send-newsletter' | 'draft-linkedin' | 'publish-linkedin'

interface PostInfo {
  slug: string
  title: string
  excerpt: string
  date: string
  published: boolean
  newsletterSentAt: string | null
  newsletterPreviewUrl: string | null
  linkedinDraftedAt: string | null
  linkedinPostUrl: string | null
  linkedinPostedAt: string | null
  marketing?: Record<string, unknown>
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
      newsletterSentAt: parsed.data.newsletterSentAt ?? null,
      newsletterPreviewUrl: parsed.data.newsletterPreviewUrl ?? null,
      linkedinDraftedAt: parsed.data.linkedinDraftedAt ?? null,
      linkedinPostUrl: parsed.data.linkedinPostUrl ?? null,
      linkedinPostedAt: parsed.data.linkedinPostedAt ?? null,
      marketing: parsed.data.marketing as Record<string, unknown> | undefined,
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
    'Newsletter'.padEnd(14) + '  ' +
    'LinkedIn'
  )
  console.log('-'.repeat(maxTitle + 44))

  for (const p of posts) {
    const title = p.title.length > maxTitle ? p.title.slice(0, maxTitle - 3) + '...' : p.title
    const nl = p.newsletterSentAt
      ? (p.newsletterSentAt === 'legacy' ? 'legacy' : p.newsletterSentAt.slice(0, 10))
      : 'UNSENT'
    const liDraft = p.linkedinDraftedAt
    const liPost = p.linkedinPostedAt
    let li: string
    if (liPost && liPost !== 'null') {
      li = liPost === 'legacy' ? 'posted (legacy)' : `posted ${liPost.slice(0, 10)}`
    } else if (liDraft) {
      li = liDraft === 'legacy' ? 'drafted (legacy)' : `drafted ${liDraft.slice(0, 10)}`
    } else {
      li = 'UNSENT'
    }
    console.log(
      title.padEnd(maxTitle) + '  ' +
      (p.date || 'n/a').padEnd(12) + '  ' +
      nl.padEnd(14) + '  ' +
      li
    )
  }

  const unsentNl = posts.filter((p) => !p.newsletterSentAt && p.published).length
  const unsentLi = posts.filter((p) => !p.linkedinPostedAt && p.published).length
  console.log('')
  console.log(`Unsent newsletters: ${unsentNl} | Unsent LinkedIn (not posted): ${unsentLi} | Total posts: ${posts.length}`)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sendSingle(
  slug: string,
  action: Action,
  dryRun: boolean
): Promise<{ ok: boolean; error?: string; warning?: string }> {
  const filePath = resolvePostPath(slug)

  let post: ReturnType<typeof readPostFrontmatter>
  try {
    post = readPostFrontmatter(filePath)
  } catch {
    return { ok: false, error: `Post not found: ${slug}` }
  }

  // Check guards per action
  switch (action) {
    case 'test-newsletter':
      // No guard — test can be sent anytime
      break
    case 'send-newsletter':
      if (post.newsletterSentAt != null) {
        return { ok: true, warning: `Already sent (newsletter), skipping` }
      }
      break
    case 'draft-linkedin':
      if (post.linkedinDraftedAt != null) {
        return { ok: true, warning: `Already drafted (linkedin), skipping` }
      }
      break
    case 'publish-linkedin':
      if (!post.linkedinDraftedAt) {
        return { ok: false, error: `No LinkedIn draft exists — draft first` }
      }
      if (post.linkedinPostedAt != null && post.linkedinPostedAt !== 'null') {
        return { ok: true, warning: `Already posted (linkedin), skipping` }
      }
      break
  }

  if (dryRun) {
    console.log(`  [DRY RUN] Would ${action} for: ${post.title || slug}`)
    return { ok: true }
  }

  const payload = {
    title: post.title as string,
    excerpt: post.excerpt as string,
    url: `${SITE_URL}/blog/${slug}`,
    body: post.content,
  }

  let result: { ok: boolean; error?: string; previewUrl?: string; postUrl?: string }

  switch (action) {
    case 'test-newsletter': {
      const adminEmail = process.env.ADMIN_EMAIL
      if (!adminEmail) {
        return { ok: false, error: 'ADMIN_EMAIL environment variable is not set' }
      }
      result = await sendTestNewsletter(payload, adminEmail)
      if (!result.ok) return { ok: false, error: result.error }
      // Test send does NOT update frontmatter
      return { ok: true }
    }
    case 'send-newsletter': {
      result = await sendNewsletter(payload)
      if (!result.ok) return { ok: false, error: result.error }
      try {
        const updates: Record<string, unknown> = { newsletterSentAt: new Date().toISOString() }
        if (result.previewUrl) updates.newsletterPreviewUrl = result.previewUrl
        await updateFrontmatter(filePath, updates)
      } catch (err) {
        return {
          ok: true,
          warning: `Newsletter sent successfully, but frontmatter update failed: ${(err as Error).message}. Please manually set newsletterSentAt in ${slug}.md`,
        }
      }
      return { ok: true }
    }
    case 'draft-linkedin': {
      const marketingContent = (post.marketing as Record<string, unknown>)?.linkedin as Record<string, unknown> | undefined
      result = await draftLinkedInPost(payload, marketingContent)
      if (!result.ok) return { ok: false, error: result.error }
      try {
        const updates: Record<string, unknown> = { linkedinDraftedAt: new Date().toISOString() }
        if (result.postUrl) updates.linkedinPostUrl = result.postUrl
        await updateFrontmatter(filePath, updates)
      } catch (err) {
        return {
          ok: true,
          warning: `LinkedIn draft created${result.postUrl ? ` (${result.postUrl})` : ''}, but frontmatter update failed: ${(err as Error).message}. Please manually set linkedinDraftedAt${result.postUrl ? ` and linkedinPostUrl` : ''} in ${slug}.md`,
        }
      }
      return { ok: true }
    }
    case 'publish-linkedin': {
      const existingPostUrl = post.linkedinPostUrl as string
      if (!existingPostUrl) {
        return { ok: false, error: 'No LinkedIn post URL found — cannot publish without a draft URL' }
      }
      result = await publishLinkedInPost(existingPostUrl)
      if (!result.ok) return { ok: false, error: result.error }
      try {
        const updates: Record<string, unknown> = { linkedinPostedAt: new Date().toISOString() }
        if (result.postUrl) updates.linkedinPostUrl = result.postUrl
        await updateFrontmatter(filePath, updates)
      } catch (err) {
        return {
          ok: true,
          warning: `LinkedIn post published, but frontmatter update failed: ${(err as Error).message}. Please manually set linkedinPostedAt in ${slug}.md`,
        }
      }
      return { ok: true }
    }
  }
}

function getUnsentPosts(action: Action): PostInfo[] {
  const posts = getAllPosts().filter((p) => p.published)
  switch (action) {
    case 'test-newsletter':
      return posts // test can target any post
    case 'send-newsletter':
      return posts.filter((p) => p.newsletterSentAt == null)
    case 'draft-linkedin':
      return posts.filter((p) => p.linkedinDraftedAt == null)
    case 'publish-linkedin':
      return posts.filter((p) => p.linkedinDraftedAt != null && (p.linkedinPostedAt == null || p.linkedinPostedAt === 'null'))
    default:
      return []
  }
}

const VALID_ACTIONS: Action[] = ['test-newsletter', 'send-newsletter', 'draft-linkedin', 'publish-linkedin']

async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--status')) {
    printStatus()
    process.exit(0)
  }

  const actionIdx = args.indexOf('--action')
  const slugIdx = args.indexOf('--slug')
  const allUnsent = args.includes('--all-unsent')
  const dryRun = args.includes('--dry-run')

  if (actionIdx === -1 || !args[actionIdx + 1]) {
    console.error('Usage: npx tsx scripts/distribute.ts --action <action> --slug <slug>')
    console.error('       npx tsx scripts/distribute.ts --action <action> --all-unsent [--dry-run]')
    console.error('       npx tsx scripts/distribute.ts --status')
    console.error('')
    console.error('Actions: test-newsletter, send-newsletter, draft-linkedin, publish-linkedin')
    process.exit(1)
  }

  const action = args[actionIdx + 1] as Action
  if (!VALID_ACTIONS.includes(action)) {
    console.error(`Invalid action: ${action}. Must be one of: ${VALID_ACTIONS.join(', ')}`)
    process.exit(1)
  }

  if (slugIdx !== -1) {
    const slug = args[slugIdx + 1]
    if (!slug) {
      console.error('Missing slug value after --slug')
      process.exit(1)
    }

    console.log(`Running ${action} for: ${slug}${dryRun ? ' (dry run)' : ''}`)
    const result = await sendSingle(slug, action, dryRun)

    if (result.warning) console.warn(`  WARNING: ${result.warning}`)
    if (!result.ok) {
      console.error(`  FAILED: ${result.error}`)
      process.exit(1)
    }
    console.log('  Done.')
    process.exit(0)
  }

  if (allUnsent) {
    const posts = getUnsentPosts(action)

    if (posts.length === 0) {
      console.log(`No eligible posts found for ${action}.`)
      process.exit(0)
    }

    console.log(`Found ${posts.length} eligible post(s) for ${action}${dryRun ? ' (dry run)' : ''}:`)

    const errors: Array<{ slug: string; error: string }> = []
    const warnings: Array<{ slug: string; warning: string }> = []
    let successCount = 0

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      console.log(`  [${i + 1}/${posts.length}] ${post.title}`)

      const result = await sendSingle(post.slug, action, dryRun)

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
