/**
 * Renders component wrapped with theme and auth provider
 * @returns
 */

// import {SessionProvider} from 'next-auth/react'
import {rsdMuiTheme} from '../../styles/rsdMuiTheme'
import {ThemeProvider} from '@mui/material/styles'
import {AuthProvider, defaultSession, Session} from '../../auth'

export function WrappedComponentWithProps(Component: any, props?: any, session?: Session) {
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

export function WrappedComponentWithPropsAndSession({Component, props = {}, session}:
  { Component: any, props?: any, session?: Session }) {
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
