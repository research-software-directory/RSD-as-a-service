import logger from '~/utils/logger'
import {createJsonHeaders} from '~/utils/fetchHelpers'

/**
 *
 * @param searchText
 * @param token
 */
export async function getGlobalSearch(searchText: string, token: string,) {
  try {
    // call the function query
    const query = `rpc/global_search?name=ilike.*${searchText}*&limit=10`
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
