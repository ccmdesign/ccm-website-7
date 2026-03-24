import type { Handler, HandlerEvent } from '@netlify/functions'

const ALLOWED_ORIGIN = 'https://ccmdesign.com'

// Basic email validation regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function corsHeaders(origin?: string) {
  // In development, allow any origin; in production, restrict to the site domain
  const allowedOrigin =
    origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))
      ? origin
      : ALLOWED_ORIGIN

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function safeErrorMessage(status: number): string {
  if (status === 409) return 'This email is already subscribed.'
  if (status === 422) return 'Invalid email address.'
  if (status === 429) return 'Too many requests. Please try again later.'
  return 'Subscription failed. Please try again later.'
}

export const handler: Handler = async (event: HandlerEvent) => {
  const origin = event.headers.origin || event.headers.Origin

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(origin), body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  let email: string
  try {
    const body = JSON.parse(event.body || '{}')
    email = body.email
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: 'Invalid request body' }),
    }
  }

  if (!email || !EMAIL_RE.test(email)) {
    return {
      statusCode: 400,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: 'A valid email address is required.' }),
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    console.error('Missing RESEND_API_KEY or RESEND_AUDIENCE_ID env vars')
    return {
      statusCode: 500,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: 'Server configuration error.' }),
    }
  }

  try {
    const res = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, audience_id: audienceId }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Resend API error (${res.status}):`, errorText)
      return {
        statusCode: res.status,
        headers: corsHeaders(origin),
        body: JSON.stringify({ error: safeErrorMessage(res.status) }),
      }
    }

    return {
      statusCode: 200,
      headers: corsHeaders(origin),
      body: JSON.stringify({ success: true }),
    }
  } catch (err) {
    console.error('Resend API call failed:', err)
    return {
      statusCode: 500,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: 'Subscription failed. Please try again later.' }),
    }
  }
}

// Netlify rate limiting: 10 requests per 60 seconds per IP
export const config = {
  rateLimit: {
    windowLimit: 10,
    windowSize: 60,
    aggregateBy: ['ip'],
  },
}
