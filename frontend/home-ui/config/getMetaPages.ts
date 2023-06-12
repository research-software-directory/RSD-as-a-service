import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {RsdLink} from './rsdSettingsReducer'
import logger from '~/utils/logger'

export async function getMetaPages({is_published = true, token}: { is_published?: boolean, token?: string }) {
  try {
    // use server side when available
    const baseUrl = getBaseUrl()
    // get published meta pages ordered by position
    let query = 'meta_pages?select=id,slug,title,position,is_published&order=position'
    if (is_published) {
      query += '&is_published=eq.true'
    }
    const url = `${baseUrl}/${query}`

    // get page
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    if (resp.status === 200) {
      const json: RsdLink[] = await resp.json()
      return json
    }
    logger(`getMetaPages failed: ${resp?.status} ${resp.statusText}`, 'error')
    return []

  } catch (e: any) {
    logger(`getMetaPages: ${e?.message}`, 'error')
    return []
  }
}
