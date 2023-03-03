// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getMaintainerOrganisations} from '~/auth/permissions/isMaintainerOfOrganisation'
import {Organisation, OrganisationForOverview, ProjectOfOrganisation, SoftwareOfOrganisation} from '../types/Organisation'
import {extractCountFromHeader} from './extractCountFromHeader'
import {createJsonHeaders, getBaseUrl} from './fetchHelpers'
import logger from './logger'
import {paginationUrlParams} from './postgrestUrl'


export function organisationListUrl({search, rows = 12, page = 0}:
  { search: string | undefined, rows: number, page: number }) {
  // by default order is on software count and name
  const selectList = 'parent,name,website,is_tenant,rsd_path,logo_id,software_cnt,project_cnt,score'
  let url = `${process.env.POSTGREST_URL}/rpc/organisations_overview?parent=is.null&score=gt.0&order=is_tenant.desc,score.desc.nullslast,name.asc&select=${selectList}`
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
    const url = organisationListUrl({search, rows, page})

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
    logger(`getOrganisationsList failed: ${resp.status} ${resp.statusText}`, 'warn')
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
  { slug: string[], token: string }) {
  try {
    // resolve slug to id and
    // get list of organisation uuid's this user is mantainer of
    const [uuid, maintainerOf] = await Promise.all([
      getOrganisationIdForSlug({slug, token}),
      getMaintainerOrganisations({
        token,
        frontend: false
      })
    ])
    // if no uuid return
    if (typeof uuid == 'undefined') return undefined
    // is this user maintainer of this organisation
    const isMaintainer = maintainerOf.includes(uuid)
    const [organisation, description] = await Promise.all([
      getOrganisationById({
        uuid,
        token,
        frontend: false,
        isMaintainer
      }),
      getOrganisationDescription({uuid,token})
    ])
    // return consolidate organisation
    return {
      ...organisation,
      description
    }
  } catch (e:any) {
    logger(`getOrganisationBySlug: ${e?.message}`, 'error')
    return undefined
  }
}

export async function getOrganisationIdForSlug({slug, token, frontend=false}:
  { slug: string[], token: string, frontend?:boolean }) {
  const path = slug.join('/')
  let url = `${process.env.POSTGREST_URL}/rpc/slug_to_organisation`
  if (frontend) {
    url = '/api/v1/rpc/slug_to_organisation'
  }

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


export async function getOrganisationById({uuid,token,frontend=false,isMaintainer=false}:
  {uuid: string, token: string, frontend?: boolean, isMaintainer?:boolean}) {
  let query = `rpc/organisations_overview?id=eq.${uuid}`
  if (isMaintainer) {
    //if user is maintainer of this organisation
    //we request the counts of all items incl. denied and not published
    query +='&public=false'
  }
  let url = `${process.env.POSTGREST_URL}/${query}`
  if (frontend) {
    url = `/api/v1/${query}`
  }
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...createJsonHeaders(token),
      // request single object item
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
  { uuid: string, token: string, frontend?: boolean }) {
  const query = `rpc/organisations_overview?parent=eq.${uuid}&order=name.asc`
  let url = `${process.env.POSTGREST_URL}/${query}`
  if (frontend) {
    url = `/api/v1/${query}`
  }
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...createJsonHeaders(token),
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

export async function getOrganisationDescription({uuid, token}: { uuid: string, token: string }) {
  const query = `organisation?id=eq.${uuid}`
  const url = `${getBaseUrl()}/${query}`
  // console.log('url...', url)
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...createJsonHeaders(token),
      // request single object item
      'Accept': 'application/vnd.pgrst.object+json'
    }
  })
  if (resp.status === 200) {
    const json: Organisation = await resp.json()
    return json.description
  }
  // otherwise request failed
  logger(`getOrganisationDescription failed: ${resp.status} ${resp.statusText}`, 'warn')
  // we log and return null
  return null
}

export type OrganisationApiParams = {
  organisation: string,
  searchFor: string | undefined
  page: number,
  rows: number,
  token: string,
  isMaintainer: boolean
}

export async function getSoftwareForOrganisation({organisation, searchFor, page, rows, token, isMaintainer}:
  OrganisationApiParams) {
  try {
    // baseUrl
    const order ='order=is_published.desc,is_featured.desc,mention_cnt.desc.nullslast,brand_name.asc'
    let url = `/api/v1/rpc/software_by_organisation?organisation_id=${organisation}&${order}`
    // filter for approved, only published if filtered by RLS
    if (!isMaintainer) {
      url+='&status=eq.approved&is_published=eq.true'
    }
    // search
    if (searchFor) {
      url+=`&or=(brand_name.ilike.*${searchFor}*, short_statement.ilike.*${searchFor}*)`
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

export async function getProjectsForOrganisation({organisation, searchFor, page, rows, token, isMaintainer}:
  OrganisationApiParams) {
  try {
    // baseUrl
    const order ='order=is_published.desc,is_featured.desc,current_state.desc,date_start.desc,title.asc'
    let url = `/api/v1/rpc/projects_by_organisation?organisation_id=${organisation}&${order}`
    // filter for approved only if not maintainer
    if (!isMaintainer) {
      url += '&status=eq.approved&is_published=eq.true'
    }
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
