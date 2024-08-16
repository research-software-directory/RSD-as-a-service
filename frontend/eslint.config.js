// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

module.exports =  [
  {
    rules: {
      'no-debugger': 'warn',
      'no-console': 'warn',
      // use direct imports on material-ui to improve
      // performance in unit tests with jest
      // see https://blog.bitsrc.io/why-is-my-jest-suite-so-slow-2a4859bb9ac0
      'no-restricted-imports': [
        'warn',
        {
          'name': '@mui/material',
          'message': 'Please use "import foo from \'@mui/material/foo\'" instead.'
        }
      ],
      // do not warn for use of img element
      '@next/next/no-img-element': 'off',
    }
  }
]
