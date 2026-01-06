// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

/**
 * CONTRIBUTORS
 */

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {Contributor, NewContributor, PatchContributor, Person} from '~/types/Contributor'

export async function getContributorsForSoftware({software, token}:
{software: string, token?: string}) {
  try {
    // build url
    const query = `software_id=${software}&order=position.asc,given_names.asc`
    const url = `${getBaseUrl()}/rpc/software_contributors?${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })

    if (resp.status === 200) {
      const data: Person[] = await resp.json()
      return data
    }
    logger(`getContributorsForSoftware: ${resp.status} - ${resp.statusText}: [${url}]`, 'warn')
    // query not found
    return []

  } catch (e: any) {
    logger(`getContributorsForSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function postContributor({contributor, token}:
{contributor: NewContributor, token: string}) {
  try {
    const url = `${getBaseUrl()}/contributor`

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body:JSON.stringify(contributor)
    })
    if (resp.status === 201) {
      // we need to return id of created record
      // it can be extracted from header.location
      const id = resp.headers.get('location')?.split('.')[1]
      return {
        status: 201,
        message: id
      }
    } else {
      return extractReturnMessage(resp)
    }
  } catch (e: any) {
    logger(`postContributor: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchContributor({contributor, token}:
{contributor: PatchContributor, token: string}) {
  try {
    const url = `${getBaseUrl()}/contributor?id=eq.${contributor.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify(contributor)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchContributor: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchContributorPositions({contributors, token}:
{contributors: Contributor[], token: string}) {
  try {
    if (contributors.length === 0) return {
      status: 400,
      message: 'Empty contributors array'
    }
    // create all requests
    const requests = contributors.map(contributor => {
      const url = `${getBaseUrl()}/contributor?id=eq.${contributor.id}`
      return fetch(url, {
        method: 'PATCH',
        headers: {
          ...createJsonHeaders(token),
        },
        // just update position!
        body: JSON.stringify({
          position: contributor.position
        })
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    return extractReturnMessage(responses[0])
  } catch (e: any) {
    logger(`patchContributorPositions: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteContributorsById({ids,token}:{ids:string[],token:string}) {
  try{
    const url = `${getBaseUrl()}/contributor?id=in.("${ids.join('","')}")`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    return extractReturnMessage(resp, ids.toString())
  } catch (e: any) {
    logger(`deleteContributorsById: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
