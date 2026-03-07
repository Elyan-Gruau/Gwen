import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'gwen-common': fileURLToPath(new URL('../gwen-common/src/index.ts', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
    preserveSymlinks: true,
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
});
