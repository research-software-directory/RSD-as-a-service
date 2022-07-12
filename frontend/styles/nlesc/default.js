// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0
const muiTypography = require('./typography')
/**
 * See themeDefault for comments on values
 */

const colors = {
  'base-100': '#fff',
  'base-200': '#f5f5f5',
  'base-300': '#eeeeee',
  'base-content': 'rgba(34,36,37,1)',
  'base-content-secondary':'rgba(34,36,37,0.87)',
  'base-content-disabled':'rgba(34,36,37,0.45)',
  primary:'#05A2E3',
  'primary-content':'#fff',
  secondary:'#000',
  'secondary-content':'#fff',
  accent:'#73095d',
  'accent-content':'#fff',
  error:'#e53935',
  'error-content':'#000',
  warning:'#ed6c02',
  'warning-content':'#000',
  info:'#0288d1',
  'info-content':'#000',
  success:'#2e7d32',
  'success-content':'#fff'
}

/**
 * Action colors
 * for MUI-5 theme ONLY
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
