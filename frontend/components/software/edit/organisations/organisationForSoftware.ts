// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {EditOrganisation, SoftwareForOrganisation} from '~/types/Organisation'
import {createOrganisation, updateDataObjectAfterSave} from '~/utils/editOrganisation'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export async function saveNewOrganisationForSoftware({item, token, software, account, setState}:
  { item: EditOrganisation, token: string, software: string, account: string, setState: (item: EditOrganisation) => void }) {
  // create new organisation
  let resp = await createOrganisation({
    item,
    token
  })
  // only 201 and 206 accepted
  if ([201, 206].includes(resp.status) === false) {
    // on error we return message
    return resp
  }
  // we receive id in message
  const id = resp.message
  if (resp.status === 201) {
    // add this organisation to software
    resp = await addOrganisationToSoftware({
      software,
      organisation: id,
      account,
      token
    })
    if (resp.status === 200) {
      // we receive assigned status in message
      item.status = resp.message
      // update data, remove base64 string after upload
      // and create logo_id to be used as image reference
      const organisation = updateDataObjectAfterSave({
        data: item,
        id
      })
      // update local list
      setState(organisation)
      return {
        status: 200,
        message: 'OK'
      }
    } else {
      return resp
    }
  } else if (resp.status === 206) {
    // organisation is created but the image failed
    const organisation = updateDataObjectAfterSave({
      data: item,
      id
    })
    setState(organisation)
    // we show error about failure on logo
    return {
      status: 206,
      message: 'Failed to upload organisation logo.'
    }
  } else {
    return resp
  }
}

export async function addOrganisationToSoftware({software, organisation, account, token}:
  { software: string, organisation: string, account: string, token: string }) {
  // 2a. determine status - default is approved
  let status: SoftwareForOrganisation['status'] = 'approved'
  // 2b. register participating organisation for this software
  const data: SoftwareForOrganisation = {
    software,
    organisation,
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
  { software: string, organisations: EditOrganisation[], token: string }) {
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
  { software: string | undefined, organisation: string, token: string }) {
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
