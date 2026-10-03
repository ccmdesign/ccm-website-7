import {
  MARKDOWN_CONTENT_TYPE,
  VARY_ACCEPT,
  classifyAgentRequest,
  markdownForUpstreamMiss,
} from '../../utils/agentContent.ts'

const MARKDOWN_HEADERS = {
  'content-type': MARKDOWN_CONTENT_TYPE,
  vary: VARY_ACCEPT,
}

export default async function handler(
  request: Request,
  context: { next: () => Promise<Response> },
): Promise<Response> {
  const url = new URL(request.url)
  const decision = classifyAgentRequest({
    method: request.method,
    pathname: url.pathname,
    accept: request.headers.get('accept'),
  })

  if (decision.action === 'delegate') return context.next()

  if (decision.action === 'markdown') {
    return new Response(request.method === 'HEAD' ? null : decision.body, {
      status: decision.status,
      headers: MARKDOWN_HEADERS,
    })
  }

  const upstream = await context.next()
  const miss = markdownForUpstreamMiss(url.pathname, upstream.status)
  if (!miss) return upstream

  return new Response(request.method === 'HEAD' ? null : miss.body, {
    status: miss.status,
    headers: MARKDOWN_HEADERS,
  })
}

export const config = {
  path: '/*',
  excludedPath: ['/_nuxt/*', '/assets/*', '/.netlify/*'],
}
