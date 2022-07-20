// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useMemo} from 'react'
import {ThemeProvider} from '@mui/material/styles'

import {loadMuiTheme} from '~/styles/rsdMuiTheme'
import useRsdSettings from '~/config/useRsdSettings'

export default function DarkThemeSection(props: any) {
  const {theme} = useRsdSettings()
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
