import { resolvePostPath, readPostFrontmatter, updateFrontmatter } from '../../../utils/updateFrontmatter'
import { sendLinkedInPost } from '../../../utils/serviceClient'

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

  if (post.linkedinSent === true) {
    throw createError({ statusCode: 409, statusMessage: 'LinkedIn post already sent for this post' })
  }

  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://ccmdesign.com'
  const result = await sendLinkedInPost({
    title: post.title as string,
    excerpt: post.excerpt as string,
    url: `${siteUrl}/blog/${slug}`,
  })

  if (!result.ok) {
    throw createError({ statusCode: 502, statusMessage: result.error })
  }

  // Service call succeeded — now update frontmatter
  try {
    await updateFrontmatter(filePath, { linkedinSent: true })
  } catch (err) {
    // Critical: LinkedIn post was sent but we failed to update the flag
    return {
      status: 'sent_but_flag_failed',
      warning: `LinkedIn post was sent successfully, but frontmatter update failed: ${(err as Error).message}. Please manually set linkedinSent: true in ${slug}.md`,
    }
  }

  return { status: 'ok', slug }
})
