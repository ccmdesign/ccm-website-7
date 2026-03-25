// Nitro auto-imports from server/utils/ — no fragile relative paths needed.
// resolvePostPath, readPostFrontmatter, updateFrontmatter from server/utils/updateFrontmatter
// sendNewsletter from server/utils/serviceClient

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

  if (post.newsletterSentAt != null) {
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

  const newsletterSentAt = new Date().toISOString()

  // Service call succeeded — now update frontmatter
  try {
    const updates: Record<string, unknown> = { newsletterSentAt }
    if (result.previewUrl) {
      updates.newsletterPreviewUrl = result.previewUrl
    }
    await updateFrontmatter(filePath, updates)
  } catch (err) {
    // Critical: newsletter was sent but we failed to update the flag
    return {
      status: 'sent_but_flag_failed',
      warning: `Newsletter was sent successfully, but frontmatter update failed: ${(err as Error).message}. Please manually set newsletterSentAt: "${newsletterSentAt}" in ${slug}.md`,
    }
  }

  return {
    status: 'ok',
    slug,
    newsletterSentAt,
    newsletterPreviewUrl: result.previewUrl || null,
  }
})
