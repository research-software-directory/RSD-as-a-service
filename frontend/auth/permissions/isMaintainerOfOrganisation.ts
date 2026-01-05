// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {OrganisationsOfProject} from '~/types/Project'
import {EditOrganisation, OrganisationsForSoftware, OrganisationSource} from '~/types/Organisation'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
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

async function isMaintainerOfOrganisation({organisation, account, token}: IsMaintainerOfOrganisationProps) {
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
{token?: string}) {
  try {
    // without token api request is not needed
    if (!token) return []
    // build url
    const query = 'rpc/organisations_of_current_maintainer'
    const url = `${getBaseUrl()}/${query}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const json:string[] = await resp.json()
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

type CanEditOrganisationsProps={
  account?: string
  token?: string
  organisations: OrganisationsOfProject[]| OrganisationsForSoftware[]
}

export async function canEditOrganisations({organisations,account,token}:CanEditOrganisationsProps){
  try{
    // collect isMaintainerRequests
    const promises:Promise<boolean>[] = []
    // prepare organisation list
    const orgList = organisations.map((item, pos) => {
      // save isMaintainer request
      promises.push(isMaintainerOfOrganisation({
        organisation: item.id,
        account,
        token
      }))
      // extract only needed props
      const org: EditOrganisation = {
        ...item,
        // additional props for edit type
        position: pos + 1,
        logo_b64: null,
        logo_mime_type: null,
        source: 'RSD' as OrganisationSource,
        status: item.status,
        // false by default
        canEdit: false
      }
      return org
    })
    // run all isMaintainer requests in parallel
    const isMaintainer = await Promise.all(promises)
    const canEditOrganisations = orgList.map((item, pos) => {
      // update canEdit based on isMaintainer requests
      if (isMaintainer[pos]) item.canEdit = isMaintainer[pos]
      return item
    })
    return canEditOrganisations
  }catch(e:any){
    logger(`canEditOrganisations: ${e.message}`, 'error')
    // on error all items set to false
    return organisations.map((item, pos) => {
      // extract only needed props
      const org: EditOrganisation = {
        ...item,
        // additional props for edit type
        position: pos + 1,
        logo_b64: null,
        logo_mime_type: null,
        source: 'RSD' as OrganisationSource,
        status: item.status,
        // false by default
        canEdit: false
      }
      return org
    })
  }
}
