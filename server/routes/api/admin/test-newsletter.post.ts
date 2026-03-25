// Nitro auto-imports from server/utils/ — no fragile relative paths needed.
// resolvePostPath, readPostFrontmatter from server/utils/updateFrontmatter
// sendTestNewsletter from server/utils/serviceClient

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

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    throw createError({ statusCode: 500, statusMessage: 'ADMIN_EMAIL environment variable is not set' })
  }

  const filePath = resolvePostPath(slug)

  let post: Record<string, unknown> & { content: string }
  try {
    post = readPostFrontmatter(filePath)
  } catch {
    throw createError({ statusCode: 404, statusMessage: `Post not found: ${slug}` })
  }

  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://ccmdesign.com'
  const result = await sendTestNewsletter(
    {
      title: post.title as string,
      excerpt: post.excerpt as string,
      url: `${siteUrl}/blog/${slug}`,
      body: post.content,
    },
    adminEmail,
  )

  if (!result.ok) {
    throw createError({ statusCode: 502, statusMessage: result.error })
  }

  // Test send does NOT update frontmatter (R11)
  return { status: 'ok', slug }
})
