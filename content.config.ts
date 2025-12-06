import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

const serviceSlugs = [
  'branding',
  'design-subscription',
  'interface-design-and-development',
  'publication-in-30-days',
  'splashpage-in-a-week',
] as const

const serviceSlugEnum = z.enum(serviceSlugs)

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        published: z.boolean().default(true)
      })
    }),
    casestudies: defineCollection({
      type: 'page',
      source: 'case-studies/*.md',
      schema: z.object({
        published: z.boolean().default(true),
        client: z.string().optional(),
        clientId: z.string().optional()
      })
    }),
    clients: defineCollection({
      type: 'page',
      source: 'clients/*.md',
      schema: z.object({
        name: z.string(),
        logo: z.string().optional(),
        client_logo: z.string().optional(),
        logo_scale: z.number().optional(),
        featured: z.boolean().optional(),
        published: z.boolean().default(true),
        order: z.number().optional()
      })
    }),
    services: defineCollection({
      type: 'page',
      source: 'services/*.md',
      schema: z.object({
        published: z.boolean().default(true),
        order: z.number().optional()
      })
    }),
    components: defineCollection({
      type: 'page',
      source: 'components/*.md',
      schema: z.object({
        category: z.string(),
        props: z.array(z.object({
          name: z.string(),
          type: z.string(),
          default: z.string().optional(),
          required: z.boolean().optional(),
          description: z.string()
        })).optional(),
        slots: z.array(z.object({
          name: z.string(),
          description: z.string()
        })).optional(),
        examples: z.array(z.object({
          title: z.string(),
          code: z.string()
        })).optional(),
        order: z.number().optional()
      })
    }),
    work: defineCollection({
      type: 'page',
      source: 'work/*.md',
      schema: z.object({
        published: z.boolean().default(true),
        title: z.string(),
        client: z.string(),
        'client-slug': z.string().optional(),
        description: z.string(),
        tags: z.array(z.string()).optional(),
        projectType: z.enum(['Editorial', 'Logo', 'Web']).optional(),
        services: z.array(serviceSlugEnum).optional(),
        featured: z.boolean().optional(),
        order: z.number().optional(),
        items: z.array(z.union([
          z.object({
            type: z.literal('image'),
            image: z.string(),
            title: z.string().optional(),
            caption: z.string().optional(),
            mockupType: z.enum(['web', 'editorial', 'branding']).optional(),
            cover: z.boolean().optional()
          }),
          z.object({
            type: z.literal('text'),
            content: z.string(),
            heading: z.string().optional()
          })
        ]))
      })
    })
  }
})
