// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {createContext, useReducer} from 'react'
import {
  RsdSettingsDispatch, RsdSettingsState,
  defaultRsdSettings, rsdSettingsReducer,
} from './rsdSettingsReducer'

export type RsdSettingsProps = {
  state: RsdSettingsState
  dispatch: RsdSettingsDispatch
}

export const RsdSettingsContext = createContext<RsdSettingsProps>({
  state: defaultRsdSettings,
  dispatch: ()=>{}
})


export function RsdSettingsProvider(props: any) {
  const {settings} = props
  const [state, dispatch] = useReducer(rsdSettingsReducer, settings ?? defaultRsdSettings)
  return <RsdSettingsContext.Provider
    value={{state, dispatch}}
    {...props}
  />
}


