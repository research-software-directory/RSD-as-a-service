// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import nextConfig from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import stylistic from '@stylistic/eslint-plugin'
import {defineConfig, globalIgnores} from 'eslint/config'

export default defineConfig([
  // 1. Next.js & TypeScript base configs (Flat Config native)
  ...nextConfig,
  ...nextTypescript,

  // 2. Global Ignores (Replaces previous 'ignores' object)
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '__tests__/**'
  ]),

  // 3. Stylistic & Formatting Rules (Replaces deprecated core rules)
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/eol-last': ['warn', 'always'],
      '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/semi': ['warn', 'never'],
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/no-multi-spaces': 'warn',
      '@stylistic/no-multiple-empty-lines': 'warn',
      '@stylistic/object-curly-spacing': ['warn', 'never'],
      '@stylistic/array-bracket-spacing': ['warn', 'never'],
      // Added back your indent rule safely
      '@stylistic/indent': ['warn', 2, {SwitchCase: 1}],
    }
  },

  // 4. Custom Logic & Overrides
  {
    rules: {
      'no-debugger': 'warn',
      'no-console': 'warn',
      'no-restricted-imports': ['warn', {
        name: '@mui/material',
        message: 'Please use "import foo from \'@mui/material/foo\'" instead.',
      }],

      // TypeScript specific warnings
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',

      // Overrides
      '@typescript-eslint/no-explicit-any': 'off',
      '@next/next/no-img-element': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/set-state-in-effect': 'off'
    }
  }
])
