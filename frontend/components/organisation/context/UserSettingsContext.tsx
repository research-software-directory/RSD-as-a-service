// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useContext} from 'react'
import {LayoutOptions} from '~/components/cards/CardsLayoutOptions'

type UserSettingsContextProps = {
  rsd_page_rows: number,
  rsd_page_layout: LayoutOptions,
}

const UserSettingsContext = createContext<UserSettingsContextProps>({
  rsd_page_rows: 12,
  rsd_page_layout: 'grid'
})

export function UserSettingsProvider(props: any) {
  const {settings} = props

  // console.group('UserSettingsProvider')
  // console.log('settings...', settings)
  // console.log('userSettings....', userSettings)
  // console.groupEnd()

  // return context
  return <UserSettingsContext.Provider
    value={{
      ...settings
    }}
    {...props}
  />
}


export function useUserSettings() {
  const {rsd_page_rows, rsd_page_layout} = useContext(UserSettingsContext)

  // console.group('useUserSettings')
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.log('rsd_page_layout....', rsd_page_layout)
  // console.groupEnd()

  return {
    rsd_page_rows,
    rsd_page_layout
  }
}


export default UserSettingsContext
