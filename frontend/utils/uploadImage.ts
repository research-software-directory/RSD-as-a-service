import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'

/**
 * This function create SHA-1 hash from an string. We use it to create unique id
 * for each image we save as base64 encoded string.
 * This code is borrowed from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 * @param message
 * @returns
 */
export async function hashBase64Image(message: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  // convert buffer to byte array
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  // convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  // return sha1 hash string
  return hashHex
}

async function saveLogo({id, data, mime_type, token}:
  { id: string, data: string, mime_type: string, token: string }) {
  try {
    const url = '/api/v1/logos'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id,
        data,
        mime_type
      })
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function uploadBase64Logo({b64image, mime_type, token}:
  {b64image: string, mime_type: string, token: string }) {
  try {
    const base64 = b64image.split(',')[1]
    // construct hash id
    const hash = await hashBase64Image(base64)
    // save image to db
    const resp = await saveLogo({
      id: hash,
      data: base64,
      mime_type,
      token
    })
    if ([200,201,204].includes(resp.status)) {
      // on success return image url
      return {
        status: 201,
        message: hash
      }
    }
    // on error return error result
    return resp
  } catch (e:any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}
