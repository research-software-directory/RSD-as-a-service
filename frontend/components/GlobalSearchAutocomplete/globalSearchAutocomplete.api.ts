import logger from '~/utils/logger'
import {createJsonHeaders} from '~/utils/fetchHelpers'

export type GlobalSearchResults = {
  slug: string,
  name: string,
  source: string,
  is_published?: boolean,
  search_text?: string
} | undefined

/**
 *
 * @param searchText
 * @param token
 */
export async function getGlobalSearch(searchText: string, token: string,) {
  try {
    // call the function query
    const query = `rpc/global_search?search_text=ilike.*${searchText}*&limit=30`
    let url = `/api/v1/${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    if (resp.status === 200) {
      const rawData: GlobalSearchResults[] = await resp.json()
      return rawData
    }
  } catch (e: any) {
    logger(`getGlobalSearch: ${e?.message}`, 'error')
    return []
  }
}
