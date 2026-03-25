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
  previewUrl?: string
  postUrl?: string
}

function getEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing environment variable: ${key}`)
  return val
}

/**
 * Sends a newsletter for a blog post via the newsletter service (to the full segment).
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

    // Parse preview URL from service response (graceful degradation if absent)
    let previewUrl: string | undefined
    try {
      const data = await res.json()
      previewUrl = data.previewUrl || undefined
    } catch {
      // Service may not return JSON — that's ok
    }

    return { ok: true, previewUrl }
  } catch (err) {
    return { ok: false, error: `Newsletter service unreachable: ${(err as Error).message}` }
  }
}

/**
 * Sends a test newsletter to a single admin email address.
 * Does not send to the full segment — used for previewing before real send.
 */
export async function sendTestNewsletter(post: PostPayload, adminEmail: string): Promise<ServiceResult> {
  const serviceUrl = getEnv('NEWSLETTER_SERVICE_URL')
  const resendApiKey = getEnv('RESEND_API_KEY')

  try {
    const res = await fetch(`${serviceUrl}/send-test`, {
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
        adminEmail,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return { ok: false, error: `Newsletter test service error (${res.status}): ${errorText}` }
    }

    return { ok: true }
  } catch (err) {
    return { ok: false, error: `Newsletter service unreachable: ${(err as Error).message}` }
  }
}

/**
 * Creates a LinkedIn draft post via the LinkedIn service.
 * Returns the draft post URL for later publishing.
 */
export async function draftLinkedInPost(post: PostPayload, marketingContent?: Record<string, unknown>): Promise<ServiceResult> {
  const serviceUrl = getEnv('LINKEDIN_SERVICE_URL')
  const accessToken = getEnv('LINKEDIN_ACCESS_TOKEN')

  try {
    const res = await fetch(`${serviceUrl}/draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: post.title,
        excerpt: post.excerpt,
        url: post.url,
        marketing: marketingContent,
        lifecycleState: 'DRAFT',
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return { ok: false, error: `LinkedIn draft service error (${res.status}): ${errorText}` }
    }

    let postUrl: string | undefined
    try {
      const data = await res.json()
      postUrl = data.postUrl || undefined
    } catch {
      // Service may not return JSON
    }

    return { ok: true, postUrl }
  } catch (err) {
    return { ok: false, error: `LinkedIn service unreachable: ${(err as Error).message}` }
  }
}

/**
 * Publishes an existing LinkedIn draft post.
 * Takes the draft post URL and publishes it.
 */
export async function publishLinkedInPost(postUrl: string): Promise<ServiceResult> {
  const serviceUrl = getEnv('LINKEDIN_SERVICE_URL')
  const accessToken = getEnv('LINKEDIN_ACCESS_TOKEN')

  try {
    const res = await fetch(`${serviceUrl}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        postUrl,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return { ok: false, error: `LinkedIn publish service error (${res.status}): ${errorText}` }
    }

    let updatedPostUrl: string | undefined
    try {
      const data = await res.json()
      updatedPostUrl = data.postUrl || postUrl
    } catch {
      updatedPostUrl = postUrl
    }

    return { ok: true, postUrl: updatedPostUrl }
  } catch (err) {
    return { ok: false, error: `LinkedIn service unreachable: ${(err as Error).message}` }
  }
}
