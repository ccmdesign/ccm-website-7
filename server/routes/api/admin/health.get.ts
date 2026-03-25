// Nitro auto-imports from server/utils/ — no explicit imports needed.
// Health-check endpoint for the admin UI to verify service connectivity.
//
// Error messages intentionally include raw fetch error details (hostnames, ports,
// DNS errors) because this endpoint is dev-only (import.meta.dev guard) and the
// detailed output helps developers diagnose connectivity issues quickly.
// The endpoint is tree-shaken from production builds by Vite.

/**
 * Check connectivity to an external service by sending a HEAD request.
 * Treats 2xx and 405 (Method Not Allowed — expected for HEAD on POST-only
 * endpoints) as healthy. Treats 4xx (401, 403, 404) as configuration errors
 * so the admin UI correctly surfaces credential or URL problems.
 */
async function checkServiceConnectivity(
  envKey: string,
): Promise<{ ok: boolean; error?: string }> {
  const url = process.env[envKey]
  if (!url) {
    return { ok: false, error: `${envKey} not set` }
  }
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(3000) })
    // 2xx = healthy, 405 = expected when HEAD-probing a POST-only endpoint
    const ok = res.ok || res.status === 405
    if (!ok) {
      return { ok: false, error: `Unexpected status ${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: `Unreachable: ${(err as Error).message}` }
  }
}

/**
 * Check that an env var is set (without revealing its value).
 */
function checkEnvVar(envKey: string): { ok: boolean; error?: string } {
  if (process.env[envKey]) {
    return { ok: true }
  }
  return { ok: false, error: `${envKey} not set` }
}

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

  const checks: Record<string, { ok: boolean; error?: string }> = {}

  // Service connectivity checks
  checks.newsletter = await checkServiceConnectivity('NEWSLETTER_SERVICE_URL')
  checks.linkedin = await checkServiceConnectivity('LINKEDIN_SERVICE_URL')

  // Required env var checks (without revealing values)
  checks.resendApiKey = checkEnvVar('RESEND_API_KEY')
  checks.linkedinToken = checkEnvVar('LINKEDIN_ACCESS_TOKEN')

  const allOk = Object.values(checks).every((c) => c.ok)

  return { ok: allOk, checks }
})
