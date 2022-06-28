// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Tailwind integration with MUI in next.js
 * based on the article but extended with MUI properties
 * https://medium.com/@akarX23/a-full-setup-of-next-js-with-redux-tailwind-material-ui-pwa-and-docker-c33bdceadce5
 */
const defaultTheme = require('tailwindcss/defaultTheme')
// custom theme variables to be used in both themes
const {colors, muiTypography} = require('./styles/themeConfig')

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
      // sans is default font used
      // we set Roboto as first font-type
      // and then the defaults from tailwind
      sans: [
        'Roboto',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
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
        'rsd-titles': ['Work Sans']
      },
      colors: {
        // in order to have optimal theme integration with material ui components
        // please keep the color names (props) in sync with MUI definitions
        // the list of all theme properties can be found in README.md
        primary: colors.primary,
        secondary: colors.secondary,
        divider: colors.divider,
        error: colors.error,
        warning: colors.warning,
        info: colors.info,
        success: colors.success,
        background: colors.background,
        paper: colors.paper,
        grey: colors.grey,
      },
      fontWeight: {
        regular: muiTypography.fontWeightRegular
      }
    },
  },
  variants: {
    extend: {},
  },

}
