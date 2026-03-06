import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import {defineConfig, globalIgnores} from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.ts'],
        ignores: ['**/index.ts'],
        extends: [js.configs.recommended, tseslint.configs.recommended],
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'ImportDeclaration[source.value=/\\.(ts|js)$/]',
                    message: 'Do not include file extensions (.ts, .js) in imports.',
                },
            ],
        },
    },
])

