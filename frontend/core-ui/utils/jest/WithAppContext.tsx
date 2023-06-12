// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ThemeProvider} from '@mui/material/styles'
import {loadMuiTheme} from '../../styles/rsdMuiTheme'
import {AuthProvider,defaultSession,Session} from '../../auth'
import {RsdSettingsState,defaultRsdSettings} from '~/config/rsdSettingsReducer'
import {RsdSettingsProvider} from '~/config/RsdSettingsContext'

export type WrapProps = {
  props?: any
  session?: Session
  settings?: RsdSettingsState
}

type WithAppContextProps = {
  children: any,
  options?: WrapProps
}

export const mockSession:Session = {
  user: {
    iss: 'rsd_auth',
    role: 'rsd_user',
    // expiration time in seconds need to be in future
    exp: new Date().getTime()/1000 + (60*60),
    // uid
    account: '121212121212',
    // display name
    name: 'John Doe'
  },
  token: 'TEST_TOKEN',
  status: 'authenticated'
}

/**
 * Wraps the component with main app contexts: ThemeProvider, AuthProvider and RsdSettingsProvider
 * Component is provided as children
 * @param children, options
 * @returns JSX.Element
 */
export function WithAppContext({children,options}:WithAppContextProps) {
  const session = options?.session ?? defaultSession
  const settings = options?.settings ?? defaultRsdSettings
  // load MUI theme
  const {muiTheme} = loadMuiTheme(settings.theme)

  // console.group('WithAppContext')
  // console.log('session...', session)
  // console.log('settings...', settings)
  // console.groupEnd()

  return (
    <ThemeProvider theme={muiTheme}>
      <AuthProvider session={session}>
        <RsdSettingsProvider settings={settings}>
          {children}
        </RsdSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
