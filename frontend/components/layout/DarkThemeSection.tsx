// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext, useMemo} from 'react'
import {ThemeProvider} from '@mui/material/styles'

import {loadMuiTheme} from '~/styles/rsdMuiTheme'
import RsdThemeOptions from '~/styles/RsdThemeOptionsContext'

export default function DarkThemeSection(props: any) {
  const {theme} = useContext(RsdThemeOptions)
  const darkTheme = useMemo(() => {
    return loadMuiTheme({
      mode: 'dark',
      host: theme.host
    })
  },[theme.host])
  return (
    <ThemeProvider theme={darkTheme}>
      {props?.children}
    </ThemeProvider>
  )
}
