/**
 * Tailwind integration with MUI in next.js
 * based on the article but extended with MUI properties
 * https://medium.com/@akarX23/a-full-setup-of-next-js-with-redux-tailwind-material-ui-pwa-and-docker-c33bdceadce5
 */
const defaultTheme = require('tailwindcss/defaultTheme')
// custom theme variables to be used in both themes
const {colors,muiTypography} = require('./styles/themeConfig')

module.exports = {
  // disable preflight = normalize by tailwind
  // corePlugins: {
  //   preflight: false,
  // },
  content: [
    './auth/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      // sans is default font used
      // we set Roboto as first font-type
      // and then the defaults from tailwind
      sans: [
        'Roboto',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    extend: {
      // ultra large resolutions
      // not relevant at the moment
      // screens: {
      //   qhd:'2304px'
      // },
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
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
