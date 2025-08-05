// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {createContext, useState} from 'react'
import {Provider} from './api/getLoginProviders'

export type LoginProvidersContextProps={
  providers: Provider[]
  setProviders: (provider:Provider[])=>void
}

export const LoginProvidersContext = createContext<LoginProvidersContextProps>({
  providers: [],
  setProviders:()=>{}
})

export function LoginProvidersProvider(props:any){
  const [providers,setProviders] = useState(props?.providers ?? [])

  // console.group('LoginProvidersProvider')
  // console.log('props?.providers...', props?.providers)
  // console.log('providers...', providers)
  // console.groupEnd()

  return <LoginProvidersContext.Provider
    value={{providers,setProviders}}
    {...props}
  />
}
