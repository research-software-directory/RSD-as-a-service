// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

/** @type {import('next').NextConfig} */
import type {NextConfig} from 'next'

import rewritesConfig from './next.rewrites'
import securityHeaders from './next.headers'

const nextConfig: NextConfig = {
// module.exports = {
  // create standalone output to use in docker image
  // and achieve minimal image size (see Dockerfile)
  output: 'standalone',
  // enable source maps in production?
  productionBrowserSourceMaps: true,
  // disable strict mode if you want react to render component once
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

  // default redirects
  async redirects() {
    return [
      // community default page
      {
        source: '/communities/:slug',
        destination: '/communities/:slug/software',
        permanent: true,
      },
      // profile default page
      {
        source: '/profile/:orcid',
        destination: '/profile/:orcid/software',
        permanent: true,
      },
    ]
  },
  // turbopack config https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack
  turbopack: {
    rules: {
      // convert svg to react component
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.jsx',
      },
    },
  },
  // webpack config (old dev)
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

export default nextConfig
