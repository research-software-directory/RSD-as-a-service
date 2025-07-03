// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {IncomingMessage} from 'http'

import logger from '~/utils/logger'
import {getPageLinks} from '~/components/admin/pages/useMarkdownPages'
import {defaultRsdSettings, RsdModule, RsdSettingsState} from './rsdSettingsReducer'
import defaultSettings from '~/config/defaultSettings.json'
import {getAnnouncement} from '~/components/admin/announcements/apiAnnouncement'

// cache module list
let modules:RsdModule[]=[]

/**
 * getThemeSettings from local json file
 * theme.json can be mounted in the docker image into settings folder.
 * If file is not found we use default settings file
 * @returns
 */
export async function getRsdSettings() {
  try {
    // node request to localhost to load local json file
    const url = 'http://localhost:3000/data/settings.json'
    const resp = await fetch(url)
    if (resp.status === 200) {
      const json: RsdSettingsState = await resp.json()
      return json
    } else {
      logger(`Failed to load theme settings. ${resp.status} ${resp.statusText}`, 'warn')
      // return default settings
      return defaultSettings as RsdSettingsState
    }
  } catch (e: any) {
    logger(`Failed to load theme settings. ${e.message}`, 'error')
    // return default settings
    return defaultSettings as RsdSettingsState
  }
}

export async function getSettingsServerSide(req: IncomingMessage | undefined): Promise<RsdSettingsState> {
  // if not SSR we return default
  if (typeof req === 'undefined') return defaultRsdSettings as RsdSettingsState
  // get links, settings and announcements in parallel
  const [pages, settings, announcement] = await Promise.all([
    getPageLinks({is_published: true}),
    getRsdSettings(),
    getAnnouncement()
  ])

  // set default values that should not be overwritten if they don't exist in settings.host
  if (!settings.host.software_highlights) {
    settings.host.software_highlights = defaultSettings.host.software_highlights
  }
  // use default modules if custom not provided
  if (!settings.host.modules){
    settings.host.modules = defaultRsdSettings.host.modules
  }

  // compose all settings
  const rsdSettings:RsdSettingsState = {
    ...defaultRsdSettings,
    host: settings.host,
    links: settings.links,
    theme: settings.theme,
    pages,
    announcement: announcement?.enabled ? announcement?.text : undefined
  }
  // console.group('getSettingsServerSide')
  // console.log('rsdSettings...', rsdSettings)
  // console.groupEnd()
  return rsdSettings
}

/**
 * Get RSD modules from settings.json server side
 * @returns
 */
export async function getRsdModules(){
  try{
    if (modules?.length > 0 && process.env.NODE_ENV == 'production'){
      // console.log('cached modules...', modules)
      return modules
    }
    const settings = await getRsdSettings()

    if (Array.isArray(settings?.host?.modules)===true){
      modules = settings.host.modules
      return modules
    }
    // console.log('default modules...', defaultRsdSettings.host.modules)
    // use default modules
    return defaultRsdSettings.host.modules ?? []
  }catch(e:any){
    logger(`getRsdModules failed: ${e?.message}`,'warn')
    // use default modules on error
    return defaultRsdSettings.host.modules ?? []
  }
}
