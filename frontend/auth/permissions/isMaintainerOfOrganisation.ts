// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from '../../utils/fetchHelpers'
import logger from '../../utils/logger'
import {RsdRole} from '../index'

type IsOrganisationMaintainerProps = {
  organisation: string
  role?: RsdRole
  account?: string
  token?: string
}

export async function isOrganisationMaintainer({organisation, role, account, token}: IsOrganisationMaintainerProps) {
  // if no token no check needed
  if (typeof token === 'undefined') return false
  // if organisation provided and user role rsd_admin
  if (organisation && role === 'rsd_admin' && account) {
    return true
  }
  // make request
  const isMaintainer = await isMaintainerOfOrganisation({
    organisation,
    account,
    token
  })

  // console.group('isOrganisationMaintainer')
  // console.log('isMaintainer...', isMaintainer)
  // console.groupEnd()

  return isMaintainer
}

type IsMaintainerOfOrganisationProps = {
  organisation: string
  account?: string
  token?: string
}

export async function isMaintainerOfOrganisation({organisation, account, token}: IsMaintainerOfOrganisationProps) {
  try {
    if (typeof account == 'undefined' ||
    typeof token == 'undefined') {
      // if no account and token provided
      return false
    }
    const organisations = await getMaintainerOrganisations({
      token
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

export async function getMaintainerOrganisations({token}:
  {token: string}) {
  try {
    // without token api request is not needed
    if (!token) return []
    // build url
    const query = 'rpc/organisations_of_current_maintainer'
    let url = `${getBaseUrl()}/${query}`
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
