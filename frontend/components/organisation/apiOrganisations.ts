// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {RsdUser} from '~/auth'
import {isOrganisationMaintainer} from '~/auth/permissions/isMaintainerOfOrganisation'
import {
  OrganisationForOverview,
  OrganisationListProps,
  ProjectOfOrganisation,
  SoftwareOfOrganisation
} from '~/types/Organisation'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {baseQueryString, paginationUrlParams} from '~/utils/postgrestUrl'


export function organisationListUrl({search, rows = 12, page = 0}: {
  search: string | null,
  rows: number,
  page: number
}) {
  // NOTE 1! selectList need to include all columns used in filtering
  // NOTE 2! ensure selectList uses identical props as defined in OrganisationListProps type
  const selectList = 'id,parent,name,short_description,country,website,is_tenant,ror_names_string,rsd_path,logo_id,software_cnt,project_cnt,score'
  let url = `${getBaseUrl()}/rpc/organisations_overview?parent=is.null&score=gt.0&order=is_tenant.desc,score.desc.nullslast,name.asc&select=${selectList}`
  // add search params
  if (search) {
    const encodedSearch = encodeURIComponent(search)
    url += `&or=(name.ilike."*${encodedSearch}*", website.ilike."*${encodedSearch}*", ror_names_string.ilike."*${encodedSearch}*")`
  }
  // add pagination params
  url += paginationUrlParams({
    rows,
    page,
  })
  return url
}

export async function getOrganisationsList({search, rows, page, token}: {
  search: string | null,
  rows: number,
  page: number,
  token: string | undefined
}) {
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

    if ([200, 206].includes(resp.status)) {
      const json: OrganisationListProps[] = await resp.json()
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

export async function getOrganisationBySlug({slug, user, token}: {
  slug: string[],
  user: RsdUser | null,
  token?: string
}) {
  try {
    // resolve slug to id and
    const uuid = await getOrganisationIdForSlug({slug, token})
    // if no uuid return undefined
    // console.log('getOrganisationBySlug...uuid...', uuid)
    if (typeof uuid === 'undefined' || uuid === null) return undefined
    // is this user maintainer of this organisation
    const isMaintainer = await isOrganisationMaintainer({
      organisation: uuid,
      account: user?.account,
      role: user?.role,
      token
    })
    // console.log('getOrganisationBySlug...isMaintainer...', isMaintainer)
    // get organisation data
    const [organisation, orgInfo] = await Promise.all([
      getOrganisationById({
        uuid,
        token,
        isMaintainer
      }),
      getOrganisationInfo({uuid, token})
    ])
    // return consolidated organisation data
    return {
      organisation: {
        ...organisation,
        ...orgInfo
      },
      isMaintainer
    }
  } catch (e: any) {
    logger(`getOrganisationBySlug: ${e?.message}`, 'error')
    return undefined
  }
}

export async function getOrganisationIdForSlug({slug, token, frontend = false}: {
  slug: string[],
  token?: string,
  frontend?: boolean
}) {
  try {
    const path = slug.join('/')
    let url = `${process.env.POSTGREST_URL}/rpc/slug_to_organisation`
    if (frontend) {
      url = '/api/v1/rpc/slug_to_organisation'
    }

    const resp = await fetch(url, {
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
    const uuid: string = await resp.json()
    return uuid
  } catch (e: any) {
    logger(`getOrganisationIdForSlug: ${e?.message}`, 'error')
    return undefined
  }
}


export async function getOrganisationById({uuid, token, isMaintainer = false}: {
  uuid: string,
  token?: string,
  isMaintainer?: boolean
}) {
  let query = `rpc/organisations_overview?id=eq.${uuid}`
  if (isMaintainer) {
    //if user is maintainer of this organisation
    //we request the counts of all items incl. denied and not published
    query += '&public=false'
  }
  const url = `${getBaseUrl()}/${query}`
  // console.log('getOrganisationById...url...', url)
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...createJsonHeaders(token),
      // request single object item
      'Accept': 'application/vnd.pgrst.object+json'
    },
  })
  if (resp.status === 200) {
    const json: OrganisationForOverview = await resp.json()
    return json
  }
  // otherwise request failed
  logger(`getOrganisationsById failed: ${resp.status} ${resp.statusText}`, 'warn')
  // we log and return zero
  return undefined
}

export async function getOrganisationChildren({uuid, token}: {uuid: string, token?: string}) {
  const selectList = 'id,name,primary_maintainer,slug,website,logo_id,is_tenant,parent'
  const query = `organisation?parent=eq.${uuid}&order=name.asc&select=${selectList}`
  const url = `${getBaseUrl()}/${query}`

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...createJsonHeaders(token),
    }
  })
  if (resp.status === 200) {
    const json: OrganisationForOverview[] = await resp.json()
    return json
  }
  // otherwise request failed
  logger(`getOrganisationChildren failed: ${resp.status} ${resp.statusText}`, 'warn')
  // we log and return zero
  return []
}

