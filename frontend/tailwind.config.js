// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

/**
 * @file This file contains the Tailwind configuration for the RSD-as-a-service frontend.
 * It extends the default Tailwind configuration with theme colors and typography from a settings.json file.
 * It also defines custom font families and font weights.
 * @see {@link https://tailwindcss.com/docs} for more information on Tailwind.
 * @see {@link https://github.com/dv4all/RSD-as-a-service} for more information on the RSD-as-a-service project.
 * @see {@link https://github.com/dv4all/RSD-as-a-service/blob/main/frontend/public/data/settings.json} for more information on the settings.json file.
 * @see {@link https://github.com/dv4all/RSD-as-a-service/blob/main/frontend/styles/README.md} for more information on using theme colors in the project.
 */

/**
 * Tailwind integration with MUI in next.js
 * based on the article but extended with MUI properties
 * https://medium.com/@akarX23/a-full-setup-of-next-js-with-redux-tailwind-material-ui-pwa-and-docker-c33bdceadce5
 */

// get theme variables
// eslint-disable-next-line @typescript-eslint/no-require-imports
const defaultSettings = require('./public/data/settings.json')
// console.log('defaultSettings...', defaultSettings)
// load colors and typography
const colors = defaultSettings.theme.light.colors
const typography = defaultSettings.theme.typography
// console.log('colors...', colors)
// console.log('typography...', typography)

module.exports = {
  darkMode: 'class',
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/typography')],
  content: [
    './auth/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // USE ONLY THEME FONTS
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
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      colors: {
        // EXTEND WITH THEME COLORS
        // PLEASE USE ONLY THEME COLORS!
        // If the color is not defined in the theme, you can define it using public/data/settings.json
        // and then reference it here (as it is done with the other theme colors).
        // More info can be also found in styles/ README.md
        // ALREADY DEFINED in tailwind
        // transparent: 'transparent',
        // current: 'currentColor',
        // inherit: 'inherit',
        'base-100': `var(--rsd-base-100,${colors['base-100']})`,
        'base-200': `var(--rsd-base-200,${colors['base-200']})`,
        'base-300': `var(--rsd-base-300,${colors['base-300']})`,
        'base-400': `var(--rsd-base-400,${colors['base-400']})`,
        'base-500': `var(--rsd-base-500,${colors['base-500']})`,
        'base-600': `var(--rsd-base-600,${colors['base-600']})`,
        'base-700': `var(--rsd-base-700,${colors['base-700']})`,
        'base-800': `var(--rsd-base-800,${colors['base-800']})`,
        'base-900': `var(--rsd-base-900,${colors['base-900']})`,
        'base-content': `var(--rsd-base-content,${colors['base-content']})`,
        'base-content-secondary': `var(--rsd-base-content-secondary,${colors['base-content-secondary']})`,
        'base-content-disabled': `var(--rsd-base-content-disabled,${colors['base-content-disabled']})`,
        primary: `var(--rsd-primary,${colors.primary})`,
        'primary-content': `var(--rsd-primary-content,${colors['primary-content']})`,
        secondary: `var(--rsd-secondary,${colors.secondary})`,
        'secondary-content': `var(--rsd-secondary-content,${colors['secondary-content']})`,
        accent: `var(--rsd-accent,${colors.accent})`,
        'accent-content': `var(--rsd-accent-content,${colors['accent-content']})`,
        error: `var(--rsd-error,${colors.error})`,
        'error-content': `var(--rsd-error-content,${colors['error-content']})`,
        warning: `var(--rsd-warning,${colors.warning})`,
        'warning-content': `var(--rsd-warning-content,${colors['warning-content']})`,
        info: `var(--rsd-info,${colors.info})`,
        'info-content': `var(--rsd-info-content,${colors['info-content']})`,
        success: `var(--rsd-success,${colors.success})`,
        'success-content': `var(--rsd-success-content,${colors['success-content']})`,
        'glow-start': `var(--rsd-glow-start,${colors['glow-start']})`,
        'glow-end': `var(--rsd-glow-end,${colors['glow-end']})`,
      },
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
      fontWeight: {
        light: `var(--rsd-font-light, ${typography.fontWeightLight})`,
        normal: `var(--rsd-font-regular,${typography.fontWeightRegular})`,
        medium: `var(--rsd-font-medium,${typography.fontWeightMedium})`,
        bold: `var(--rsd-font-bold,${typography.fontWeightBold})`,
      },
    },
  },
  variants: {
    extend: {},
  },
}
