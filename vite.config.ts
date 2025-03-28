import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: '/songs/',
  plugins: [react()],
  assetsInclude: ['**/*.yaml'],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.yaml')) {
            return '[name][extname]'
          }
        }
      }
    }
  }
})
