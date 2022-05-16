import {Keyword} from '~/components/keyword/FindKeyword'
import logger from '../../../../utils/logger'


// this is always frontend call
export async function searchForSoftwareKeyword(
  {searchFor}: { searchFor: string }
) {
  try {
    const searchForEncoded = encodeURIComponent(searchFor)

    // GET top 50 matches
    const url = `/api/v1/rpc/keyword_count_for_software?keyword=ilike.*${searchForEncoded}*&order=keyword.asc&limit=50`
    const resp = await fetch(url, {
      method: 'GET'
    })

    if (resp.status === 200) {
      const json: Keyword[] = await resp.json()
      return json
    }

    // return extractReturnMessage(resp, project ?? '')
    logger(`searchForSoftwareKeyword: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForSoftwareKeyword: ${e?.message}`, 'error')
    return []
  }
}

export async function searchForSoftwareKeywordExact(
  {searchFor}: { searchFor: string }
) {
  try {
    const searchForEncoded = encodeURIComponent(searchFor)

    // GET top 50 matches
    const url = `/api/v1/rpc/keyword_count_for_software?keyword=eq.${searchForEncoded}&limit=1`
    const resp = await fetch(url, {
      method: 'GET'
    })

    if (resp.status === 200) {
      const json: Keyword[] = await resp.json()
      return json
    }

    // return extractReturnMessage(resp, project ?? '')
    logger(`searchForSoftwareKeywordExact: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForSoftwareKeywordExact: ${e?.message}`, 'error')
    return []
  }
}
