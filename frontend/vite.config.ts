import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';


// https://vite.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), tailwindcss(),],
  server: {
    host: 'localhost',
    port: 3001,
    hmr: {
      host: 'localhost',
      port: 3001,
    },
  },
  build: {
    outDir: 'dist',
  },
})
