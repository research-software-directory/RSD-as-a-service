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
import EmbedLayoutContext,{EmbedLayoutProp} from '~/components/layout/embedLayoutContext'

type WrapProps = {
  props?: any
  session?: Session
  theme?: RsdThemes
  embed?: EmbedLayoutProp
}

export function WrappedComponentWithProps(Component: any, options?: WrapProps) {
  const theme = options?.theme ?? 'default'
  const session = options?.session ?? defaultSession
  const props = options?.props ?? {}
  const embedMode = options?.embed?.embedMode ?? false
  const setEmbedMode = options?.embed?.setEmbedMode ?? function (embedMode) {
    // eslint-disable-next-line no-console
    console.log('setEmbedMode...',embedMode)
  }

  const rsdMuiTheme = loadMuiTheme(theme)
  if (session) {
    return (
      <ThemeProvider theme={rsdMuiTheme}>
        <AuthProvider session={session}>
          <EmbedLayoutContext.Provider value={{embedMode,setEmbedMode}}>
            <Component {...props} />
          </EmbedLayoutContext.Provider>
        </AuthProvider>
      </ThemeProvider>
    )
  }
  return (
    <ThemeProvider theme={rsdMuiTheme}>
      <AuthProvider session={defaultSession}>
        <EmbedLayoutContext.Provider value={{embedMode,setEmbedMode}}>
          <Component {...props} />
        </EmbedLayoutContext.Provider>
      </AuthProvider>
    </ThemeProvider>
  )
}
