/**
 * Material UI theme customization
 * see https://mui.com/customization/theming/
 *
 * Default theme values can be found on link below
 * https://mui.com/customization/default-theme/ *
 */

import {createTheme} from '@mui/material/styles'
// import colors and breakpoints from shared themeConfig file
// these values are applied to both MUI-5 and Tailwind themes
import {colors, muiTypography} from './themeConfig'

/**
 * EXAMPLE of extendings MUI-5 theme interface
 * Alter styles module declaration to extend breakpoints.
 * We add hd (1920) to better cover 2k/4k screens.
 * See https://mui.com/customization/breakpoints/
 */
// declare module '@mui/material/styles' {
//   interface BreakpointOverrides {
//     hd:true
//   }
// }

const rsdMuiTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      contrastText: colors.contrastText
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.contrastText
    },
    error: {
      main: colors.error,
      contrastText: colors.contrastText
    },
    common: {
      black: colors.black,
      white: colors.white,
    },
    warning: {
      main: colors.warning,
      contrastText: colors.contrastText
    },
    info: {
      main: colors.info,
      contrastText: colors.contrastText
    },
    success: {
      main: colors.success,
      contrastText: colors.contrastText
    },
    grey: colors.grey,
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
      disabled: colors.textDisabled,
    },
    divider: colors.divider,
    background: {
      paper: colors.white,
      default: colors.white,
    },
  },
  shape:{
    borderRadius: 2
  },
  typography:{
    button:{
      fontWeight: 400,
      letterSpacing: '0.125rem',
    },
    // change headers fontSize and weight
    h1: {
      fontWeight: 300,
      fontSize: '4rem',
      lineHeight: 1.3,
    },
    h2: {
      fontWeight: 100,
      fontSize: '2rem',
      lineHeight: 1.25,
    },
    h3: {
      fontWeight: 300,
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
    MuiListItemText:{
      styleOverrides:{
        primary:{
          // cut off large menu items with ...
          overflow:'hidden',
          textOverflow: 'ellipsis'
        }
      }
    },
    MuiPaper:{
      styleOverrides:{
        root:{
          overflow:'auto'
        }
      }
    },
    MuiTablePagination:{
      styleOverrides:{
        selectRoot:{
          marginRight:'0.5rem'
        },
        displayedRows:{
          minWidth:'6.5rem',
          textAlign:'right',
          '@media(max-width: 640px)':{
            minWidth:'inherit',
          }
        },
        toolbar:{
          '@media(max-width: 640px)':{
            paddingLeft:'0rem'
          }
        },
        actions:{
          '@media(max-width: 640px)':{
            marginLeft:'0.5rem'
          }
        }
      }
    }
  },
})

export {
  rsdMuiTheme
}
// show all theme values
// console.log("rsdTheme:", JSON.stringify(rsdTheme))
