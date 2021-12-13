/**
 * Tailwind intergration with MUI in next.js
 * based on the article but extended with more MUI properties
 * https://medium.com/@akarX23/a-full-setup-of-next-js-with-redux-tailwind-material-ui-pwa-and-docker-c33bdceadce5
 */
const defaultTheme = require("tailwindcss/defaultTheme");
// custom theme variables to be used in both themes
const {colors,muiTypography} = require('./styles/themeConfig')

module.exports = {
 mode: "jit",
 purge: [
   "./components/**/*.{js,ts,jsx,tsx}",
   "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        paper: colors.white,
        primary: colors.primary,
        secondary: colors.secondary,
        error: colors.error,
        warning: colors.warning,
        info: colors.info,
        success: colors.success,
        grey: colors.grey
      },
      fontWeight:{
        regular: muiTypography.fontWeightRegular
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};