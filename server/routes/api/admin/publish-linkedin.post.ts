// Nitro auto-imports from server/utils/ — no fragile relative paths needed.
// resolvePostPath, readPostFrontmatter, updateFrontmatter from server/utils/updateFrontmatter
// publishLinkedInPost from server/utils/serviceClient
import { isNullish } from '~/utils/isNullish'

export default defineEventHandler(async (event) => {
  // Block access in production builds
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  // In dev, require ADMIN_API_SECRET if set (optional local security)
  const expectedSecret = process.env.ADMIN_API_SECRET
  if (expectedSecret) {
    const providedSecret = getHeader(event, 'x-admin-secret')
    if (providedSecret !== expectedSecret) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
  }

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

  if (!post.linkedinDraftedAt) {
    throw createError({ statusCode: 400, statusMessage: 'No LinkedIn draft exists for this post — draft first' })
  }

  if (!isNullish(post.linkedinPostedAt)) {
    throw createError({ statusCode: 409, statusMessage: 'LinkedIn post already published for this post' })
  }

  const existingPostUrl = post.linkedinPostUrl as string
  if (!existingPostUrl) {
    throw createError({ statusCode: 400, statusMessage: 'No LinkedIn post URL found — cannot publish without a draft URL' })
  }

  const result = await publishLinkedInPost(existingPostUrl)

  if (!result.ok) {
    throw createError({ statusCode: 502, statusMessage: result.error })
  }

  const linkedinPostedAt = new Date().toISOString()

  // Service call succeeded — now update frontmatter
  try {
    const updates: Record<string, unknown> = { linkedinPostedAt }
    if (result.postUrl) {
      updates.linkedinPostUrl = result.postUrl
    }
    await updateFrontmatter(filePath, updates)
  } catch (err) {
    return {
      status: 'sent_but_flag_failed',
      warning: `LinkedIn post was published successfully, but frontmatter update failed: ${(err as Error).message}. Please manually set linkedinPostedAt: "${linkedinPostedAt}" in ${slug}.md`,
    }
  }

  return {
    status: 'ok',
    slug,
    linkedinPostedAt,
    linkedinPostUrl: result.postUrl || existingPostUrl,
  }
})
