// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getOrganisationsForSoftware} from '~/utils/editOrganisation'
import isMaintainerOfOrganisation from '~/auth/permissions/isMaintainerOfOrganisation'
import {EditOrganisation} from '~/types/Organisation'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'

export type UseParticipatingOrganisationsProps = {
  software: string,
  token: string,
  account: string
}

export async function getParticipatingOrganisationsForSoftware({software, token, account}: UseParticipatingOrganisationsProps) {
  const resp = await getOrganisationsForSoftware({
    software,
    token
  })
  // collect isMaintainerRequests
  const promises: Promise<boolean>[] = []
  // prepare organisation list
  const orgList = resp.map((item, pos) => {
    // save isMaintainer request
    promises.push(isMaintainerOfOrganisation({
      organisation: item.id,
      account,
      token
    }))
    // extract only needed props
    const organisation: EditOrganisation = {
      ...item,
      // additional props for edit type
      position: pos + 1,
      logo_b64: null,
      logo_mime_type: null,
      source: 'RSD' as 'RSD',
      status: item.status,
      // false by default
      canEdit: false,
      // description: null
    }
    return organisation
  })
  // run all isMaintainer requests in parallel
  const isMaintainer = await Promise.all(promises)
  const organisations = orgList.map((item, pos) => {
    // update canEdit based on isMaintainer requests
    if (isMaintainer[pos]) item.canEdit = isMaintainer[pos]
    return item
  })
  return organisations
}


export async function removeOrganisationCategoriesFromSoftware(
  softwareId: string,
  organisationId: string,
  token: string
){
  const url = `${getBaseUrl()}/rpc/delete_organisation_categories_from_software`
  const body = JSON.stringify({software_id: softwareId, organisation_id: organisationId})

  const resp = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      ...createJsonHeaders(token)
    }
  })

  return resp.ok ? null : resp.text()
}
