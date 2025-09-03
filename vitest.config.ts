import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './tests/setup.ts'
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './'),
      '@': resolve(__dirname, './'),
      '#components': resolve(__dirname, './components'),
      '#app': resolve(__dirname, './tests/mocks/nuxt-app.ts')
    }
  }
})