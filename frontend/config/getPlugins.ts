// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import {PluginConfig} from '~/config/RsdPluginContext'


function getPluginBaseUrl(pluginName: string) {
  if (/^(https?:\/\/)/.test(pluginName)) {
    return pluginName
  } else if (process.env.NODE_ENV === 'development') {
    return `http://localhost/plugin/${pluginName}`
  } else {
    const baseUrl = process.env.RSD_REVERSE_PROXY_URL ?? 'http://nginx'
    return `${baseUrl}/plugin/${pluginName}`
  }
}

async function getPlugin({pluginName, token}:{pluginName: string, token?: string}){
  const url = getPluginBaseUrl(pluginName) + '/api/v1/config'
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
          name: pluginName
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
  {plugins,token}: {plugins?: string[], token?: string}
) {
  if (!plugins) {
    return []
  }
  // create all requests
  const promises = plugins?.map(pluginName=>getPlugin({pluginName,token}))
  // execute all requests
  const pluginSlots = await Promise.all(promises)
  // flatten definitions
  return pluginSlots.flat()
}
