import { defineConfig } from 'orval';

export default defineConfig({
  gwen: {
    input: './openapi.json',
    output: {
      target: './src/generated/api.ts',
      schemas: './src/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/mutator/axios.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
