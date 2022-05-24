// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
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
const defaultTheme = require('./themeHelmholtz')
const darkTheme = require('./themeHelmholtzDark')
// example eScience theme loading
// const escienceTheme = require('./themeEscience')

function getThemeConfig(theme) {
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
        colors: helmholtzTheme.colors,
        muiTypography: helmholtzTheme.muiTypography
      }
  }
}

module.exports={
  ...getThemeConfig(),
  getThemeConfig
}
