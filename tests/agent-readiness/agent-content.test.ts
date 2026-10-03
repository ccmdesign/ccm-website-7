import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import handler from '../../netlify/edge-functions/markdown-negotiate'
import {
  CONTACT_EMAIL,
  MARKDOWN_CONTENT_TYPE,
  SITE_URL,
  VARY_ACCEPT,
  aboutPage,
  agentInstructions,
  classifyAgentRequest,
  contactPage,
  homeMarkdown,
  homePlainText,
  llmsTxt,
  markdownForUpstreamMiss,
  negotiate,
  notFoundMarkdown,
  organizationJsonLd,
  pagePlainText,
  privacyPage,
} from '../../utils/agentContent'

const CHROME_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'

describe('markdown negotiation', () => {
  it('serves markdown only when it outranks html', () => {
    expect(negotiate('text/markdown', ['text/html', 'text/markdown'])).toBe('text/markdown')
    expect(negotiate('text/markdown, text/html;q=0.8', ['text/html', 'text/markdown'])).toBe('text/markdown')
    expect(negotiate('text/html', ['text/html', 'text/markdown'])).toBe('text/html')
    expect(negotiate('text/markdown;q=0, text/html', ['text/html', 'text/markdown'])).toBe('text/html')
    expect(negotiate('text/markdown;q=0', ['text/html', 'text/markdown'])).toBeNull()
    expect(negotiate(null, ['text/html', 'text/markdown'])).toBe('text/html')
    expect(negotiate('*/*', ['text/html', 'text/markdown'])).toBe('text/html')
    expect(negotiate(CHROME_ACCEPT, ['text/html', 'text/markdown'])).toBe('text/html')
  })

  it('returns a markdown homepage and leaves html requests alone', () => {
    const markdown = classifyAgentRequest({
      method: 'GET',
      pathname: '/',
      accept: 'text/markdown',
    })
    expect(markdown).toMatchObject({ action: 'markdown', status: 200 })
    if (markdown.action === 'markdown') {
      expect(markdown.body.length).toBeGreaterThan(500)
      expect(markdown.body.startsWith('# CCM Design')).toBe(true)
    }

    expect(classifyAgentRequest({
      method: 'GET',
      pathname: '/',
      accept: 'text/html',
    })).toEqual({ action: 'delegate' })

    expect(classifyAgentRequest({
      method: 'GET',
      pathname: '/assets/ccm-logo.svg',
      accept: 'text/markdown',
    })).toEqual({ action: 'delegate' })
  })

  it('keeps HTTP 404 and returns a markdown error with a recovery link', () => {
    expect(classifyAgentRequest({
      method: 'GET',
      pathname: '/__ora-404-probe',
      accept: 'text/markdown',
    })).toEqual({ action: 'check-upstream' })

    const miss = markdownForUpstreamMiss('/__ora-404-probe', 404)
    expect(miss?.status).toBe(404)
    expect(miss?.body.length).toBeGreaterThan(20)
    expect(miss?.body).toContain(`${SITE_URL}/llms.txt`)
    expect(miss?.body).toContain(`${SITE_URL}/sitemap.xml`)
    expect(markdownForUpstreamMiss('/blog', 200)).toBeNull()
    expect(MARKDOWN_CONTENT_TYPE.startsWith('text/markdown')).toBe(true)
    expect(VARY_ACCEPT).toBe('Accept')
    expect(notFoundMarkdown('/missing').includes('404')).toBe(true)
  })

  it('runs the edge handler: markdown home, html home, markdown 404', async () => {
    const home = await handler(
      new Request('https://ccmdesign.ca/', { headers: { accept: 'text/markdown' } }),
      { next: async () => { throw new Error('homepage markdown must not fall through') } },
    )
    expect(home.status).toBe(200)
    expect(home.headers.get('content-type')).toContain('text/markdown')
    expect(home.headers.get('vary')).toBe('Accept')
    expect(await home.text()).toContain('# CCM Design')

    const html = await handler(
      new Request('https://ccmdesign.ca/', { headers: { accept: 'text/html' } }),
      { next: async () => new Response('<html>ok</html>', { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }) },
    )
    expect(html.status).toBe(200)
    expect(html.headers.get('content-type')).toContain('text/html')
    expect(await html.text()).toContain('<html>ok</html>')

    const missing = await handler(
      new Request('https://ccmdesign.ca/__ora-404-probe-2qr4v2z4', { headers: { accept: 'text/markdown' } }),
      { next: async () => new Response('<html>missing</html>', { status: 404, headers: { 'content-type': 'text/html' } }) },
    )
    const body = await missing.text()
    expect(missing.status).toBe(404)
    expect(missing.headers.get('content-type')).toContain('text/markdown')
    expect(missing.headers.get('vary')).toBe('Accept')
    expect(body.length).toBeGreaterThan(20)
    expect(body).toContain('https://ccmdesign.ca/llms.txt')
    expect(body).not.toContain('<html>missing</html>')
  })
})

