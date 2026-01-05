// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {RawMaintainerProps} from '~/components/maintainers/apiMaintainers'

export async function getMaintainersOfOrganisation({organisation, token}:
{organisation: string, token: string}) {
  try {
    // console.log('getMaintainersOfOrganisation.organisation', organisation)
    const query = `rpc/maintainers_of_organisation?organisation_id=${organisation}`
    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json: RawMaintainerProps[] = await resp.json()
      return json
    }
    // ERRORS
    logger(`getMaintainersOfOrganisation: ${resp.status}:${resp.statusText} organisation: ${organisation}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getMaintainersOfOrganisation: ${e?.message}`, 'error')
    return []
  }
}

export async function deleteMaintainerFromOrganisation({maintainer,organisation,token}:
{maintainer:string,organisation:string,token:string}) {
  try {
    const query = `maintainer_for_organisation?maintainer=eq.${maintainer}&organisation=eq.${organisation}`
    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`deleteMaintainerFromSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function organisationMaintainerLink({organisation, account, token}:
{organisation: string, account: string, token: string}) {
  try {
    // POST
    const url = `${getBaseUrl()}/invite_maintainer_for_organisation`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify({
        organisation,
        created_by:account
      })
    })
    if (resp.status === 201) {
      const id = resp.headers.get('location')?.split('.')[1]
      if (id) {
        const link = `${location.origin}/invite/organisation/${id}`
        return {
          status: 201,
          message: link
        }
      }
      return {
        status: 400,
        message: 'Id is missing'
      }
    }
    return extractReturnMessage(resp, organisation ?? '')
  } catch (e: any) {
    logger(`organisationMaintainerLink: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
