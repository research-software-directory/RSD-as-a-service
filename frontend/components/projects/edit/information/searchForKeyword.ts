import logger from '../../../../utils/logger'

export type Keyword = {
  id: string,
  keyword: string,
  cnt: number | null
}

export type NewKeyword = {
  id: null,
  keyword: string
}

// this is always frontend call
export async function searchForKeyword({searchFor}:
  { searchFor: string }) {
  try {
    // GET top 50 matches
    const url = `/api/v1/rpc/keyword_count_for_projects?keyword=ilike.*${searchFor}*&order=keyword.asc&limit=50`
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
    logger(`searchForKeyword: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForKeyword: ${e?.message}`, 'error')
    return []
  }
}
