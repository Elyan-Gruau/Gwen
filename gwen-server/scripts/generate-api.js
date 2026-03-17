#!/usr/bin/env node

/**
 * Script to generate OpenAPI spec and update gwen-generated-api package
 * This script should be run after updating the server API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the compiled swagger config
const { specs } = await import('../dist/config/swagger.js');

// Create the openapi directory if it doesn't exist
const openApiDir = path.join(__dirname, '../openapi');
if (!fs.existsSync(openApiDir)) {
  fs.mkdirSync(openApiDir, { recursive: true });
}

// Write the OpenAPI spec to a file
const specPath = path.join(openApiDir, 'openapi.json');
fs.writeFileSync(specPath, JSON.stringify(specs, null, 2));

console.log(`✅ OpenAPI specification generated at: ${specPath}`);

// Update generated-api package version (optional)
const generatedApiPackageJson = path.join(__dirname, '../../gwen-generated-api/package.json');
if (fs.existsSync(generatedApiPackageJson)) {
  const packageJson = JSON.parse(fs.readFileSync(generatedApiPackageJson, 'utf-8'));
  const timestamp = new Date().toISOString().split('T')[0];
  packageJson.lastUpdated = timestamp;
  fs.writeFileSync(generatedApiPackageJson, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Updated gwen-generated-api metadata`);
}

console.log('✅ API generation complete!');
