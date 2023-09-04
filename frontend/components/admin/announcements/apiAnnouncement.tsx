// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type NewAnnouncement = {
  enabled: boolean
  text: string | null
}

export type AnnouncementItem = NewAnnouncement & {
  id: boolean
}

export async function getAnnouncement(token?:string) {
  try {
    const url = getBaseUrl() + '/global_announcement?select=id,enabled,text'
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })

    if (resp.status === 200) {
      const json = await resp.json()
      if (json.length > 0) {
        return json[0] as AnnouncementItem
      }
      return null
    }
    // unexpected return status
    logger(`getAnnouncement: ${resp?.status}-${resp.statusText}`,'warn')
    return null
  } catch (e: any) {
    logger(`getAnnouncement: ${e?.message}`, 'error')
    return null
  }
}

export async function saveAnnouncement(item: AnnouncementItem, token: string) {
  try {
    let url = `${getBaseUrl()}/global_announcement`
    let method = 'POST'
    if (item.id) {
      url += `?id=eq.${item.id}`
      method = 'PATCH'
    }
    const resp = await fetch(url, {
      method,
      headers: {
        ...createJsonHeaders(token),
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        enabled: item.enabled,
        text: item.text
      })
    })
    if ([200, 201, 204].includes(resp.status)) {
      const json = await resp.json()
      return {
        status: 200,
        message: json[0]
      }
    }
    logger(`saveAnnouncement: ${resp?.status}-${resp.statusText}`, 'warn')
    return extractReturnMessage(resp, item.text ?? '')
  } catch (e: any) {
    logger(`saveAnnouncement: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
