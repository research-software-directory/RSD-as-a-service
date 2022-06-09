// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Theme configuration
 * It supports loading MUI theme application during the runtime.
 * It requires color and typography configuration. To add theme:
 * 1. Use themeDefault.js as a template and adapt the colors.
 * 2. Add theme enumerator value to RsdThemes types in rsdMuiTheme.ts file
 * 3. Call getThemeConfig with provided enumerator to load theme dynamically
 * 4. Use MUI theme provider to provide the theme to child components.
 * You can use multiple theme providers/overwrite current theme,
 * the last assigned theme is applied to its children.
 */
const defaultTheme = require('./themeDefault')
const darkTheme = require('./themeDark')
// example eScience theme loading
// const escienceTheme = require('./themeEscience')

function getThemeConfig(theme) {
  // console.log('themeConfig.getThemeConfig...', theme)
  switch (theme) {
    // example escience theme type
    // case 'escience':
    //   return {
    //     colors: escienceTheme.colors,
    //     muiTypography: escienceTheme.muiTypography
    //   }
    case 'dark':
      return {
        colors: darkTheme.colors,
        muiTypography: darkTheme.muiTypography
      }
    default:
      return {
        colors: defaultTheme.colors,
        muiTypography: defaultTheme.muiTypography
      }
  }
}

module.exports={
  colors: defaultTheme.colors,
  muiTypography: defaultTheme.muiTypography,
  getThemeConfig
}
