// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {PluginSlot} from '~/config/RsdPluginContext'
import {createJsonHeaders} from './fetchHelpers'
import logger from './logger'

export default async function getUserPlugins(
  token?: string, plugins?: string[]
) {
  if (!token || !plugins) {
    return []
  }

  const promises = plugins?.map(async pluginPath => {
    const url = `http://localhost/modules/${pluginPath}/config`
    try {
      const response = await fetch(url, {
        headers: {
          ...createJsonHeaders(token)
        },
        signal: AbortSignal.timeout(200)
      })
      if (!response.ok) {
        logger(`Failed to load plugin config from ${url}: ${response.status} ${response.statusText}`)
        return []
      }
      return response.json() as Promise<PluginSlot>
    } catch (error) {
      logger(`Error loading plugin config from ${url}: ${error instanceof Error ? error.message : error}`)
      return []
    }
  })

  const pluginSlots = await Promise.all(promises ?? []) as PluginSlot[]
  return pluginSlots.flat()
}
