// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * CONTRIBUTORS
 */

import logger from './logger'
import {Contributor, ContributorProps, PatchPerson, SaveContributor} from '../types/Contributor'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from './fetchHelpers'
import {findRSDPerson} from './findRSDPerson'
import {getORCID} from './getORCID'

export async function getContributorsForSoftware({software, token, frontend}:
  { software: string, token?: string, frontend?: boolean }) {
  try {
    // use standardized list of columns
    const columns = ContributorProps.join(',')
    // , avatar_data
    const query = `contributor?select=${columns}&software=eq.${software}&order=position,given_names.asc`
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })

    if (resp.status === 200) {
      const data: Contributor[] = await resp.json()
      return data
    } else if (resp.status === 404) {
      logger(`getContributorsForSoftware: 404 [${url}]`, 'error')
      // query not found
      return []
    }
  } catch (e: any) {
    logger(`getContributorsForSoftware: ${e?.message}`, 'error')
    return []
  }
}


export async function searchForContributor({searchFor, token, frontend}:
  { searchFor: string, token?: string, frontend?: boolean }) {
  try {

    const [rsdContributor, orcidOptions] = await Promise.all([
      findRSDPerson({searchFor, token, frontend}),
      getORCID({searchFor})
    ])

    const options = [
      ...rsdContributor,
      ...orcidOptions
    ]

    return options

  } catch (e: any) {
    logger(`searchForContributor: ${e?.message}`, 'error')
    return []
  }
}

export async function postContributor({contributor, token}:
  { contributor: SaveContributor, token: string }) {
  try {
    const url = '/api/v1/contributor'

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
  { contributor: PatchPerson, token: string }) {
  try {
    const url = `/api/v1/contributor?id=eq.${contributor.id}`
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
  { contributors: Contributor[], token: string }) {
  try {
    if (contributors.length === 0) return {
      status: 400,
      message: 'Empty contributors array'
    }
    // create all requests
    const requests = contributors.map(contributor => {
      const url = `/api/v1/contributor?id=eq.${contributor.id}`
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
    const url = `/api/v1/contributor?id=in.("${ids.join('","')}")`
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
