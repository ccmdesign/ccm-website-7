// https://nuxt.com/docs/api/configuration/nuxt-config
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
    url: 'https://ccmdesign.com',
    name: 'CCM Design',
    description: 'Insights on Design, Data, and Social Impact',
    defaultLocale: 'en'
  },
  runtimeConfig: {
    // Note: Service credentials (RESEND_API_KEY, LINKEDIN_ACCESS_TOKEN, etc.)
    // are read directly via process.env in server/utils/serviceClient.ts because
    // that module is shared with the CLI script (scripts/distribute.ts).
    // Do not duplicate them here — process.env is the single source of truth.
    public: {
      siteUrl: 'https://ccmdesign.com',
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
        { name: "viewport", content: "width=device-width, initial-scale=1" },],
      link: [
        // google icons
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100..900;1,100..900&display=swap" },
        // RSS feed
        { rel: "alternate", type: "application/rss+xml", title: "CCM Design RSS Feed", href: "/feed.xml" },
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-PWP8CD3WD7',
          async: true
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PWP8CD3WD7');
          `
        }
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
      routes: ['/', '/feed.xml'],
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
