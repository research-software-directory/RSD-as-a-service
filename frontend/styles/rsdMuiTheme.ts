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

import {createTheme} from '@mui/material/styles'
// import default colors, typography and getThemeMethod for loading theme configuration
import {colors,getThemeConfig} from './themeConfig'
import {muiTypography} from './muiTypography'

type MuiColorSchema = typeof colors
type MuiTypography = typeof muiTypography

/**
 * EXAMPLE of extendings MUI-5 theme interface
 * See https://mui.com/customization/breakpoints/
 */
// declare module '@mui/material/styles' {
//   interface BreakpointOverrides {
//     hd:true
//   }
// }

export type ThemeConfig = {
  colors: any
  muiTypography: MuiTypography
}

export type RsdThemes = 'dark' | 'default'

/**
 * Call this method to switch MuiTheme
 * @param theme
 * @returns Theme
 */
export function loadMuiTheme(theme:RsdThemes) {
  // get theme colors and typography
  const config: ThemeConfig = getThemeConfig(theme)
  // create Mui Theme
  const muiTheme = applyThemeConfig({
    ...config
  })
  if (theme === 'dark') {
    muiTheme.palette.mode = 'dark'
  }
  // console.group('loadMuiTheme')
  // console.log('muiTheme...', muiTheme)
  // console.groupEnd()
  return muiTheme
}

function applyThemeConfig({colors,muiTypography}:ThemeConfig) {
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
      // common: {
      //   black: colors.black,
      //   white: colors.white,
      // },
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
        secondary: colors['base-content'],
        disabled: colors['base-content-disabled'],
      },
      divider: colors.base?.['300'],
      background: {
        paper: colors.base?.['100'],
        default: colors.base?.['100'],
      },
      action: colors.action
    },
    shape: {
      borderRadius: 2
    },
    typography: {
      button: {
        fontWeight: 400,
        letterSpacing: '0.125rem',
      },
      // change headers fontSize and weight
      h1: {
        // fontWeight: 300,
        fontSize: '4rem',
        lineHeight: 1.3,
      },
      h2: {
        // fontWeight: 100,
        fontSize: '2rem',
        lineHeight: 1.25,
      },
      h3: {
        // fontWeight: 300,
        fontSize: '1.5rem',
        lineHeight: 1.125,
      },
      ...muiTypography
    },
    // overriding defaults
    // in Mui components
    // see https://mui.com/customization/theme-components/
    components: {
      // MuiButton:{
      //   styleOverrides:{
      //     root:{
      //       // remove upper text transform from buttons
      //       textTransform:'inherit'
      //     }
      //   }
      // },
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
