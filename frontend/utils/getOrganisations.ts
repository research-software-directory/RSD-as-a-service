// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {OrganisationForOverview, ProjectOfOrganisation, SoftwareOfOrganisation} from '../types/Organisation'
import {extractCountFromHeader} from './extractCountFromHeader'
import {createJsonHeaders} from './fetchHelpers'
import logger from './logger'
import {paginationUrlParams} from './postgrestUrl'


export function organisationUrl({search, rows = 12, page = 0}:
  { search: string | undefined, rows: number, page: number }) {
  // by default order is on software count and name
  let url = `${process.env.POSTGREST_URL}/rpc/organisations_overview?parent=is.null&order=software_cnt.desc.nullslast,name.asc`
  // moved to rpc
  // let url = `${process.env.POSTGREST_URL}/organisations_overview?parent=is.null&order=software_cnt.desc.nullslast,name.asc`
  // add search params
  if (search) {
    url += `&or=(name.ilike.*${search}*, website.ilike.*${search}*)`
  }
  // add pagination params
  url += paginationUrlParams({
    rows,
    page,
  })
  return url
}

export async function getOrganisationsList({search, rows, page, token}:
  { search: string | undefined, rows: number, page: number, token: string | undefined }) {
  try {
    const url = organisationUrl({search, rows, page})

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      },
    })

    if ([200,206].includes(resp.status)) {
      const json = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers),
        data: json
      }
    }
    // otherwise request failed
    logger(`getSoftwareList failed: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      count: 0,
      data: []
    }
  } catch (e: any) {
    logger(`getOrganisationsList: ${e?.message}`, 'error')
    return {
      count: 0,
      data: []
    }
  }
}

export async function getOrganisationBySlug({slug, token}:
  {slug: string[], token: string}) {
  try {
    const uuid = await getOrganisationsIdForSlug({slug, token})
    // if not found return
    if (typeof uuid == 'undefined') return undefined

    const organisation = await getOrganisationsById({
      uuid,
      token
    })

    return organisation

  } catch (e:any) {
    logger(`getOrganisationBySlug: ${e?.message}`, 'error')
    return undefined
  }
}


async function getOrganisationsIdForSlug({slug, token}:
  { slug: string[], token: string }) {

  const path = slug.join('/')
  let url = `${process.env.POSTGREST_URL}/rpc/slug_to_organisation`

  let resp = await fetch(url, {
    method: 'POST',
    headers: {
      ...createJsonHeaders(token),
    },
    body: JSON.stringify({
      'full_slug': path
    })
  })
  // cannot find organisation by slug
  if (resp.status !== 200) return undefined
  const uuid:string = await resp.json()
  return uuid
}


async function getOrganisationsById({uuid, token}:
  {uuid: string, token: string}) {
  const url = `${process.env.POSTGREST_URL}/rpc/organisations_overview?id=eq.${uuid}`
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...createJsonHeaders(token),
      // request record count to be returned
      // note: it's returned in the header
      'Accept': 'application/vnd.pgrst.object+json'
    },
  })
  if (resp.status === 200) {
    const json:OrganisationForOverview = await resp.json()
    return json
  }
  // otherwise request failed
  logger(`getOrganisationsById failed: ${resp.status} ${resp.statusText}`, 'warn')
  // we log and return zero
  return undefined
}

export async function getOrganisationChildren({uuid, token,frontend=false}:
  {uuid: string, token: string,frontend?:boolean}) {
  let url = `${process.env.POSTGREST_URL}/rpc/organisations_overview?parent=eq.${uuid}`
  if (frontend) {
    url = `/api/v1/rpc/organisations_overview?parent=eq.${uuid}`
  }
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...createJsonHeaders(token)
    }
  })
  if (resp.status === 200) {
    const json:OrganisationForOverview[] = await resp.json()
    return json
  }
  // otherwise request failed
  logger(`getOrganisationChildren failed: ${resp.status} ${resp.statusText}`, 'warn')
  // we log and return zero
  return []
}

export type SoftwareForOrganisationProps = {
  organisation: string,
  searchFor: string | undefined
  page: number,
  rows: number,
  token: string
}

export async function getSoftwareForOrganisation({organisation, searchFor, page, rows, token}:
  SoftwareForOrganisationProps) {
  try {
    // baseUrl
    let url = `/api/v1/rpc/software_by_organisation?organisation=eq.${organisation}&order=is_featured.desc,is_published.desc,mention_cnt.desc.nullslast,brand_name.asc`
    // search
    if (searchFor) {
      url+=`&or=(brand_name.ilike.*${searchFor}*, short_statement.ilike.*${searchFor}*))`
    }
    // pagination
    url += paginationUrlParams({rows, page})
    // console.log('getSoftwareForOrganisation...url...',url)
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })
    if ([200,206].includes(resp.status)) {
      const json: SoftwareOfOrganisation[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        data: json
      }
    }
    // otherwise request failed
    logger(`getSoftwareForOrganisation: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      count: 0,
      data:[]
    }

  } catch (e: any) {
    // otherwise request failed
    logger(`getSoftwareForOrganisation: ${e.message}`, 'error')
    // we log and return zero
    return {
      count: 0,
      data: []
    }
  }
}

export async function getProjectsForOrganisation({organisation, searchFor, page, rows, token}:
  SoftwareForOrganisationProps) {
  try {
    // baseUrl
    let url = `/api/v1/rpc/projects_by_organisation?organisation=eq.${organisation}&order=title.asc`
    // search
    if (searchFor) {
      url += `&or=(title.ilike.*${searchFor}*,subtitle.ilike.*${searchFor}*))`
    }
    // pagination
    url += paginationUrlParams({rows, page})
    // console.log('getSoftwareForOrganisation...url...',url)
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })
    if ([200, 206].includes(resp.status)) {
      const json: ProjectOfOrganisation[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        data: json
      }
    }
    // otherwise request failed
    logger(`getProjectsForOrganisation: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      count: 0,
      data: []
    }

  } catch (e: any) {
    // otherwise request failed
    logger(`getProjectsForOrganisation: ${e.message}`, 'error')
    // we log and return zero
    return {
      count: 0,
      data: []
    }
  }
}
