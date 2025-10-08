// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use server'

import logger from '~/utils/logger'
import {getPageLinks} from '~/components/admin/pages/useMarkdownPages'
import {activeModulesKeys, defaultRsdSettings, RsdModules, RsdSettingsState} from './rsdSettingsReducer'
import defaultSettings from '~/config/defaultSettings.json'
import {getAnnouncement} from '~/components/admin/announcements/apiAnnouncement'

// cache active module list
let rsdModules:RsdModules

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
      return defaultSettings as unknown as RsdSettingsState
    }
  } catch (e: any) {
    logger(`Failed to load theme settings. ${e.message}`, 'error')
    // return default settings
    return defaultSettings as unknown as RsdSettingsState
  }
}

/**
 * App server side
 * @returns
 */
export async function getAppSettingsServerSide(): Promise<RsdSettingsState> {
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
  if (!settings.modules){
    settings.modules = {
      ...defaultRsdSettings.modules
    }
  }

  // compose all settings
  const rsdSettings:RsdSettingsState = {
    ...defaultRsdSettings,
    host: settings.host,
    modules: settings.modules,
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
    if (rsdModules && process.env.NODE_ENV == 'production'){
      // console.log('cached modules...', rsdModules)
      return rsdModules
    }
    const settings = await getRsdSettings()

    if (settings?.modules){
      // cache modules
      rsdModules = {
        ...settings.modules
      }
      return rsdModules
    }
    // console.log('default modules...', defaultRsdSettings.modules)
    // use default modules
    return defaultRsdSettings.modules
  }catch(e:any){
    logger(`getRsdModules failed: ${e?.message}`,'warn')
    // use default modules on error
    return defaultRsdSettings.modules
  }
}

/**
 * Get RSD modules from settings.json server side
 * @returns
 */
export async function getActiveModuleNames(){
  try{
    const rsdModules = await getRsdModules()
    const activeModules = activeModulesKeys(rsdModules)
    return activeModules
  }catch(e:any){
    logger(`getActiveModuleNames failed: ${e?.message}`,'warn')
    // use default modules on error
    return activeModulesKeys(defaultRsdSettings.modules)
  }
}
