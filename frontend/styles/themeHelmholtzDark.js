// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Colors for both themes
 * Tailwind and MUI-5 based on MUI-5 definitions
 */

const colors = {
  primary:'#14c8ff', /* Primary Light Blue */
  secondary:'#002864', /* Primary Blue */
  textPrimary:'#ffffff', /* Primary Blue */
  textSecondary:'#14c8ff', /* Primary Light Blue */
  textDisabled:'rgba(34,36,37,0.45)',
  divider:'#cdeefb', /* Secondary Highlight Blue */
  contrastText:'#cdeefb', /* Secondary Highlight Blue */
  error:'#e53935',
  warning:'#fa7833', /* Tertiary Light Orange */
  info:'#cdeefb', /* Secondary Highlight Blue */
  success:'#8cd600', /* Tertiary Light Green */
  black:'#000',
  white: '#fff',
  background: '#fff',
  paper: '#fff', /* Secondary Web Pale Blue */
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    A100: '#f5f5f5',
    A200: '#eeeeee',
    // tailwind neutral is A400 in MUI
    A400: '#909090',
    A700: '#616161',
  }
}

/**
 * Breakpoints to use in both themes
 * Note! Tailwind uses string and MUI-5 numeric values
 */
// const breakpoints = {
//   xs: 640,
//   sm: 768,
//   md: 1024,
//   lg: 1280,
//   xl: 1920
// }

const fonts={
  // Note! If you're using custom (local or remote) font faces, those fonts must
  // be loaded within styles/global.css
  default: [
    'Helmholtz Halvar Mittel Rg',
    'Helvetica',
    'arial',
    'sans-serif'
  ]
}

const muiTypography={
  fontFamily: fonts.default.join(','),
  // set default fontsize to 1rem for MUI-5
  // fontSize:14,
  fontWeightLight: 100,
  fontWeightRegular: 300,
  fontWeightMedium: 300,
  fontWeightBold: 400,
}

module.exports={
  colors,
  fonts,
  muiTypography
}
