# Gwen Generated API

Auto-generated API client and DTOs for the Gwen game server, built from the OpenAPI specification.

## How It Works

### Generation Process

1. **OpenAPI Spec Generation**: `npm run build --workspace=gwen-server` compiles the server and generates the OpenAPI spec from JSDoc comments
2. **API Client Generation**: `npm run generate-api` runs the generation script that creates TypeScript source files
3. **Source Compilation**: `npm run build --workspace=gwen-generated-api` triggers `prebuild` script which regenerates sources, then compiles to `dist/`

### Project Structure

```
src/
├── client.ts              ✅ MANUALLY MAINTAINED (committed to git)
├── index.ts               ✅ MANUALLY MAINTAINED (committed to git)
├── dtos/                  ⚠️ AUTO-GENERATED (NOT committed)
│   ├── auth.dto.ts
│   ├── user-faction-deck.dto.ts
│   └── index.ts
└── apis/                  ⚠️ AUTO-GENERATED (NOT committed)
    ├── auth.api.ts
    ├── user-faction-deck.api.ts
    └── index.ts

dist/                       ✅ Compiled output (can be committed for CI/CD)
```

## Usage

### Install & Build

```bash
# Build everything in order
npm run build

# Or individually
npm run build --workspace=gwen-server
npm run build --workspace=gwen-generated-api
```

### In Your React App

```typescript
import { GwenApiClient } from 'gwen-generated-api';

const apiClient = new GwenApiClient('http://localhost:3000/api');

// Login
const auth = await apiClient.auth.login({
  username: 'player1',
  password: 'password123',
});

// Set token for all requests
apiClient.setToken(auth.token);

// Fetch decks
const decks = await apiClient.userFactionDeck.getUserFactionDecks(userId);
```

## When to Regenerate

You need to regenerate when:

- ✅ You update API endpoints in `gwen-server`
- ✅ You modify request/response DTOs in the OpenAPI spec
- ✅ You add JSDoc comments to new routes

You DON'T need to regenerate when:

- ❌ You modify `src/client.ts` (custom logic)
- ❌ You modify `src/index.ts` (exports)

## Version Control

### Committed Files
- `src/client.ts` - Custom client wrapper
- `src/index.ts` - Exports
- `dist/` - Compiled output (for reproducible builds)
- `package.json`, `tsconfig.json`, `README.md`

### NOT Committed Files
- `src/dtos/` - Auto-generated from server
- `src/apis/` - Auto-generated from server
- `node_modules/` - Installed dependencies
- `*.tsbuildinfo` - Build cache

### Why This Approach?

- **Reduces merge conflicts**: Generated files aren't committed
- **Single source of truth**: Server OpenAPI spec is authoritative
- **Type safety maintained**: DTOs are always in sync with server
- **Easy to update**: Run build and generated files update automatically
- **Clean git history**: Only manually maintained code appears in commits

## Troubleshooting

### Generated files not updating?

```bash
npm run clean --workspace=gwen-generated-api
npm run build --workspace=gwen-generated-api
```

### Missing DTOs or APIs?

Check that:
1. The endpoint is documented in the server with JSDoc comments
2. Server was built: `npm run build --workspace=gwen-server`
3. Run generation script: `npm run generate-api`

### Build fails?

```bash
# Rebuild everything from scratch
npm run clean --workspace=gwen-server
npm run clean --workspace=gwen-generated-api
npm run build
```


