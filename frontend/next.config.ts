// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

/** @type {import('next').NextConfig} */
import type {NextConfig} from 'next/types'

import rewritesConfig from './next.rewrites'
import securityHeaders from './next.headers'

const nextConfig: NextConfig = {
  // create standalone output to use in docker image
  // and achieve minimal image size (see Dockerfile)
  output: 'standalone',
  // fix for multiple package-lock files warning message
  // see issue https://github.com/vercel/next.js/issues/81864
  outputFileTracingRoot: __dirname,
  // enable source maps in production?
  productionBrowserSourceMaps: true,
  // disable strict mode if you want react to render component once
  // see for more info https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: false,
  // functionality removed in v16
  // eslint: {
  //   // Run ESLint in these directories during production builds (next build)
  //   // by default next runs linter only in pages/, components/, and lib/
  //   dirs: ['app','auth', 'components', 'config', 'pages', 'styles', 'types', 'utils']
  // },
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
      // forward old links to new location
      {
        source: '/profile/:orcid*',
        destination: '/persons/:orcid*',
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
  // based on SVGR documentation https://react-svgr.com/docs/next/
  // previous version produce error when app folder is used
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(
      (rule: any) =>
        !!rule.test && rule.test instanceof RegExp && rule.test.test('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {not: [...fileLoaderRule.resourceQuery.not, /url/]}, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

export default nextConfig
