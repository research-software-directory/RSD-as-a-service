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
const {colors} = require('./styles/themeConfig')
const {muiTypography} = require('./styles/muiTypography')

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
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
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
      //
      // THEME COLORS
      //
      colors: {
        // in order to have optimal theme integration with material ui components
        // please keep the color names (props) in sync with MUI definitions
        // the list of all theme properties can be found in README.md
        // todo: move it to css variables to change the theme dinamically
        // 'base-100': 'var(--base-100)', // background colors - mui: 'paper'
        'base-100': colors.base['100'], // background colorss - mui: 'paper'
        'base-200': colors.base['200'],
        'base-300': colors.base['300'],
        'base-content': colors['base-content'],
        'base-content-disabled': colors['base-content-disabled'],
        primary: colors.primary,
        'primary-content': colors['primary-content'],
        secondary: colors.secondary,
        'secondary-content': colors['secondary-content'],
        accent: colors.accent,
        'accent-content': colors['accent-content'],
        error: colors.error,
        'error-content': colors['error-content'],
        warning: colors.warning,
        'warning-content': colors['warning-content'],
        info: colors.info,
        'info-content': colors['info-content'],
        success: colors.success,
        'success-content': colors['success-content'],
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
