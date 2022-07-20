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
import {RsdSettingsState,defaultRsdSettings, RsdTheme} from '~/config/rsdSettingsReducer'
import {RsdSettingsProvider} from '~/config/RsdSettingsContext'

type WrapProps = {
  props?: any
  session?: Session
  // theme?: RsdThemes
  settings?: RsdSettingsState
}

export function WrappedComponentWithProps(Component: any, options?: WrapProps) {
  const session = options?.session ?? defaultSession
  const props = options?.props ?? {}
  const settings = options?.settings ?? defaultRsdSettings
  // extract theme from rsd settings
  const theme = settings?.theme.mode ?? 'default'
  // load MUI theme
  const rsdMuiTheme = loadMuiTheme(theme as RsdThemes)

  return (
    <ThemeProvider theme={rsdMuiTheme}>
      <AuthProvider session={session}>
        <RsdSettingsProvider settings={settings}>
          <Component {...props} />
        </RsdSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
