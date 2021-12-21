/**
 * Renders component wrapped with theme and sesion provider
 * @returns
 */

import {SessionProvider} from "next-auth/react"
import {rsdMuiTheme} from "../../styles/rsdMuiTheme"
import {ThemeProvider} from "@mui/material/styles"

export function WrappedComponentWithProps(Component:any, props?:any){
  return (
    <ThemeProvider theme={rsdMuiTheme}>
      <SessionProvider session={props?.session ?? undefined}>
        <Component { ...props }/>
      </SessionProvider>
    </ThemeProvider>
  )
}