describe('agent instructions', () => {
  it('puts when-to-use guidance in llms.txt without breaking the file-list spec', () => {
    const file = readFileSync(resolve('public/llms.txt'), 'utf8')
    expect(file).toBe(llmsTxt)
    expect(file.startsWith('# CCM Design\n')).toBe(true)
    expect(file).toMatch(/^> /m)
    expect(file.toLowerCase()).toContain('when to use this')
    expect(file).toContain('design subscription')
    expect(file).toContain('Accept: text/markdown')

    const firstH2 = file.indexOf('\n## ')
    const preamble = file.slice(0, firstH2)
    expect(preamble.includes('\n# ')).toBe(false)
    expect(preamble.slice(1).includes('\n## ')).toBe(false)

    const sections = file.split('\n## ').slice(1)
    expect(sections.length).toBeGreaterThan(0)
    for (const section of sections) {
      const items = section.split('\n').filter((line) => line.startsWith('- '))
      expect(items.length).toBeGreaterThan(0)
      for (const item of items) {
        expect(item).toMatch(/^- \[[^\]]+\]\(https:\/\/ccmdesign\.ca\/[^)]+\)/)
      }
    }
  })

  it('publishes a dedicated agent-instructions file', () => {
    const file = readFileSync(resolve('public/agent-instructions.md'), 'utf8')
    expect(file).toBe(agentInstructions)
    expect(file).toMatch(/^## When to use this$/m)
    expect(file).toContain(CONTACT_EMAIL)
    expect(file).toContain('Accept: text/markdown')
  })
})

describe('trust pages and organization schema', () => {
  it('gives about, contact, and privacy at least 500 characters each', () => {
    expect(pagePlainText(aboutPage).length).toBeGreaterThanOrEqual(500)
    expect(pagePlainText(contactPage).length).toBeGreaterThanOrEqual(500)
    expect(pagePlainText(privacyPage).length).toBeGreaterThanOrEqual(500)
    expect(homePlainText().length).toBeGreaterThanOrEqual(500)
    expect(homeMarkdown()).toContain('## A studio for knowledge products')
  })

  it('emits valid Organization JSON-LD with contactPoint and PostalAddress', () => {
    const parsed = JSON.parse(JSON.stringify(organizationJsonLd))
    expect(parsed['@context']).toBe('https://schema.org')
    expect(parsed['@type']).toBe('Organization')
    expect(parsed.name).toBe('CCM Design')
    expect(parsed.url).toBe(SITE_URL)
    expect(parsed.description.length).toBeGreaterThan(20)
    expect(parsed.address['@type']).toBe('PostalAddress')
    expect(parsed.address.addressCountry).toBe('CA')
    expect(parsed.contactPoint['@type']).toBe('ContactPoint')
    expect(parsed.contactPoint.contactType.length).toBeGreaterThan(0)
    expect(parsed.contactPoint.email).toBe(CONTACT_EMAIL)
    expect(parsed.sameAs.length).toBeGreaterThan(0)
  })
})
