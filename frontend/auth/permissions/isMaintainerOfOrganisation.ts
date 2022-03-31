import {createJsonHeaders} from '../../utils/fetchHelpers'
import logger from '../../utils/logger'

type IsMaintainerOfOrganisationProps = {
  organisation: string
  account: string
  token: string
  frontend?: boolean
}

export async function isMaintainerOfOrganisation({organisation, account, token, frontend}: IsMaintainerOfOrganisationProps) {
  try {
    const [primary, maintainer] = await Promise.all([
      isPrimaryMaintainer({
        organisation, account, token, frontend
      }),
      isMaintainer({
        organisation, account, token, frontend
      })
    ])
    // can be primary or any maintainer
    if (primary === true) return true
    if (maintainer === true) return true
    // otherwise not a maintainer
    return false
  } catch (e:any) {
    logger(`isMaintainerOfOrganisation: ${e?.message}`, 'error')
    // ERRORS AS NOT MAINTAINER
    return false
  }
}

async function isPrimaryMaintainer({organisation, account, token, frontend}: IsMaintainerOfOrganisationProps) {
  try {
    let url = `/api/v1/organisation?select=primary_maintainer&id=eq.${organisation}`
    if (frontend == false) {
      url = `${process.env.POSTGREST_URL}/organisation?select=primary_maintainer&id=eq.${organisation}`
    }
    const resp = await fetch(url,{
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    // MAINTAINER
    if (resp.status === 200) {
      const json = await resp.json()
      // it should return exactly 1 item
      if (json?.length === 1) {
        // having maintainer equal to uid
        return json[0].primary_maintainer === account
      }
      return false
    }
    // ERRORS AS NOT MAINTAINER
    logger(`isPrimaryMaintainer: Not a maintainer of ${organisation}. ${resp.status}:${resp.statusText}`, 'warn')
    return false
  } catch (e:any) {
    logger(`isPrimaryMaintainer: ${e?.message}`, 'error')
    // ERRORS AS NOT MAINTAINER
    return false
  }
}

async function isMaintainer({organisation,account,token,frontend}: IsMaintainerOfOrganisationProps) {
  try {
    let url = `/api/v1/maintainer_for_organisation?maintainer=eq.${account}&organisation=eq.${organisation}`
    if (frontend == false) {
      url = `${process.env.POSTGREST_URL}/maintainer_for_organisation?maintainer=eq.${account}&organisation=eq.${organisation}`
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
    logger(`isMaintainer: Not a maintainer of ${organisation}. ${resp.status}:${resp.statusText}`, 'warn')
    return false
  } catch (e: any) {
    logger(`isMaintainer: ${e?.message}`, 'error')
    // ERRORS AS NOT MAINTAINER
    return false
  }
}


export default isMaintainerOfOrganisation
