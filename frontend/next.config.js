// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/** @type {import('next').NextConfig} */

const rewritesConfig = require('./next.rewrites')
const securityHeaders = require('./next.headers')

module.exports = {
  // create standalone output to use in docker image
  // and achieve minimal image size (see Dockerfile)
  output: 'standalone',
  // disable strict mode if you want react to render compent once
  // see for more info https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: false,
  eslint: {
    // Run ESLint in these directories during production builds (next build)
    // by default next runs linter only in pages/, components/, and lib/
    dirs: ['auth', 'components', 'config', 'pages', 'styles', 'types', 'utils']
  },
  // only in development
  rewrites: async () => rewritesConfig,

  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}
