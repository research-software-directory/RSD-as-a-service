// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'
import logger from './logger'

export async function upsertImage({data, mime_type, token}: {
  data: string, mime_type: string, token: string
}) {
  try {
    // POST
    const url = '/api/v1/image'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates,return=headers-only'
      },
      body: JSON.stringify({
        // project,
        data,
        mime_type
      })
    })
    if (resp.status === 201) {
      const id = resp.headers.get('location')?.split('.')[1]
      if (id) {
        return {
          status: 201,
          message: id
        }
      }
      return {
        status: 400,
        message: 'Id is missing'
      }
    }
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`addImage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteImage({id, token}: {
  id: string, token: string
}) {
  try {
    // POST
    const url = `/api/v1/image?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`deleteImage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export function getImageUrl(uid: string|null) {
  if (uid) {
    return `/image/rpc/get_image?uid=${uid}`
  }
  return null
}
