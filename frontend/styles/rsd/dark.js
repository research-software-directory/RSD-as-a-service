// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

const muiTypography = require('./typography')

/**
 * See themeDefault for comments on values
 */
const colors = {
  'base-100': '#0a0a0a',
  'base-200': '#151515',
  'base-300': '#2a2a2a',
  'base-content': 'rgba(255,255,255,0.87)',
  'base-content-secondary':'rgba(255,255,255,0.7)',
  'base-content-disabled':'rgba(255,255,255,0.45)',
  primary:'#01ad83',
  'primary-content':'white',
  secondary:'#000',
  'secondary-content':'white',
  accent:'#73095d',
  'accent-content':'white',
  error:'#e53935',
  'error-content':'black',
  warning:'#ed6c02',
  'warning-content':'black',
  info:'#0288d1',
  'info-content':'black',
  success:'#2e7d32',
  'success-content': 'white'
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
