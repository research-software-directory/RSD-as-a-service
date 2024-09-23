// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {createContext} from 'react'

// Defines the possible names for plugin slots, referred by the individual components
export enum PluginSlotNames {
  userMenu = 'userMenu',
  editSoftwareNav = 'editSoftwareNav',
}

export type PluginSlot={
  name: PluginSlotNames,
  icon: string,
  href: string,
  title: string,
  subtitle: string | null
}

export type RsdPluginProps = {
  pluginSlots: PluginSlot[]
}

export const RsdPluginContext = createContext<RsdPluginProps>({
  pluginSlots: []
})

export default function PluginSettingsProvider(props: any) {
  const {pluginSlots} = props

  return <RsdPluginContext.Provider
    value={{pluginSlots}}
    {...props}
  />
}
