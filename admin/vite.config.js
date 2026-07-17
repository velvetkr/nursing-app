import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5174,
    watch: {
      ignored: ['**/.codex-tmp/**'],
    },
    proxy: {
      '/backend': {
        target: 'http://192.168.57.85',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
