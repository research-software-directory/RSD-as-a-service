// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {colForCreate, EditOrganisation, SoftwareForOrganisation} from '~/types/Organisation'
import {createOrganisation} from '~/components/organisation/apiEditOrganisation'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import logger from '~/utils/logger'

export async function createOrganisationAndAddToSoftware({item, token, software}:
{item: EditOrganisation, token: string, software: string}) {
  // extract props we need for createOrganisation
  const organisation = getPropsFromObject(item, colForCreate)
  // create new organisation
  let resp = await createOrganisation({
    organisation,
    token
  })
  // only 201 accepted
  if (resp.status !== 201) {
    // on error we return resp status
    return resp
  }
  // we receive id in message
  // const id = resp.message
  item.id = resp.message
  if (item.id) {
    // add this organisation to software
    resp = await addOrganisationToSoftware({
      software,
      organisation: item.id,
      position: item.position,
      token
    })
    if (resp.status === 200) {
      // we receive assigned status in message
      item.status = resp.message
      // return updated item
      return {
        status: 200,
        message: item
      }
    }
    // debugger
    return resp
  } else {
    return {
      status: 400,
      message: 'Organisation id is missing.'
    }
  }
}

export async function addOrganisationToSoftware({software, organisation, position, token}:
{software: string, organisation: string, position: number | null, token: string}) {
  // 2a. determine status - default is approved
  const status: SoftwareForOrganisation['status'] = 'approved'
  // 2b. register participating organisation for this software
  const data: SoftwareForOrganisation = {
    software,
    organisation,
    position,
    status
  }
  const url = '/api/v1/software_for_organisation'
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      ...createJsonHeaders(token),
      'Prefer': 'return=headers-only'
    },
    body: JSON.stringify(data)
  })
  if ([200, 201].includes(resp.status)) {
    // return status assigned to organisation
    return {
      status: 200,
      message: status
    }
  }
  return extractReturnMessage(resp)
}

export async function patchOrganisationPositions({software, organisations, token}:
{software: string, organisations: EditOrganisation[], token: string}) {
  try {
    if (organisations.length === 0) return {
      status: 400,
      message: 'Empty organisations array'
    }
    // create all requests
    const requests = organisations.map(organisation => {
      const query = `software=eq.${software}&organisation=eq.${organisation.id}`
      const url = `/api/v1/software_for_organisation?${query}`
      return fetch(url, {
        method: 'PATCH',
        headers: {
          ...createJsonHeaders(token),
        },
        // just update position!
        body: JSON.stringify({
          position: organisation.position
        })
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    return extractReturnMessage(responses[0])
  } catch (e: any) {
    logger(`patchOrganisationPositions: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteOrganisationFromSoftware({software, organisation, token}:
{software: string | undefined, organisation: string, token: string}) {
  try {
    if (typeof software == 'undefined') {
      return {
        status: 400,
        message: 'Bad request. software id undefined'
      }
    }
    const url = `/api/v1/software_for_organisation?software=eq.${software}&organisation=eq.${organisation}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}
