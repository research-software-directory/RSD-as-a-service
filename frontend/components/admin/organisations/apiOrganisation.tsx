// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'

export type RemoveOrganisationProps = {
  uuid: string,
  logo_id: string | null
}

type getOrganisationApiParams = {
  token: string,
  page: number
  rows: number
  searchFor?: string
  orderBy?: string
}

export type OrganisationAdminProps = {
  id: string
  parent: string | null
  name: string
  website: string | null
  is_tenant: boolean
  rsd_path: string
  logo_id: string | null,
  ror_id: string | null
  software_cnt: number,
  project_cnt: number
}

export async function getOrganisations({page, rows, token, searchFor, orderBy}: getOrganisationApiParams) {
  try {
    // NOTE 1! selectList need to include all colums used in filtering
    // NOTE 2! ensure selectList uses identical props as defined in OrganisationAdminList type
    const selectList = 'id,parent,name,website,is_tenant,rsd_path,logo_id,ror_id,software_cnt,project_cnt'
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      query+=`&or=(name.ilike."*${searchFor}*",website.ilike."*${searchFor}*",ror_id.ilike."*${searchFor}*")`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=name.asc'
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/organisations_overview?select=${selectList}&parent=is.null?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      },
    })

    if ([200,206].includes(resp.status)) {
      const organisations: OrganisationAdminProps[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        organisations
      }
    }
    logger(`getOrganisations: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      organisations: []
    }
  } catch {
    return {
      count: 0,
      organisations: []
    }
  }
}
