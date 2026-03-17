# OpenAPI Specifications

This directory contains the OpenAPI 3.0.0 specification for the Gwen API, automatically generated from the server's JSDoc comments.

## Files

- **openapi.json** - Complete OpenAPI specification

Generated from: `gwen-server/src/features/*/resources/*.ts`

## Usage

This specification is used to:

1. Generate TypeScript client types and APIs
2. Document the API endpoints
3. Track API changes across versions
4. Provide OpenAPI-compatible tooling integration

## Regeneration

The spec is automatically regenerated when you build:

```bash
npm run build --workspace=gwen-server
npm run build --workspace=gwen-generated-api
```

The `scripts/generate-openapi.js` script:

1. Compiles the server
2. Generates this OpenAPI spec from JSDoc comments
3. Uses it to generate client source files

## Version History

This file is committed to git to track API evolution over time.
