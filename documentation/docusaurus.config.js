// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  future: {
    experimental_faster: true,
  },
  title: 'RSD documentation',
  tagline: 'RSD documentation',
  favicon: 'favicon.ico',

  // Set the production url of your site here
  url: 'https://research-software-directory.org/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/documentation/',
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'dmijatovic', // Usually your GitHub org/user name.
  // projectName: 'rsd-documentation', // Usually your repo name.
  // deploymentBranch: 'main',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [[require.resolve('docusaurus-lunr-search'),{
    // language codes
    languages: ['en']
  }]],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          breadcrumbs: true,
          // change to docs only site
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:'https://github.com/research-software-directory/RSD-as-a-service/edit/main/documentation',
          // do not use current/next version
          // includeCurrentVersion: false,
          showLastUpdateTime: false,
          showLastUpdateAuthor: false
        },
        // disable blog
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css'],
        },
      }
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'RSD',
        logo: {
          alt: 'RSD logo',
          src: 'circle.webp',
        },
        hideOnScroll: false,
        items: [
          {
            label: "Users",
            to: "/users/",
            position: "left"
          },
          {
            label: 'API',
            to:'/API/',
            position: 'left',
          },{
            label: 'Hosting',
            to:'/rsd-instance/',
            position: 'left',
          },
          {
            label: 'Contributors',
            to:'/contribute/',
            position: 'left',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://research.software',
            position: 'right',
            label: 'RSD live',
          },
          {
            href: 'https://research-software.dev',
            position: 'right',
            label: 'RSD demo',
          },
          {
            href: 'https://github.com/research-software-directory/RSD-as-a-service',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      // disable footer
      // footer: {
      //   style: 'dark',
      //   links: [
      //     {
      //       title: 'Docs',
      //       items: [
      //         {
      //           label: 'Users',
      //           to: '/category/users',
      //         },
      //         {
      //           label: 'Developers',
      //           to: '/category/developers',
      //         },
      //         {
      //           label: 'Contributors',
      //           to: '/category/contributors',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Community',
      //       items: [
      //         {
      //           label: 'Stack Overflow',
      //           href: 'https://stackoverflow.com/questions/tagged/docusaurus',
      //         },
      //         {
      //           label: 'Discord',
      //           href: 'https://discordapp.com/invite/docusaurus',
      //         },
      //         {
      //           label: 'Twitter',
      //           href: 'https://twitter.com/docusaurus',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Links',
      //       items: [
      //         {
      //           label: 'RSD Live',
      //           href: 'https://github.com/facebook/docusaurus',
      //         },
      //         {
      //           label: 'RSD Demo',
      //           href: 'https://github.com/facebook/docusaurus',
      //         },
      //         {
      //           label: 'GitHub',
      //           href: 'https://github.com/facebook/docusaurus',
      //         },
      //       ],
      //     },
      //   ],
      //   // copyright: "The Research Software Directory promotes the impact, re-use and citation of research software",
      // },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['json', 'typescript', 'nginx', 'bash']
      },
    }),
};

export default config;
