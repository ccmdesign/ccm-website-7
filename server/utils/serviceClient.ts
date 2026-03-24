/**
 * Service client utilities for calling the LinkedIn and Newsletter services.
 *
 * These functions read service URLs and tokens from environment variables.
 * They are used by both the admin server routes and the CLI script.
 */

interface PostPayload {
  title: string
  excerpt: string
  url: string
  body?: string
}

interface ServiceResult {
  ok: boolean
  error?: string
}

function getEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing environment variable: ${key}`)
  return val
}

/**
 * Sends a newsletter for a blog post via the newsletter service.
 */
export async function sendNewsletter(post: PostPayload): Promise<ServiceResult> {
  const serviceUrl = getEnv('NEWSLETTER_SERVICE_URL')
  const resendApiKey = getEnv('RESEND_API_KEY')

  try {
    const res = await fetch(`${serviceUrl}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        title: post.title,
        excerpt: post.excerpt,
        url: post.url,
        body: post.body,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return { ok: false, error: `Newsletter service error (${res.status}): ${errorText}` }
    }

    return { ok: true }
  } catch (err) {
    return { ok: false, error: `Newsletter service unreachable: ${(err as Error).message}` }
  }
}

/**
 * Sends a LinkedIn post for a blog post via the LinkedIn service.
 */
export async function sendLinkedInPost(post: PostPayload): Promise<ServiceResult> {
  const serviceUrl = getEnv('LINKEDIN_SERVICE_URL')
  const accessToken = getEnv('LINKEDIN_ACCESS_TOKEN')

  try {
    const res = await fetch(`${serviceUrl}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: post.title,
        excerpt: post.excerpt,
        url: post.url,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return { ok: false, error: `LinkedIn service error (${res.status}): ${errorText}` }
    }

    return { ok: true }
  } catch (err) {
    return { ok: false, error: `LinkedIn service unreachable: ${(err as Error).message}` }
  }
}
