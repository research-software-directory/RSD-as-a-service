// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Tailwind integration with MUI in next.js
 * based on the article but extended with MUI properties
 * https://medium.com/@akarX23/a-full-setup-of-next-js-with-redux-tailwind-material-ui-pwa-and-docker-c33bdceadce5
 */

// default tailwind theme
// const defaultTheme = require('tailwindcss/defaultTheme')
// default theme variables
const defaultSettings = require('./config/defaultSettings.json')
// console.log('defaultSettings...', defaultSettings)
// load colors and typography
const colors = defaultSettings.theme.light.colors
const typography = defaultSettings.theme.typography
// console.log('colors...', colors)
// console.log('typography...', typography)

module.exports = {
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
  content: [
    './auth/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      // font-sans is default
      sans: `var(--rsd-default-font-family,${typography.defaultFontFamily})`,
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    extend: {
      // ultra large resolutions
      // not relevant at the moment
      // screens: {
      //   qhd:'2304px'
      // },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      fontFamily: {
        'rsd-titles': `var(--rsd-titles-font-family,${typography.titlesFontFamily})`,
      },
      //
      // THEME COLORS
      //
      colors: {
        // in order to have optimal theme integration with material ui components
        // please keep the color names (props) in sync with MUI definitions
        // the list of all theme properties can be found in README.md
        // 'base-100': colors['base-100'],
        'base-100':`var(--rsd-base-100,${colors['base-100']})`,
        'base-200':`var(--rsd-base-200,${colors['base-200']})`,
        'base-300':`var(--rsd-base-300,${colors['base-300']})`,
        'base-content': `var(--rsd-base-content,${colors['base-content']})`,
        'base-content-secondary':`var(--rsd-base-content-secondary,${colors['base-content-secondary']})`,
        'base-content-disabled':`var(--rsd-base-content-disabled,${colors['base-content-disabled']})`,
        primary:`var(--rsd-primary,${colors.primary})`,
        'primary-content':`var(--rsd-primary-content,${colors['primary-content']})`,
        secondary:`var(--rsd-secondary,${colors.secondary})`,
        'secondary-content':`var(--rsd-secondary-content,${colors['secondary-content']})`,
        accent:`var(--rsd-accent,${colors.accent})`,
        'accent-content':`var(--rsd-accent-content,${colors['accent-content']})`,
        error:`var(--rsd-error,${colors.error})`,
        'error-content':`var(--rsd-error-content,${colors['error-content']})`,
        warning:`var(--rsd-warning,${colors.warning})`,
        'warning-content':`var(--rsd-warning-content,${colors['warning-content']})`,
        info:`var(--rsd-info,${colors.info})`,
        'info-content':`var(--rsd-info-content,${colors['info-content']})`,
        success:`var(--rsd-success,${colors.success})`,
        'success-content':`var(--rsd-success-content,${colors['success-content']})`
      },
      fontWeight: {
        light:`var(--rsd-font-light, ${typography.fontWeightLight})`,
        normal:`var(--rsd-font-regular,${typography.fontWeightRegular})`,
        medium:`var(--rsd-font-medium,${typography.fontWeightMedium})`,
        bold:`var(--rsd-font-bold,${typography.fontWeightBold})`
      }
    },
  },
  variants: {
    extend: {},
  },
}
