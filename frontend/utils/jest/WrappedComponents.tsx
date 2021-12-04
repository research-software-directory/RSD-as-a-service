/**
 * Renders component wrapped with theme and sesion provider
 * @returns
 */

import {SessionProvider} from 'next-auth/react'
import {rsdTheme} from '../../styles/rsdTheme'
import {ThemeProvider} from '@mui/material/styles'

export function WrappedComponentWithProps(Component:any, props?:any){
  return (
    <ThemeProvider theme={rsdTheme}>
      <SessionProvider session={props?.session ?? undefined}>
        <Component { ...props }/>
      </SessionProvider>
    </ThemeProvider>
  )
}