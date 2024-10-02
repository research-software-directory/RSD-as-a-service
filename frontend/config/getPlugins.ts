// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import {PluginConfig} from '~/config/RsdPluginContext'
import {RsdPluginSettings} from './rsdSettingsReducer'

function constructBackendUrl(pluginSettings: RsdPluginSettings) {
  const {name, backend_hostname} = pluginSettings
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost/plugin/${name}`
  } else {
    return `http://${backend_hostname}/plugin/${name}`
  }
}

async function getPlugin({pluginSettings, token}:{pluginSettings: RsdPluginSettings, token?: string}){
  const url = constructBackendUrl(pluginSettings) + '/api/config'
  console.log(url)
  try {
    const response = await fetch(url, {
      headers: {
        ...createJsonHeaders(token)
      },
      signal: AbortSignal.timeout(200)
    })

    if (response.ok) {
      const json:PluginConfig[] = await response.json()
      const config:PluginConfig[] = json.map(item=>{
        return {
          ...item,
          // add plugin name
          name: pluginSettings.name
        }
      })
      return config
    }
    logger(`Failed to load plugin config from ${url}: ${response.status} ${response.statusText}`,'warn')
    return []

  } catch (error) {
    if (error instanceof TypeError) {
      const message = error.message
      const cause = error.cause
      logger(`Error loading plugin config from ${url}. Message: ${message}. Cause: ${cause}.`,'warn')
    } else {
      logger(`Error loading plugin config from ${url}: ${error}`,'warn')
    }
    return []
  }
}

export default async function getPlugins(
  {plugins, token}: {plugins?: RsdPluginSettings[], token?: string}
) {
  if (!plugins) {
    return []
  }
  // create all requests
  const promises = plugins?.map(pluginSettings=>getPlugin({pluginSettings, token}))
  // execute all requests
  const pluginSlots = await Promise.all(promises)
  // flatten definitions
  return pluginSlots.flat()
}
