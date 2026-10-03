// https://nuxt.com/docs/api/configuration/nuxt-config
import { OG_IMAGE_URL, SITE_URL, organizationJsonLd } from './utils/agentContent'

// --- Google Analytics 4 -------------------------------------------------
// Two gates so dev and preview traffic never lands in the production property:
//  1. build-time: only production deploys emit the tag at all (Netlify sets CONTEXT;
//     `nuxt dev` has NODE_ENV=development).
//  2. run-time: even in a production bundle, skip localhost / *.netlify.app hosts.
const GA_ID = 'G-PWP8CD3WD7'
const NETLIFY_CONTEXT = process.env.CONTEXT || ''
const GA_ENABLED =
  process.env.NODE_ENV === 'production'
  && !['deploy-preview', 'branch-deploy', 'dev'].includes(NETLIFY_CONTEXT)
const GA_SNIPPET =
  `(function(){var h=location.hostname;`
  + `if(/^(localhost|127\\.0\\.0\\.1|\\[?::1\\]?)$/.test(h)||/\\.netlify\\.app$/.test(h))return;`
  + `var s=document.createElement('script');s.async=true;`
  + `s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);`
  + `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}`
  + `window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');})();`

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ignore: ['**/_archive/**'],
  watchers: {
    chokidar: {
      ignored: ['**/_archive/**'],
    },
  },
  modules: [
    '@nuxt/content',
    '@tresjs/nuxt',
    '@nuxtjs/seo'
  ],
  css: ['~/assets/styles.css'],
  site: {
    url: SITE_URL,
    name: 'CCM Design',
    description: 'Insights on Design, Data, and Social Impact',
    defaultLocale: 'en'
  },
  // The module was emitting an empty application/ld+json tag, which is invalid JSON.
  schemaOrg: {
    enabled: false,
  },
  runtimeConfig: {
    // Note: Service credentials (RESEND_API_KEY, LINKEDIN_ACCESS_TOKEN, etc.)
    // are read directly via process.env in server/utils/serviceClient.ts because
    // that module is shared with the CLI script (scripts/distribute.ts).
    // Do not duplicate them here — process.env is the single source of truth.
    public: {
      siteUrl: SITE_URL,
      siteName: 'CCM Design',
      siteDescription: 'Insights on Design, Data, and Social Impact',
      siteAuthor: 'CCM Design Team',
      // Exposed to admin UI in dev only so $fetch calls can include the header.
      // In production builds this is always empty (import.meta.dev is false).
      adminApiSecret: import.meta.dev ? (process.env.ADMIN_API_SECRET || '') : '',
    }
  },
  ogImage: {
    enabled: false
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { property: 'og:image', content: OG_IMAGE_URL },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        // google icons
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100..900;1,100..900&display=swap" },
        // RSS feed
        { rel: "alternate", type: "application/rss+xml", title: "CCM Design RSS Feed", href: "/feed.xml" },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(organizationJsonLd),
        },
        ...(GA_ENABLED ? [{ innerHTML: GA_SNIPPET }] : []),
      ],
    }
  },
  build: {
    transpile: ['vue-carousel'],
  },
  plugins: [

  ],
  routeRules: {
    '/admin/**': { ssr: false, prerender: false },
  },
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/feed.xml', '/about', '/contact', '/privacy'],
      ignore: [
        '/blog/**',
        '/blog',
        '/layouts/**',
        '/layouts',
        '/admin',
        '/admin/**'
      ],
      failOnError: false
    }
  },
  components: [
    { path: '~/components', pathPrefix: false, global: true }
  ],
  postcss: {
    plugins: {
      'postcss-import': {},
      'postcss-preset-env': {
        stage: 2,
        autoprefixer: { grid: 'autoplace' },
        features: {
          'nesting-rules': true,
          'cascade-layers': false
        }
      }
    }
  },
  vite: {
    server: {
      watch: {
        ignored: ['**/_archive/**'],
      },
    },
    build: {
      target: 'es2020'
    }
  },
})
