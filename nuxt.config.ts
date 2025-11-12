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
    '@nuxt/content'
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
        { rel: "stylesheet", href: "https://cloud.typography.com/7264818/6341032/css/fonts.css" },
        { rel: "stylesheet", href: "https://use.typekit.net/hzz7acw.css" },
      ],
      script: [],
    }
  },
  css: [
    'public/css/styles.css'
  ],
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
  experimental: {
    clientFallback: true
  },
  components: [
    { path: '~/components', pathPrefix: false, global: true }
  ],
})
