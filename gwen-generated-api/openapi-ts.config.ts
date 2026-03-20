// openapi-ts.config.ts
import { defineConfig } from '@hey-api/openapi-ts';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  input: resolve(__dirname, './openapi.json'),
  output: {
    path: resolve(__dirname, './src/generated'),
    format: 'prettier',
  },
  plugins: ['@hey-api/typescript', '@hey-api/services'],
});