export async function getOrganisationInfo({uuid, token}: {uuid: string, token?: string}) {
  const query = `organisation?id=eq.${uuid}&select=description,wikipedia_url,city,ror_types`
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
    const json: any = await resp.json()
    return {
      city: json.city as string | null,
      description: json.description as string | null,
      wikipedia_url: json.wikipedia_url as string | null,
      ror_types: json?.ror_types ?? [] as string[] | null
    }
  }
  // otherwise request failed
  logger(`getOrganisationDescription failed: ${resp.status} ${resp.statusText}`, 'warn')
  // we log and return null
  return null
}

export type OrganisationApiParams = {
  organisation: string,
  searchFor?: string | null
  project_status?: string
  keywords?: string[] | null
  prog_lang?: string[] | null
  licenses?: string[] | null
  domains?: string[] | null
  organisations?: string[] | null
  categories?: string[] | null
  order?: string
  page: number,
  rows: number,
  token?: string,
  isMaintainer: boolean
}

export async function getSoftwareForOrganisation({
  organisation, searchFor, keywords, prog_lang,
  licenses, categories, order, page, rows, token,
  isMaintainer
}: OrganisationApiParams) {
  try {
    // baseUrl
    const baseUrl = getBaseUrl()
    let url = `${baseUrl}/rpc/software_by_organisation?organisation_id=${organisation}`
    // search
    if (searchFor) {
      // use different RPC for search
      const encodedSearch = encodeURIComponent(searchFor)
      url = `${baseUrl}/rpc/software_by_organisation_search?organisation_id=${organisation}&search=${encodedSearch}`
    }
    // filter for approved and published only if not maintainer
    if (!isMaintainer) {
      url += '&status=eq.approved&is_published=eq.true'
    }
    // additional filters
    const filters = baseQueryString({
      keywords,
      prog_lang,
      licenses,
      categories,
      order,
      limit: rows,
      offset: page ? page * rows : undefined
    })
    if (filters) {
      url += `&${filters}`
    }
    // default order is pinned first
    if (!order) {
      url += '&order=is_featured.desc.nullslast'
    }
    // console.log('getSoftwareForOrganisation...url...', url)
    // debugger
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
      data: []
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

export async function getProjectsForOrganisation({
  organisation, searchFor, keywords, domains,
  organisations, order, page, rows, token,
  isMaintainer, project_status, categories
}: OrganisationApiParams) {
  try {
    // baseUrl
    const baseUrl = getBaseUrl()
    let url = `${baseUrl}/rpc/projects_by_organisation?organisation_id=${organisation}`
    // search
    if (searchFor) {
      // use different RPC for search
      const encodedSearch = encodeURIComponent(searchFor)
      url = `${baseUrl}/rpc/projects_by_organisation_search?organisation_id=${organisation}&search=${encodedSearch}`
    }
    // filter for approved only if not maintainer
    if (!isMaintainer) {
      url += '&status=eq.approved&is_published=eq.true'
    }
    // additional filters
    const filters = baseQueryString({
      project_status,
      keywords,
      domains,
      organisations,
      categories,
      order,
      limit: rows,
      offset: page ? page * rows : undefined
    })
    if (filters) {
      url += `&${filters}`
    }
    // default order is pinned first
    if (!order) {
      url += '&order=is_featured.desc.nullslast'
    }
    // console.log('getProjectsForOrganisation...url...', url)
    // debugger
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
