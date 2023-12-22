// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useMemo} from 'react'
import {ThemeProvider} from '@mui/material/styles'

import {loadMuiTheme} from '~/styles/rsdMuiTheme'
import useRsdSettings from '~/config/useRsdSettings'

export default function DarkThemeProvider(props: any) {
  const {theme} = useRsdSettings()
  const {muiTheme} = useMemo(() => {
    return loadMuiTheme({
      ...theme,
      mode: 'dark'
    })
  },[theme])
  return (
    <ThemeProvider theme={muiTheme}>
      {props?.children}
    </ThemeProvider>
  )
}
