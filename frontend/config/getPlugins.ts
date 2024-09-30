// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import {PluginConfig} from '~/config/RsdPluginContext'

async function getPlugin({pluginName,token}:{pluginName: string, token?: string}){
  const url = `http://localhost/plugin/${pluginName}/api/config`
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
    logger(`Error loading plugin config from ${url}: ${error instanceof Error ? error.message : error}`,'warn')
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
