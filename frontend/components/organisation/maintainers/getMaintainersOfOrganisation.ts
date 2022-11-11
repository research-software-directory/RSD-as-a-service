// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {RawMaintainerOfOrganisation} from './useOrganisationMaintainers'

export async function getMaintainersOfOrganisation({organisation, token, frontend = true}:
  { organisation: string, token: string, frontend?: boolean }) {
  try {
    // console.log('getMaintainersOfOrganisation.organisation', organisation)
    let query = `rpc/maintainers_of_organisation?organisation_id=${organisation}`
    let url = `/api/v1/${query}`
    if (frontend === false) {
      url = `${process.env.POSTGREST_URL}/${query}`
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json: RawMaintainerOfOrganisation[] = await resp.json()
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
