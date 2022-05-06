import {Keyword} from '~/components/keyword/FindKeyword'
import logger from '../../../../utils/logger'


// this is always frontend call
export async function searchForSoftwareKeyword({searchFor}:
  { searchFor: string }) {
  try {
    // GET top 50 matches
    const url = `/api/v1/rpc/keyword_count_for_software?keyword=ilike.*${searchFor}*&order=keyword.asc&limit=50`
    const resp = await fetch(url, {
      method: 'GET'
    })
    if (resp.status === 200) {
      const json: Keyword[] = await resp.json()
      if (json.length > 0) {
        return json
      }
      return []
    }
    // return extractReturnMessage(resp, project ?? '')
    logger(`searchForSoftwareKeyword: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForSoftwareKeyword: ${e?.message}`, 'error')
    return []
  }
}
