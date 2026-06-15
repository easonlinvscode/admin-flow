import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ command }) => ({
  // GitHub Pages 部署在 https://<user>.github.io/admin-flow/，
  // 所以 production build 時要加上 repo 名稱作為 base path；
  // 本機開發（dev server）維持 '/' 即可。
  base: command === 'build' ? '/admin-flow/' : '/',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "sass:color";\n@use "@/styles/variables.scss" as *;\n`,
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'axios'],
          'element-plus': ['element-plus'],
          echarts: ['echarts'],
        },
      },
    },
    minify: 'terser',
  },
}))