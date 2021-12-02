/**
 * Material UI theme customization
 * see https://mui.com/customization/theming/
 *
 * Default theme values can be found on link below
 * https://mui.com/customization/default-theme/ *
 */

import { createTheme } from "@mui/material/styles";
// import { blue, orange, red } from '@mui/material/colors'

/**
 * Alter styles module declaration to extend breakpoints.
 * We add hd (1920) to better cover 2k/4k screens.
 * See https://mui.com/customization/breakpoints/
 */
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    hd:true
  }
}

// define color variables to use
const colorPrimary = '#00A3E3'
const colorSecondary = '#222425'
const colorTextPrimary = 'rgba(34,36,37,1)'
const colorTextSecondary = 'rgba(34,36,37,0.87)'
const colorTextDisabled = 'rgba(34,36,37,0.45)'
const colorDivider = '#DDD'

const rsdTheme = createTheme({
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl", "hd"],
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      hd: 1920
    },
    unit: "px",
  },
  palette: {
    primary: {
      main: colorPrimary,
      contrastText: '#FFF'
    },
    secondary: {
      main: colorSecondary,
    },
    divider: colorDivider,
    text: {
      primary: colorTextPrimary,
      secondary: colorTextSecondary,
      disabled: colorTextDisabled,
    },
  },
  shape:{
    borderRadius: 2
  },
  typography:{
    // Note! if you change the fonts here ensure you update
    // pages/_document.tsx file to import proper fontFamily
    // Currently we import the fonst from Google Fonts
    // legacy RSD uses these fonts
    fontFamily: 'Roboto,Helvetica,arial,sans-serif',
    // set default fontsize to 1rem (16px)
    fontSize:16,
    fontWeightLight: 100,
    fontWeightRegular: 300,
    fontWeightMedium: 300,
    fontWeightBold: 400,
    button:{
      fontWeight: 400,
      letterSpacing: '0.125rem',
    },
    // change headers fontSize and weight
    h1: {
      fontWeight: 300,
      fontSize: "4rem",
      lineHeight: 1.3,
    },
    h2: {
      fontWeight: 100,
      fontSize: "2rem",
      lineHeight: 1.25,
    },
    h3: {
      fontWeight: 300,
      fontSize: "1.5rem",
      lineHeight: 1.125,
    },
  },
  // overriding defaults
  // in Mui components
  // see https://mui.com/customization/theme-components/
  components: {},
})

export {
  rsdTheme
}

// show all theme values
// console.log("rsdTheme:", JSON.stringify(rsdTheme))