// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Material UI theme customization
 * see https://mui.com/customization/theming/
 *
 * Default theme values can be found on link below
 * https://mui.com/customization/default-theme/ *
 */

/**
 * EXAMPLE of extendings MUI-5 theme interface
 * See https://mui.com/customization/breakpoints/
 */
// declare module '@mui/material/styles' {
//   interface BreakpointOverrides {
//     hd:true
//   }
// }

import {createTheme} from '@mui/material/styles'
import {RsdTheme} from '~/config/rsdSettingsReducer'

// import default colors, typography and getThemeMethod for loading theme configuration
import getThemeConfig from './getThemeConfig'
import {updateCssVariables} from './updateCssVariables'
import {colors, action, muiTypography} from './rsd/default'

export type MuiColorSchema = typeof colors
export type MuiActionSchema = typeof action
export type MuiTypography = typeof muiTypography

export type RsdThemeHost = 'default' | 'hemholtz' | 'nlesc'
export type RsdThemeMode = 'default' | 'dark'

export type ThemeConfig = {
  colors: MuiColorSchema
  action: MuiActionSchema
  muiTypography: MuiTypography
}

/**
 * Call this method to switch MuiTheme
 * @param RsdThemeProps
 * @returns Theme
 */
export function loadMuiTheme({host, mode}: RsdTheme) {
  // get theme colors and typography
  const config = getThemeConfig({host, mode}) as ThemeConfig
  // create Mui Theme
  const muiTheme = applyThemeConfig(config)

  // console.group('loadMuiTheme')
  // console.log('mode...', mode)
  // console.log('host...', host)
  if (mode && mode === 'dark') {
    muiTheme.palette.mode = 'dark'
  } else if (mode && mode === 'default') {
    // TODO! update css variables
    // update css variables
    updateCssVariables({
      ...config.colors,
      'default-font-family': config.muiTypography.defaultFontFamily,
      'titles-font-family': config.muiTypography.titlesFontFamily,
      'font-light': config.muiTypography.fontWeightLight,
      'font-regular': config.muiTypography.fontWeightRegular,
      'font-medium': config.muiTypography.fontWeightMedium,
      'font-bold': config.muiTypography.fontWeightBold
    })
    // console.log('update css variables...',config.colors)
  }
  // console.log('muiTheme...', muiTheme)
  // console.groupEnd()
  // return new theme
  return muiTheme
}

function applyThemeConfig({colors, action, muiTypography}: ThemeConfig) {
  // note! this is only part of
  // mui theme we want to overwrite,
  // for the complete list see https://mui.com/customization/default-theme/
  return createTheme({
    palette: {
      primary: {
        main: colors.primary,
        contrastText: colors['primary-content']
      },
      secondary: {
        main: colors.secondary,
        contrastText: colors['secondary-content']
      },
      error: {
        main: colors.error,
        contrastText: colors['error-content']
      },
      warning: {
        main: colors.warning,
        contrastText: colors['warning-content']
      },
      info: {
        main: colors.info,
        contrastText: colors['info-content']
      },
      success: {
        main: colors.success,
        contrastText: colors['success-content']
      },
      // grey: colors.grey,
      text: {
        primary: colors['base-content'],
        secondary: colors['base-content-secondary'],
        disabled: colors['base-content-disabled'],
      },
      divider: colors['base-300'],
      background: {
        paper: colors['base-100'],
        default: colors['base-200']
      },
      // action colors
      action
    },
    shape: {
      borderRadius: 2
    },
    typography: {
      fontFamily: muiTypography.defaultFontFamily,
      fontWeightLight: muiTypography.fontWeightLight,
      fontWeightRegular: muiTypography.fontWeightRegular,
      fontWeightMedium: muiTypography.fontWeightMedium,
      fontWeightBold: muiTypography.fontWeightBold,
      button: {
        fontWeight: 400,
        letterSpacing: '0.125rem',
      },
      // change headers typography
      h1: {
        // fontWeight: 300,
        fontSize: '4rem',
        lineHeight: 1.3,
        fontFamily: muiTypography.titlesFontFamily
      },
      h2: {
        // fontWeight: 100,
        fontSize: '2rem',
        lineHeight: 1.25,
        fontFamily: muiTypography.titlesFontFamily
      },
      h3: {
        // fontWeight: 300,
        fontSize: '1.5rem',
        lineHeight: 1.125,
        fontFamily: muiTypography.titlesFontFamily
      }
    },
    // overriding defaults
    // in Mui components
    // see https://mui.com/customization/theme-components/
    components: {
      MuiListItemText: {
        styleOverrides: {
          primary: {
            // cut off large menu items with ...
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            overflow: 'auto'
          }
        }
      },
      MuiTablePagination: {
        styleOverrides: {
          selectRoot: {
            marginRight: '0.5rem'
          },
          displayedRows: {
            minWidth: '6.5rem',
            textAlign: 'right',
            '@media(max-width: 640px)': {
              minWidth: 'inherit',
            }
          },
          toolbar: {
            '@media(max-width: 640px)': {
              paddingLeft: '0rem'
            }
          },
          actions: {
            '@media(max-width: 640px)': {
              marginLeft: '0.5rem'
            }
          }
        }
      }
    },
  })
}
