import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

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
      })
    }),
    services: defineCollection({
      type: 'page',
      source: 'services/*.md',
      schema: z.object({
        // Adding a basic schema for services as well
        status: z.string().optional()
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
    })
  }
})
