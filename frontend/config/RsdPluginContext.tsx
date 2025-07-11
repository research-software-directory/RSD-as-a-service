// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {createContext, useContext, useEffect, useState} from 'react'

// Defines the possible names for plugin slots, referred by the individual components
export type PluginSlot = 'userMenu'|'editSoftwareNav'

export type PluginConfig = {
  // name of the plugin (as defined in settings.host.plugins)
  name: string,
  // location / slot
  slot: PluginSlot,
  // svg icon as string (it will be passed to SvgFromString component)
  // original height and width will be removed from svg string
  icon: string,
  href: string,
  title: string,
  subtitle: string | null
}

export const RsdPluginContext = createContext<{settings:PluginConfig[]}>({settings:[]})

export default function PluginSettingsProvider(props: any) {
  const [settings, setSettings] = useState(props?.settings ?? [])

  return <RsdPluginContext.Provider
    value={{settings,setSettings}}
    {...props}
  />
}

export function usePluginSlots(slot:PluginSlot){
  // load all plugin items
  const {settings} = useContext(RsdPluginContext)
  const [pluginSlots,setPluginSlots] = useState<PluginConfig[]>([])

  useEffect(()=>{
    let abort = false
    // filter slots for specific location
    if (settings?.length>0){
      const slots = settings.filter(item=>item.slot === slot)
      // check abort
      if (abort) return
      setPluginSlots(slots)
    }
    // cleanup
    return ()=>{abort=true}
  },[settings,slot])

  // console.group('usePluginSlots')
  // console.log('slot...',slot)
  // console.log('settings...',settings)
  // console.log('pluginSlots...',pluginSlots)
  // console.groupEnd()

  // debugger
  // return all found items
  return pluginSlots
}
