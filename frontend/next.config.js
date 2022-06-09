// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/** @type {import('next').NextConfig} */

// proxy to localhost when NOT in production mode
const isDevelopment = process.env.NODE_ENV !== 'production'
const rewritesConfig = isDevelopment
  ? [
    {
      source: '/image/:path*',
      destination: 'http://localhost/image/:path*',
    },
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost/api/v1/:path*',
    },
    {
      source: '/auth/login/local',
      destination: 'http://localhost/auth/login/local',
    },
  ]
  : []

module.exports = {
  reactStrictMode: true,
  eslint: {
    // Run ESLint in these directories during production builds (next build)
    // by default next runs linter only in pages/, components/, and lib/
    dirs: ['auth', 'components', 'config', 'pages', 'styles', 'types', 'utils']
  },
  // only in development
  rewrites: async () => rewritesConfig,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}
