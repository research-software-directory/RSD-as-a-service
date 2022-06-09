// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Renders component wrapped with theme and auth provider
 * @returns
 */

// import {SessionProvider} from 'next-auth/react'
import {loadMuiTheme,RsdThemes} from '../../styles/rsdMuiTheme'
import {ThemeProvider} from '@mui/material/styles'
import {AuthProvider, defaultSession, Session} from '../../auth'

type WrapProps = {
  props?: any
  session?: Session
  theme?: RsdThemes
}

export function WrappedComponentWithProps(Component: any, options?: WrapProps) {
  const theme = options?.theme ?? 'default'
  const session = options?.session ?? defaultSession
  const props = options?.props ?? {}

  const rsdMuiTheme = loadMuiTheme(theme)
  if (session) {
    return (
      <ThemeProvider theme={rsdMuiTheme}>
        <AuthProvider session={session}>
          <Component {...props} />
        </AuthProvider>
      </ThemeProvider>
    )
  }
  return (
    <ThemeProvider theme={rsdMuiTheme}>
      <AuthProvider session={defaultSession}>
        <Component { ...props }/>
      </AuthProvider>
    </ThemeProvider>
  )
}
