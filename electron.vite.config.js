import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config({ path: resolve(__dirname, '.env') })
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '~bootstrap': resolve(__dirname, 'node_modules/bootstrap')
      }
    },
    plugins: [react()],
    define: {
      'process.env': {
        VITE_BACKEND_URL: process.env.VITE_BACKEND_URL
      }
    }
  }
})
