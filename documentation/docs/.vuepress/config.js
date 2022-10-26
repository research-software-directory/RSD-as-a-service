// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  // site config
  lang: 'en-US',
  title: 'RSD Developer Documentation',
  description: 'RSD As a Service documentation',
  base: '/RSD-as-a-service/',
  port: '3030',

  themeConfig: {
    logo: '/images/circle.webp',
    // logoDark: '/images/heroDark.webp',
    repo: 'research-software-directory/RSD-as-a-service',
    docsDir: 'documentation/docs',
    docsBranch: 'main',
    displayAllHeaders: true, // Default: false

    navbar: [
      {
        text: 'Documentation',
        link: 'introduction'
      },
      {
        text: 'RSD Site',
        link: 'https://research-software-directory.org'
      },
    ],
    sidebarDepth: 2,

    sidebar: [
      'introduction',
      'getting-started',
      'scrapers',
      'api',
      'release',
      'contributors',
      'embed',
      'frontend-settings'
      // 'code-of-conduct',
    ],
  },

  plugins: [
    // '@vuepress/plugin-back-to-top'
    '@vuepress/plugin-external-link-icon',
    '@vuepress/plugin-nprogress',
    '@vuepress/plugin-prismjs',
     [ '@vuepress/plugin-palette', { preset: 'sass' } ],
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: 'Search',
          },
        },
      },
    ],
  ],


}
