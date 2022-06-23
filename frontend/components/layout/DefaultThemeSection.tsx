// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ThemeProvider} from '@mui/material/styles'
import {loadMuiTheme} from '../../styles/rsdMuiTheme'

const defaultTheme = loadMuiTheme('default')

export default function DefaultThemeSection(props:any) {

  return (
    <ThemeProvider theme={defaultTheme}>
      <section
        className="bg-paper"
      >
        {props?.children}
      </section>
    </ThemeProvider>
  )
}
