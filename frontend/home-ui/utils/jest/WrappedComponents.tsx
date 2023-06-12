// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Renders component wrapped with theme and auth provider
 * @returns
 */

// import {SessionProvider} from 'next-auth/react'
import {ThemeProvider} from '@mui/material/styles'
import {loadMuiTheme} from '../../styles/rsdMuiTheme'
import {AuthProvider,defaultSession} from '../../auth'
import {defaultRsdSettings} from '~/config/rsdSettingsReducer'
import {RsdSettingsProvider} from '~/config/RsdSettingsContext'
import {WrapProps} from './WithAppContext'

export function WrappedComponentWithProps(Component: any, options?: WrapProps) {
  const session = options?.session ?? defaultSession
  const props = options?.props ?? {}
  const settings = options?.settings ?? defaultRsdSettings
  // load MUI theme
  const {muiTheme} = loadMuiTheme(settings.theme)

  return (
    <ThemeProvider theme={muiTheme}>
      <AuthProvider session={session}>
        <RsdSettingsProvider settings={settings}>
          <Component {...props} />
        </RsdSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
