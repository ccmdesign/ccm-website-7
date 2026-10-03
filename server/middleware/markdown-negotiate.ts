import {
  MARKDOWN_CONTENT_TYPE,
  VARY_ACCEPT,
  classifyAgentRequest,
} from '../../utils/agentContent'

export default defineEventHandler((event) => {
  const decision = classifyAgentRequest({
    method: event.method,
    pathname: getRequestURL(event).pathname,
    accept: getRequestHeader(event, 'accept'),
  })
  if (decision.action !== 'markdown') return

  setResponseStatus(event, decision.status)
  setResponseHeader(event, 'content-type', MARKDOWN_CONTENT_TYPE)
  setResponseHeader(event, 'vary', VARY_ACCEPT)
  return decision.body
})
