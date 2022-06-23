// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders} from '../../utils/fetchHelpers'
import logger from '../../utils/logger'

type IsMaintainerOfOrganisationProps = {
  organisation: string
  account?: string
  token?: string
  frontend?: boolean
}

export async function isMaintainerOfOrganisation({organisation, account, token, frontend}: IsMaintainerOfOrganisationProps) {
  try {
    if (typeof account == 'undefined' ||
    typeof token == 'undefined') {
      // if no account and token provided
      return false
    }
    const organisations = await getMaintainerOrganisations({
      token,
      frontend
    })
    // debugger
    if (organisations.length > 0) {
      const isMaintainer = organisations.includes(organisation)
      return isMaintainer
    }
    return false
  } catch (e:any) {
    logger(`isMaintainerOfOrganisation: ${e?.message}`, 'error')
    // ERRORS AS NOT MAINTAINER
    return false
  }
}

export async function getMaintainerOrganisations({token, frontend = true}: { token: string, frontend?: boolean }) {
  try {
    const query = 'rpc/organisations_of_current_maintainer'
    let url = `/api/v1/${query}`
    if (frontend===false) {
      url = `${process.env.POSTGREST_URL}/${query}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const json = await resp.json()
      return json
    }
    // ERRORS AS NOT MAINTAINER
    logger(`getMaintainerOrganisations: ${resp.status}:${resp.statusText}`, 'warn')
    return []
  } catch(e:any) {
    // ERRORS AS NOT MAINTAINER
    logger(`getMaintainerOrganisations: ${e.message}`, 'error')
    return []
  }
}

export async function isPrimaryMaintainer({organisation, account, token, frontend}: IsMaintainerOfOrganisationProps) {
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

export async function isMaintainer({organisation,account,token,frontend}: IsMaintainerOfOrganisationProps) {
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
