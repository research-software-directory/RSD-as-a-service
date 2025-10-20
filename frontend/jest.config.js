// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

// import does not work, so we need to use require here
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: '.',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // moduleDirectories: ['./node_modules', './frontend'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  // increase default timeout from 5 to 10sec
  testTimeout: 10 * 1000,
  // reduce maximum of parallel tests
  maxWorkers: '50%',
  // use only files with *.test.js
  testMatch: [
    '**/*.test.{js,jsx,ts,tsx}'
  ],
  // coverage only from specific folders
  collectCoverageFrom: [
    './app/**/*.{js,jsx,ts,tsx}',
    './auth/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './config/**/*.{js,jsx,ts,tsx}',
    './utils/**/*.{js,jsx,ts,tsx}',
    '!./utils/jest/**'
  ],
  // if using TypeScript with a baseUrl set to the root directory
  // then you need the below for alias' to work
  // moduleDirectories: ['node_modules', '<rootDir>/'],

  moduleNameMapper: {
    // need to map d3 to avoid SyntaxError: Unexpected token 'export'
    'd3': '<rootDir>/node_modules/d3/dist/d3.min.js',
    // mock svg imports, it seems that webpack config with svgr in next.config.js
    // doesn't work with next swc compiler and this jest.config.js?!?
    '^.+\\.(svg)$': '<rootDir>/utils/jest/mockSvgFile.js',
    // Wildcard module name mapper MUST BE at the botton of this list
    '~/(.*)$': '<rootDir>/$1',
  },

  // ignore .next folder
  modulePathIgnorePatterns: ['.next'],
  // d3 solution that does not work
  // transformIgnorePatterns: ['/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
