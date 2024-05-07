// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import logger from './logger'
import {
  NewSoftwareItem, SoftwareItem, RepositoryUrl,
  SoftwarePropsToSave, SoftwareItemFromDB,
  LicenseForSoftware
} from '../types/SoftwareTypes'
import {getPropsFromObject} from './getPropsFromObject'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from './fetchHelpers'

export async function addSoftware({software, token}:
  { software: NewSoftwareItem, token: string}) {
  try {
    // console.log('addSoftware...called...', software)
    const url = '/api/v1/software'
    // make post request
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify(software)
    })
    if (resp.status === 201) {
      // no data response
      return {
        status: 201,
        message: software.slug
      }
    }
    // construct message
    const data = await resp.json()
    const message = data?.message ?? resp.statusText
    logger(`addSoftware: ${message}`, 'warn')
    // return message
    return {
      status: resp.status,
      message
    }
  } catch (e: any) {
    logger(`addSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function getSoftwareToEdit({slug, token}:
  { slug: string, token: string }) {
  try {
    // GET
    const select = '*,repository_url!left(url,code_platform,scraping_disabled_reason)'
    const url = `${getBaseUrl()}/software?select=${select}&slug=eq.${slug}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token),
    })
    if (resp.status === 200) {
      const data: SoftwareItemFromDB[] = await resp.json()
      // fix repositoryUrl
      const software: SoftwareItem = getPropsFromObject(data[0], SoftwarePropsToSave)
      // repository url should at least be http://a.b
      if (data[0]?.repository_url?.url?.length > 9) {
        software.repository_url = data[0]?.repository_url?.url
        software.repository_platform = data[0]?.repository_url?.code_platform
      } else {
        software.repository_url = null
        software.repository_platform = null
      }
      software.scraping_disabled_reason = data[0]?.repository_url?.scraping_disabled_reason
      return software
    }
  } catch (e: any) {
    logger(`getSoftwareToEdit: ${e?.message}`, 'error')
  }
}

export async function addToRepositoryTable({data, token}:
  { data: RepositoryUrl, token: string }) {
  try {
    // add new repository
    const url = '/api/v1/repository_url'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // UPSERT=merging also works with POST method
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp, data.software ?? '')

  } catch (e: any) {
    logger(`addToRepositoryTable: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteFromRepositoryTable({software, token}:
  { software: string, token: string }) {
  try {
    // DELETE
    const url = `/api/v1/repository_url?software=eq.${software}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    return extractReturnMessage(resp, software ?? '')

  } catch (e: any) {
    logger(`deleteFromRepositoryTable: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addLicensesForSoftware({license, token}:
  { license: LicenseForSoftware, token: string}) {
  try {
    const url = `/api/v1/license_for_software?software=eq.${license.software}`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify(license)
    })
    if (resp.status === 201) {
      const id = resp.headers.get('location')?.split('.')[1]
      return {
        status: 201,
        message: id
      }
    } else {
      return extractReturnMessage(resp, license.software ?? '')
    }
  } catch (e: any) {
    logger(`addLicensesForSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteLicense({id, token}:
  { id: string, token: string }) {
  try {
    const url = `/api/v1/license_for_software?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })

    return extractReturnMessage(resp, id)

  } catch (e: any) {
    logger(`deleteLicense: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

// query for software item page based on slug
export async function validSoftwareItem(slug: string | undefined, token?: string) {
  try {
    // this request is always perfomed from frontend
    const url = `/api/v1/software?select=id,slug&slug=eq.${slug}`
    let resp
    if (token) {
      resp = await fetch(url, {
        method: 'GET',
        headers: createJsonHeaders(token)
      })
    } else {
      resp = await fetch(url, {method: 'GET'})
    }
    if (resp.status === 200) {
      const data = await resp.json()
      return data.length === 1
    }
    return false
  } catch (e: any) {
    logger(`validSoftwareItem: ${e?.message}`, 'error')
    return false
  }
}

export async function addRelatedProjects({origin, relation, token}: {
  origin: string, relation: string, token: string
}) {
  const url = '/api/v1/project_for_project'

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      ...createJsonHeaders(token),
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      origin,
      relation
    })
  })

  return extractReturnMessage(resp)
}

export async function deleteRelatedProject({origin, relation, token}: {
  origin: string, relation: string, token: string
}) {

  const url = `/api/v1/project_for_project?origin=eq.${origin}&relation=eq.${relation}`

  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...createJsonHeaders(token)
    }
  })

  return extractReturnMessage(resp)
}
