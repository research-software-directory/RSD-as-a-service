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

export async function getMaintainerOrganisations({token, frontend = true}:
  {token: string, frontend?: boolean}) {
  try {
    // without token api request is not needed
    if (!token) return []
    // build url
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


export default isMaintainerOfOrganisation
