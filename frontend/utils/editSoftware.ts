import logger from './logger'
import {NewSoftwareItem, SoftwareTableItem} from '../types/SoftwareItem'

export function createHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export async function addSoftware({software, token}:
  { software: NewSoftwareItem, token: string}) {
  try {
    // console.log('addSoftware...called...', software)
    const url = '/api/v1/software'
    // make post request
    const resp = await fetch(url, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify(software)
    })
    if (resp.status === 201) {
      // no data response
      return {
        status: 201,
        message: software.slug
      }
    }
    // construct message
    const data = await resp.json()
    const message = data?.message ?? resp.statusText
    logger(`addSoftware: ${message}`, 'warn')
    // return message
    return {
      status: resp.status,
      message
    }
  } catch (e: any) {
    logger(`addSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function editSoftware({slug, token}: { slug: string, token: string }) {
  try {
    // GET
    const url = `/api/v1/software?slug=eq.${slug}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createHeaders(token),
    })
    if (resp.status === 200) {
      const data: SoftwareTableItem[] = await resp.json()
      return data[0]
    }
  } catch (e: any) {
    logger(`getSoftwareItem: ${e?.message}`, 'error')
  }
}

export async function updateSoftware({software, token}:
  { software: SoftwareTableItem, token:string }) {
  try {
    // PUT
    const url = `/api/v1/software?id=eq.${software.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(software)
    })
    debugger
    if ([200,204].includes(resp.status)) {
      // just return id
      return {
        status: 200,
        message: software.id
      }
    } else {
      const message = await resp.json()
      if (message) {
        return {
          status: resp.status,
          message
        }
      } else {
        return {
          status: resp.status,
          message: resp.statusText
        }
      }
    }
  } catch (e: any) {
    logger(`updateSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
