import {createJsonHeaders} from '../../utils/fetchHelpers'
import logger from '../../utils/logger'

export async function isMaintainerOfSoftware({slug, account, token, frontend = true}:
  { slug?: string, account?: string, token?: string, frontend?: boolean }) {
  try {
    // return false directly when missing info
    if (!slug || !account || !token) return false
    // build url
    let url = `/api/v1/maintainer_for_software_by_slug?maintainer=eq.${account}&slug=eq.${slug}`
    if (frontend == false) {
      url = `${process.env.POSTGREST_URL}/maintainer_for_software_by_slug?maintainer=eq.${account}&slug=eq.${slug}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    // MAINTAINER
    if (resp.status === 200) {
      const json = await resp.json()
      // it should return exactly 1 item
      if (json?.length === 1) {
        // having maintainer equal to uid
        return json[0].maintainer === account
      }
      return false
    }
    // ERRORS AS NOT MAINTAINER
    logger(`isMaintainerOfSoftware: Not a maintainer of ${slug}. ${resp.status}:${resp.statusText}`, 'warn')
    return false
  } catch (e: any) {
    logger(`isMaintainerOfSoftware: ${e?.message}`, 'error')
    // ERRORS AS NOT MAINTAINER
    return false
  }
}

export default isMaintainerOfSoftware
