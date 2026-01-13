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
    '@tresjs/nuxt'
  ],
  runtimeConfig: {
    public: {
    }
  },
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },],
      link: [
        // google icons
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100..900;1,100..900&display=swap" },
        // project styles
        { rel: "stylesheet", href: "/css/styles.css" },
      ],
      script: [],
    }
  },
  build: {
    transpile: ['vue-carousel'],
  },
  vite: {
    server: {
      watch: {
        ignored: ['**/_archive/**'],
      },
    },
  },
  plugins: [

  ],
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      ignore: [
        '/blog/**',
        '/blog',
        '/layouts/**',
        '/layouts'
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
        stage: 1,
        features: {
          'nesting-rules': true
        }
      }
    }
  }
})
