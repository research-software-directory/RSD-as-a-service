// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {IncomingMessage} from 'http'
import {ParsedUrlQuery} from 'querystring'

import logger from '~/utils/logger'
import {getPageLinks} from '~/components/admin/pages/useMarkdownPages'
import {defaultRsdSettings, RsdSettingsState} from './rsdSettingsReducer'
import defaultSettings from '~/config/defaultSettings.json'

/**
 * getThemeSettings from local json file
 * theme.json can be mounted in the doceker image into settings folder.
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
      return defaultSettings
    }
  } catch (e: any) {
    logger(`Failed to load theme settings. ${e.message}`, 'error')
    // return default settings
    return defaultSettings
  }
}

export async function getSettingsServerSide(req: IncomingMessage | undefined, query: ParsedUrlQuery): Promise<RsdSettingsState> {
  // if not SSR we return default
  if (typeof req === 'undefined') return defaultRsdSettings as RsdSettingsState
  // get links
  const pages = await getPageLinks({is_published: true})
  // extract embed flag
  const embed = typeof query?.embed !== 'undefined'
  // get settings (host and theme)
  const settings = await getRsdSettings()
  // compose all settings
  const rsdSettings = {
    ...defaultRsdSettings,
    host: settings.host,
    links: settings.links,
    theme: settings.theme,
    pages,
    embed,
  }
  // console.group('getSettingsServerSide')
  // console.log('rsdSettings...', rsdSettings)
  // console.groupEnd()

  return rsdSettings
}
