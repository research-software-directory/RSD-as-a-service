// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Typography for both
 * Tailwind and MUI-5
 */
const muiTypography = require('./typography')

/**
 * Colors for both themes
 * Tailwind and MUI-5
 */

const colors = {
  // mui: paper and background
  'base-100': '#ffffff',
  // mui: not used
  'base-200': '#EEEEEE',
  // mui: divider
  'base-300': '#dcdcdc',
  // mui: text.primary
  'base-content': 'rgba(34,36,37,1)',
  // mui: text.secondary
  'base-content-secondary':'rgba(34,36,37,0.7)',
  // mui: text.disabled
  'base-content-disabled':'rgba(34,36,37,0.45)',
  // mui: primary.main
  primary: '#01ad83',
  // mui: primary.contrastText
  'primary-content':'white',
  // mui: secondary.main
  secondary:'#000',
  // mui: secondary.contrastText & text.secondary
  'secondary-content':'white',
  // mui: not used
  accent: '#73095d',
  // mui: not used
  'accent-content': 'white',
  // mui snackbar colors by type
  // mui: error.main
  error: '#e53935',
  // mui: error.contrastText
  'error-content': 'black',
  // mui: warning.main
  warning: '#ed6c02',
  // mui: warning.contrastText
  'warning-content': 'black',
  // mui: info.main
  info: '#0288d1',
  // mui: info.contrastText
  'info-content': 'black',
  // mui: success.main
  success: '#2e7d32',
  // mui: success.contrastText
  'success-content':'white'
}

/**
 * Action colors
 * for MUI-5 theme ONLY
 * used by various mui components like button, lists etc.
 */
const action = {
  active: 'rgba(0, 0, 0, 0.54)',
  hover: 'rgba(0, 0, 0, 0.04)',
  hoverOpacity: 0.04,
  selected: 'rgba(0, 0, 0, 0.08)',
  selectedOpacity: 0.08,
  disabled: 'rgba(0, 0, 0, 0.26)',
  disabledBackground: 'rgba(0, 0, 0, 0.12)',
  disabledOpacity: 0.38,
  focus: 'rgba(0, 0, 0, 0.12)',
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
