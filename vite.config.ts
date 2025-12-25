import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 重要：支持 Electron 相对路径加载
  build: {
    outDir: 'dist'
  }
})
