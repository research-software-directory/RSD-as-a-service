// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ThemeProvider} from '@mui/material/styles'
import {loadMuiTheme} from '../../styles/rsdMuiTheme'

const darkTheme = loadMuiTheme('dark')

export default function DarkThemeSection(props:any) {

  return (
    <ThemeProvider theme={darkTheme}>
      {props?.children}
    </ThemeProvider>
  )
}
