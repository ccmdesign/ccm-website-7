import { resolvePostPath, readPostFrontmatter, updateFrontmatter } from '../../../utils/updateFrontmatter'
import { sendNewsletter } from '../../../utils/serviceClient'

export default defineEventHandler(async (event) => {
  const { slug } = await readBody(event)

  if (!slug || typeof slug !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid slug' })
  }

  const filePath = resolvePostPath(slug)

  let post: Record<string, unknown> & { content: string }
  try {
    post = readPostFrontmatter(filePath)
  } catch {
    throw createError({ statusCode: 404, statusMessage: `Post not found: ${slug}` })
  }

  if (post.newsletterSent === true) {
    throw createError({ statusCode: 409, statusMessage: 'Newsletter already sent for this post' })
  }

  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://ccmdesign.com'
  const result = await sendNewsletter({
    title: post.title as string,
    excerpt: post.excerpt as string,
    url: `${siteUrl}/blog/${slug}`,
    body: post.content,
  })

  if (!result.ok) {
    throw createError({ statusCode: 502, statusMessage: result.error })
  }

  // Service call succeeded — now update frontmatter
  try {
    await updateFrontmatter(filePath, { newsletterSent: true })
  } catch (err) {
    // Critical: newsletter was sent but we failed to update the flag
    return {
      status: 'sent_but_flag_failed',
      warning: `Newsletter was sent successfully, but frontmatter update failed: ${(err as Error).message}. Please manually set newsletterSent: true in ${slug}.md`,
    }
  }

  return { status: 'ok', slug }
})
