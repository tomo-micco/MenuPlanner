import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // パスエイリアス: @/xxx → src/xxx
      '@': '/src',
    },
  },
  test: {
    // Vitest 設定
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
})
