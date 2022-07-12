import {createContext, useState} from 'react'

import {colors,action, muiTypography} from './rsd/default'
export type MuiColorSchema = typeof colors
export type MuiActionSchema = typeof action
export type MuiTypography = typeof muiTypography

export type RsdThemeHost = 'default' | 'hemholtz' | 'nlesc'
export type RsdThemeMode = 'default' | 'dark'

export type RsdThemeProps = {
  host: RsdThemeHost,
  mode: RsdThemeMode
}

export type RsdThemeContextProps = {
  theme: RsdThemeProps,
  setTheme: (thene:RsdThemeProps)=>void
}

const RsdThemeOptions = createContext<RsdThemeContextProps>({
  theme: {
    host:'default',
    mode:'default'
  },
  setTheme:()=>{}
})

export function RsdThemeOptionsProvider(props: any) {
  // extract rsdTheme from props
  const {options, ...others} = props
  // set theme props
  const [theme, setTheme] = useState<RsdThemeProps>(options)

  // console.log('RsdThemeOptionsProvider...', theme)

  return <RsdThemeOptions.Provider value={{
      theme,
      setTheme
    }}
    // pass all other props down
    {...others}
    />
}


export default RsdThemeOptions
