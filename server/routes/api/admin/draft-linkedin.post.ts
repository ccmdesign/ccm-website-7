// Nitro auto-imports from server/utils/ — no fragile relative paths needed.
// resolvePostPath, readPostFrontmatter, updateFrontmatter from server/utils/updateFrontmatter
// draftLinkedInPost from server/utils/serviceClient

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

  if (post.linkedinDraftedAt != null) {
    throw createError({ statusCode: 409, statusMessage: 'LinkedIn draft already created for this post' })
  }

  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://ccmdesign.com'
  const marketingContent = (post.marketing as Record<string, unknown>)?.linkedin as Record<string, unknown> | undefined
  const result = await draftLinkedInPost(
    {
      title: post.title as string,
      excerpt: post.excerpt as string,
      url: `${siteUrl}/blog/${slug}`,
    },
    marketingContent,
  )

  if (!result.ok) {
    throw createError({ statusCode: 502, statusMessage: result.error })
  }

  const linkedinDraftedAt = new Date().toISOString()

  // Service call succeeded — now update frontmatter
  try {
    const updates: Record<string, unknown> = { linkedinDraftedAt }
    if (result.postUrl) {
      updates.linkedinPostUrl = result.postUrl
    }
    await updateFrontmatter(filePath, updates)
  } catch (err) {
    // Critical: LinkedIn draft was created but we failed to update the flag.
    // Include the post URL so the user can verify the draft exists before retrying.
    return {
      status: 'sent_but_flag_failed',
      warning: `LinkedIn draft was created successfully${result.postUrl ? ` (${result.postUrl})` : ''}, but frontmatter update failed: ${(err as Error).message}. Please manually set linkedinDraftedAt: "${linkedinDraftedAt}"${result.postUrl ? ` and linkedinPostUrl: "${result.postUrl}"` : ''} in ${slug}.md`,
    }
  }

  return {
    status: 'ok',
    slug,
    linkedinDraftedAt,
    linkedinPostUrl: result.postUrl || null,
  }
})
