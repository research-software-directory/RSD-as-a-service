// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractErrorMessages, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'

export type NewSoftwareHeritage = {
  id: string | null
  software: string,
  swhid: string,
  position: number
}


export type SoftwareHeritageItem = NewSoftwareHeritage & {
  id: string
}

export async function getSoftwareHeritageItems({software, token}: {
  software: string,
  token?: string
}): Promise<SoftwareHeritageItem[]> {
  try {
    const query = `software=eq.${software}&order=position.asc`
    const url = `${getBaseUrl()}/swhid_for_software?${query}`

    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      },
    })

    if (resp.status === 200) {
      return await resp.json()
    }
    logger(`getSoftwareHeritageItems...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getSoftwareHeritageItems failed. ${e.message}`, 'error')
    return []
  }
}

export async function postSoftwareHeritage({data, token}: {data: NewSoftwareHeritage, token: string}) {
  try {
    const url = `${getBaseUrl()}/swhid_for_software`

    // ELSE add new package manager
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`postPackageManager failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function patchSoftwareHeritageList({items, token}: {items: SoftwareHeritageItem[], token: string}) {
  try {
    // create all requests
    const requests = items.map(item => {
      return patchSoftwareHeritageItem({
        id: item.id,
        key: 'position',
        value: item.position,
        token
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    const errors = extractErrorMessages(responses)
    if (errors.length > 0) {
      return errors[0]
    }
    // if no errors it's OK
    return {
      status: 200,
      message: 'OK'
    }
  } catch (e: any) {
    logger(`patchSoftwareHeritageList failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function patchSoftwareHeritageItem({id, key, value, token}:
{id: string, key: string, value: any, token: string}) {
  try {
    const url = `/api/v1/swhid_for_software?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      // just update position!
      body: JSON.stringify({
        [key]: value
      })
    })
    // extract errors
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchSoftwareHeritageItem failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function deleteSoftwareHeritageItem({id, token}: {id: string, token: string}) {
  try {
    const url = `/api/v1/swhid_for_software?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    // extract errors
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`deleteSoftwareHeritageItem failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
