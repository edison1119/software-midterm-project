import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',

    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('index.html', import.meta.url)),
        login: fileURLToPath(new URL('login.html', import.meta.url)),
        createroom: fileURLToPath(new URL('createroom.html', import.meta.url)),
      },
    },
  },
})

