// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {FlatCompat} from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Note! it does not work if only core-web-vitals are used
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // add custom rules
  {
    rules: {
      'no-debugger': 'warn',
      'no-console': 'warn',
      // use direct imports on material-ui to improve
      // performance in unit tests with jest
      // see https://blog.bitsrc.io/why-is-my-jest-suite-so-slow-2a4859bb9ac0
      'no-restricted-imports': ['warn', {
        name: '@mui/material',
        message: 'Please use "import foo from \'@mui/material/foo\'" instead.',
      }],
      // do not warn for use of img element
      '@next/next/no-img-element': 'off',

      // warn only on these rules
      '@typescript-eslint/no-empty-object-type' :'warn',
      '@typescript-eslint/prefer-as-const':'warn',
      '@typescript-eslint/no-unused-expressions':'warn',
      '@typescript-eslint/no-unsafe-function-type':'warn',
      '@typescript-eslint/no-unused-vars':'warn',
      'prefer-const':'warn',
      'no-var':'warn',

      // ---------------------------------------
      // disable specific typescript rules
      '@typescript-eslint/no-explicit-any':'off',

      // ---------------------------------------
      // FORMATTING (this rules are deprecated)
      // These will be removed in next major version v10
      'eol-last': ['warn', 'always'],
      'quotes': ['warn', 'single'],
      'semi': ['warn', 'never'],
      'indent': ['warn', 2, {
        SwitchCase: 1,
      }],
      'no-trailing-spaces': 'warn',
      'no-multi-spaces': 'warn',
      'no-multiple-empty-lines': 'warn',
      'object-curly-spacing': ['warn', 'never'],
      'array-bracket-spacing': ['warn', 'never'],
      // ---------------------------------------
    },
  }
]

export default eslintConfig
