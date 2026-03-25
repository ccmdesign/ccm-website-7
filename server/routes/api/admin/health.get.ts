// Nitro auto-imports from server/utils/ — no explicit imports needed.
// Health-check endpoint for the admin UI to verify service connectivity.

export default defineEventHandler(async () => {
  // Block access in production builds
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const checks: Record<string, { ok: boolean; error?: string }> = {}

  // Check newsletter service connectivity
  const newsletterUrl = process.env.NEWSLETTER_SERVICE_URL
  if (newsletterUrl) {
    try {
      const res = await fetch(newsletterUrl, { method: 'HEAD', signal: AbortSignal.timeout(3000) })
      checks.newsletter = { ok: res.ok || res.status < 500 }
    } catch (err) {
      checks.newsletter = { ok: false, error: `Unreachable: ${(err as Error).message}` }
    }
  } else {
    checks.newsletter = { ok: false, error: 'NEWSLETTER_SERVICE_URL not set' }
  }

  // Check LinkedIn service connectivity
  const linkedinUrl = process.env.LINKEDIN_SERVICE_URL
  if (linkedinUrl) {
    try {
      const res = await fetch(linkedinUrl, { method: 'HEAD', signal: AbortSignal.timeout(3000) })
      checks.linkedin = { ok: res.ok || res.status < 500 }
    } catch (err) {
      checks.linkedin = { ok: false, error: `Unreachable: ${(err as Error).message}` }
    }
  } else {
    checks.linkedin = { ok: false, error: 'LINKEDIN_SERVICE_URL not set' }
  }

  // Check required env vars (without revealing values)
  checks.resendApiKey = { ok: !!process.env.RESEND_API_KEY }
  if (!process.env.RESEND_API_KEY) {
    checks.resendApiKey.error = 'RESEND_API_KEY not set'
  }

  checks.linkedinToken = { ok: !!process.env.LINKEDIN_ACCESS_TOKEN }
  if (!process.env.LINKEDIN_ACCESS_TOKEN) {
    checks.linkedinToken.error = 'LINKEDIN_ACCESS_TOKEN not set'
  }

  const allOk = Object.values(checks).every((c) => c.ok)

  return { ok: allOk, checks }
})
