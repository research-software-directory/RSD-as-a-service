const fonts={
  // Note! If you're using custom (local or remote) font faces, those fonts must
  // be loaded within styles/global.css
  default: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"sans-serif"',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ],
  helmholtz: [
    '"Helmholtz Halvar Mittel Rg"',
    'Helvetica',
    'arial',
    '"sans-serif"'
  ]
}
const muiTypography = {
  // Note! if you change the fonts here ensure you update
  // pages/_document.tsx file to import proper fontFamily
  // Currently we import the fonts from Google Fonts
  // legacy RSD uses these fonts
  fontFamily: fonts.helmholtz.join(','),
  // set default fontsize to 1rem for MUI-5
  // fontSize:14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
}

module.exports={
  muiTypography
}
