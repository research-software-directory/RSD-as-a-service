import logger from './logger'
import {NewSoftwareItem, SoftwareTableItem} from '../types/SoftwareItem'

function createHeaders(token: string) {
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
    // this request is always perfomed from backend
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
