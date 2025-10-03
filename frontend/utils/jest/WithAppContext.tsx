// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ThemeProvider} from '@mui/material/styles'
import {loadMuiTheme} from '~/styles/rsdMuiTheme'
import {defaultSession,Session} from '~/auth'
import {AuthProvider} from '~/auth/AuthProvider'
import {LoginProvidersProvider} from '~/auth/loginProvidersContext'
import {Provider} from '~/auth/api/getLoginProviders'
import {RsdSettingsState,defaultRsdSettings} from '~/config/rsdSettingsReducer'
import {RsdSettingsProvider} from '~/config/RsdSettingsContext'
import {UserSettingsProps, UserSettingsProvider} from '~/config/UserSettingsContext'
import {SoftwareLayoutType} from '~/components/search/ToggleViewGroup'


export type WrapProps = {
  props?: any
  session?: Session
  settings?: RsdSettingsState
  user?: UserSettingsProps
  providers?: Provider[]
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

export const defaultUserSettings={
  rsd_page_layout:'grid' as SoftwareLayoutType,
  rsd_page_rows: 12,
  avatar_id: null
}

/**
 * Wraps the component with main app contexts: ThemeProvider, AuthProvider and RsdSettingsProvider
 * Component is provided as children
 * @param children, options
 * @returns React.JSX.Element
 */
export function WithAppContext({children,options}:WithAppContextProps) {
  const session = options?.session ?? defaultSession
  const settings = options?.settings ?? defaultRsdSettings
  // load MUI theme
  const {muiTheme} = loadMuiTheme(settings.theme)
  // user settings
  const user = options?.user ?? defaultUserSettings
  // providers list
  const providers = options?.providers ?? []

  // console.group('WithAppContext')
  // console.log('session...', session)
  // console.log('settings...', settings)
  // console.log('muiTheme...', muiTheme)
  // console.groupEnd()

  return (
    <ThemeProvider theme={muiTheme}>
      <AuthProvider session={session}>
        <RsdSettingsProvider settings={settings}>
          {/* User settings rows, page layout etc. */}
          <UserSettingsProvider user={user}>
            {/* Login providers list */}
            <LoginProvidersProvider providers = {providers}>
              {children}
            </LoginProvidersProvider>
          </UserSettingsProvider>
        </RsdSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
