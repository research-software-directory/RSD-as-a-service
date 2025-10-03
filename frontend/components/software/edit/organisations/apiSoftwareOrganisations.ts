// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getOrganisationsForSoftware} from '~/components/organisation/apiEditOrganisation'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {canEditOrganisations} from '~/auth/permissions/isMaintainerOfOrganisation'

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
  // convert to EditOrganisation type and add canEdit flag
  const organisations = await canEditOrganisations({
    organisations: resp,
    account,
    token
  })
  // debugger
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

export type SoftwareCategories={
  software_id: string,
  category_id: string
}

export async function saveSoftwareCategories(categories:SoftwareCategories[],token:string){
  try{
    const categoryUrl = `${getBaseUrl()}/category_for_software`
    const resp = await fetch(categoryUrl, {
      method: 'POST',
      body: JSON.stringify(categories),
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp)
  }catch(e:any){
    return {
      status:500,
      message: e.message
    }
  }
}
