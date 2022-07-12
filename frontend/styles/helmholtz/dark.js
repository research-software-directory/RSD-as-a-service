// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

const muiTypography = require('./typography')

/**
 * See themeDefault for comments on values
 */

const colors = {
  'base-100': '#002864',
  'base-200': '#151515',
  'base-300': '#ccc',
  'base-content': 'rgba(255,255,255,0.87)',
  'base-content-secondary':'rgba(255,255,255,0.6)',
  'base-content-disabled': 'rgba(255,255,255,0.45)',
  primary: '#14c8ff', /* Primary Light Blue */
  'primary-content': '#ffffff',
  // renamed to primary-content
  // textPrimary: '#ffffff',
  // mui - secondary.main
  secondary:'#002864', /* Primary Blue */
  // mui - secondary.contrastText
  'secondary-content': '#14c8ff',

  // renamed to secondary-content
  // textSecondary:'#14c8ff', /* Primary Light Blue */
  // renamed to base-content-disabled
  // textDisabled:'rgba(34,36,37,0.45)',
  // renamed to base[300] -> these are greys ??
  // divider: '#cdeefb', /* Secondary Highlight Blue */
  // renamed to secondary-content
  // contrastText:'#cdeefb', /* Secondary Highlight Blue */

  accent:'#73095d',
  'accent-content':'white',
  error: '#e53935',
  'error-content': 'black',
  warning: '#fa7833', /* Tertiary Light Orange */
  'warning-content': 'black',
  info: '#cdeefb', /* Secondary Highlight Blue */
  'info-content': 'black',
  success: '#8cd600', /* Tertiary Light Green */
  'success-content': 'black',

  // black: '#000',
  // white: '#fff',
  // background: '#fff',
  // paper: '#fff', /* Secondary Web Pale Blue */

  // removed
  // grey: {
  //   50: '#fafafa',
  //   100: '#f5f5f5',
  //   200: '#eeeeee',
  //   300: '#e0e0e0',
  //   400: '#bdbdbd',
  //   500: '#9e9e9e',
  //   600: '#757575',
  //   700: '#616161',
  //   800: '#424242',
  //   900: '#212121',
  //   A100: '#f5f5f5',
  //   A200: '#eeeeee',
  //   // tailwind neutral is A400 in MUI
  //   A400: '#909090',
  //   A700: '#616161',
  // }
}

/**
 * Action colors
 * for MUI-5 theme ONLY
 */
const action = {
  active: 'rgba(255, 255, 255, 0.54)',
  hover: 'rgba(255, 255, 255, 0.4)',
  hoverOpacity: 0.1,
  selected: 'rgba(255, 255, 255, 0.08)',
  selectedOpacity: 0.16,
  disabled: 'rgba(255, 255, 255, 0.26)',
  disabledBackground: 'rgba(255, 255, 255, 0.12)',
  disabledOpacity: 0.38,
  focus: 'rgba(255, 255, 255, 0.12)',
  focusOpacity: 0.12,
  activatedOpacity: 0.12
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

module.exports={
  colors,
  action,
  muiTypography
}
