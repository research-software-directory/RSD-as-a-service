// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
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
    if (resp.ok) {
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

export function getImageUrl(uid?: string|null) {
  if (uid) {
    return `/image/rpc/get_image?uid=${uid}`
  }
  return null
}

/**
 * Saves base64 image to RSD.
 * The base64 string must follow the pattern [data: {mime-type}; base64, {base64 data}]
 * @param param0
 * @returns
 */
export async function saveBase64Image({base64,token}:{base64:string,token:string}){
  if (base64.startsWith('data:')===true){
    const data = base64.split(',')
    // extract mime-type from string data:image/jpg;base64
    const mime_type = data[0].split(':')[1].split(';')[0]
    // raw base64 string to save
    const b64data = data[1]
    const upload = await upsertImage({
      data: b64data,
      mime_type,
      token
    })
    return upload
  } else {
    return {
      status: 400,
      message: 'Not a base64 string [saveBase64Image]'
    }
  }
}
