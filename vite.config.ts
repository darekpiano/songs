import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/songs/',
  plugins: [react()],
  assetsInclude: ['**/*.yaml'],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
})
