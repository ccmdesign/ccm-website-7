import { Feed } from 'feed'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { siteUrl, siteName, siteDescription, siteAuthor } = config.public

  const feed = new Feed({
    title: siteName,
    description: siteDescription,
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteName}`,
    feedLinks: { rss2: `${siteUrl}/feed.xml` },
    author: { name: siteAuthor, link: siteUrl }
  })

  // Query published blog posts
  const posts = await queryCollection(event, 'blog')
    .where('published', '=', true)
    .order('date', 'DESC')
    .all()

  // Filter out future posts and drafts
  const today = new Date().toISOString().split('T')[0]
  const publishedPosts = posts.filter(post => {
    return post.date && post.date <= today && !post.path?.includes('/_drafts/')
  })

  // Add posts to feed
  for (const post of publishedPosts) {
    const postUrl = `${siteUrl}${post.path}`
    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      description: post.excerpt || post.tldr || '',
      author: [{ name: post.author || siteAuthor }],
      date: new Date(post.date),
      category: (post.categories || []).map((cat: string) => ({ name: cat }))
    })
  }

  setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=UTF-8')
  return feed.rss2()
})
