// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {Global} from '@emotion/react'
import {ThemeProvider} from '@mui/material/styles'
import {loadMuiTheme, RsdTheme} from './rsdMuiTheme'

type RsdMuiThemeProviderProps = {
  rsdTheme: RsdTheme
  children: any
}

export default function RsdMuiThemeProvider({rsdTheme, children}: RsdMuiThemeProviderProps) {
  // create theme from settings
  const {muiTheme,cssVariables} = loadMuiTheme(rsdTheme)

  // console.group('RsdMuiThemeProvider')
  // console.log('muiTheme...', muiTheme)
  // console.log('cssVariables...',cssVariables)
  // console.groupEnd()

  return (
    <ThemeProvider theme={muiTheme}>
      {/* dynamically pass css variables when theme changes */}
      <Global styles={cssVariables} />
      {/* content */}
      {children}
    </ThemeProvider>
  )
}
