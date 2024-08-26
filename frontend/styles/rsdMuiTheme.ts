// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Theme configuration
 * It supports loading MUI themes during the runtime.
 * It requires colors, action and typography configuration for light and dark theme.
 * To change theme:
 * 1. create index.css file to define font family. See public/styles/index.css as example
 * 2. create theme.json file to define colors, action and typography. See public/settings/theme.json
 * 3. mount index.css file to app/public/styles folder of the frontend image. See docker-compose file
 * 4. mount theme.json file to app/public/settings folder of the frontend image. See docker-compose file
 */

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
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    '2xl':true
  }
}

import {createTheme} from '@mui/material/styles'

// import default colors, typography and getThemeMethod for loading theme configuration
import {createCssVariables} from './cssVariables'
import defaultSettings from '~/config/defaultSettings.json'

export type MuiColorSchema = typeof defaultSettings.theme.light.colors
export type MuiActionSchema = typeof defaultSettings.theme.light.action
export type MuiTypography = typeof defaultSettings.theme.typography


export type RsdTheme = {
  mode?: string,
  light: {
    colors: MuiColorSchema
    action: MuiActionSchema
  },
  dark: {
    colors: MuiColorSchema
    action: MuiActionSchema
  },
  typography: MuiTypography
}

export type ThemeConfig = {
  colors: MuiColorSchema
  action: MuiActionSchema
  typography: MuiTypography
}

function extractModeSettings(theme: RsdTheme): ThemeConfig {
  if (theme) {
    if (theme.mode && theme.mode === 'dark') {
      // dark theme
      return {
        colors: theme.dark.colors,
        action: theme.dark.action,
        typography: theme.typography
      }
    }
    // light theme is default theme
    return {
      colors: theme.light.colors,
      action: theme.light.action,
      typography: theme.typography
    }
  }
  // default light theme
  return {
    colors: defaultSettings.theme.light.colors,
    action: defaultSettings.theme.light.action,
    typography: defaultSettings.theme.typography
  }
}

/**
 * Call this method to switch MuiTheme
 * @param RsdThemeProps
 * @returns Theme
 */
export function loadMuiTheme(theme: RsdTheme) {
  // get theme colors and typography
  const config = extractModeSettings(theme)
  // create Mui Theme
  const muiTheme = applyThemeConfig(config)

  // console.group('loadMuiTheme')
  // console.log('theme...', theme)
  // console.log('config...',config)
  // console.groupEnd()

  if (theme && theme.mode === 'dark') {
    muiTheme.palette.mode = 'dark'
    // console.log('muiTheme...', muiTheme)
    // console.groupEnd()
    // return new theme
    return {muiTheme}
  } else {
    // TODO! update css variables
    // update css variables
    const cssVariables = createCssVariables({
      ...config.colors,
      'default-font-family': config.typography.defaultFontFamily,
      'titles-font-family': config.typography.titlesFontFamily,
      'font-light': config.typography.fontWeightLight,
      'font-regular': config.typography.fontWeightRegular,
      'font-medium': config.typography.fontWeightMedium,
      'font-bold': config.typography.fontWeightBold
    })
    return {
      muiTheme,
      cssVariables
    }
  }
}

function applyThemeConfig({colors, action, typography}: ThemeConfig) {
  // note! this is only part of
  // mui theme we want to overwrite,
  // for the complete list see https://mui.com/customization/default-theme/
  return createTheme({
    breakpoints: {
      // align this values with default tailwind breakpoints
      // we added custom 2xl which is by default in tailwind
      keys: ['xs', 'sm', 'md', 'lg', 'xl','2xl'],
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl':1536
      },
      unit: 'px',
    },
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
      fontFamily: typography.defaultFontFamily,
      fontWeightLight: typography.fontWeightLight,
      fontWeightRegular: typography.fontWeightRegular,
      fontWeightMedium: typography.fontWeightMedium,
      fontWeightBold: typography.fontWeightBold,
      button: {
        fontWeight: 400,
        letterSpacing: '0.125rem',
        textTransform: 'none' // Remove default for capitalized buttons
      },
      // change headers typography
      h1: {
        // fontWeight: 300,
        fontSize: '4rem',
        lineHeight: 1.3,
        fontFamily: typography.titlesFontFamily
      },
      h2: {
        // fontWeight: 100,
        fontSize: '2rem',
        lineHeight: 1.25,
        fontFamily: typography.titlesFontFamily
      },
      h3: {
        // fontWeight: 300,
        fontSize: '1.5rem',
        lineHeight: 1.125,
        fontFamily: typography.titlesFontFamily
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
      },
      MuiAvatar: {
        styleOverrides: {
          colorDefault: {
            color: colors['primary-content'],
            backgroundColor: colors['base-600']
          }
        }
      },
      MuiTooltip: {
        styleOverrides:{
          tooltip: {
            maxWidth: '40rem'
          },
        }
      },
    },
  })
}
