import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './openapi.json',
  output: {
    path: './src/generated',
    format: 'prettier',
    lint: 'eslint',
  },
  plugins: [
    '@hey-api/typescript', // generate dtos
    '@hey-api/services', // generate apis objects
    // '@tanstack/react-query', // generate hooks
  ],
});
