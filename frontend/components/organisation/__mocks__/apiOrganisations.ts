// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

import {RsdUser} from '~/auth'
import {
  OrganisationListProps,
} from '~/types/Organisation'
import {paginationUrlParams} from '~/utils/postgrestUrl'
import mockOrganisation from './mockOrganisation'

export const organisationListUrl=jest.fn(({search, rows = 12, page = 0}:{
  search: string | null,
  rows: number,
  page: number
})=>{
  // NOTE 1! selectList need to include all columns used in filtering
  // NOTE 2! ensure selectList uses identical props as defined in OrganisationListProps type
  const selectList = 'id,parent,name,short_description,country,website,is_tenant,ror_names_string,rsd_path,logo_id,software_cnt,project_cnt,score'
  let url = `api/v1/rpc/organisations_overview?parent=is.null&score=gt.0&order=is_tenant.desc,score.desc.nullslast,name.asc&select=${selectList}`
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
})

export const getOrganisationsList=jest.fn(async({search, rows, page, token}: {
  search: string | null,
  rows: number,
  page: number,
  token: string | undefined
})=>{

  const json: OrganisationListProps[] = []
  return {
    count: json.length,
    data: json
  }

})

export const getOrganisationBySlug=jest.fn(async({slug, user, token}: {
  slug: string[],
  user: RsdUser | null,
  token?: string
})=>{
  // return consolidated organisation data
  return {
    organisation: mockOrganisation,
    isMaintainer:false
  }
})

export const getOrganisationIdForSlug=jest.fn(async({slug, token, frontend = false}: {
  slug: string[],
  token?: string,
  frontend?: boolean
})=>{
  return 'uuid-test-mock'
})


export const getOrganisationById=jest.fn(({uuid, token, isMaintainer = false}: {
  uuid: string,
  token?: string,
  isMaintainer?: boolean
})=>{
  return mockOrganisation
})

export const getOrganisationChildren=jest.fn(async({uuid, token}: {uuid: string, token?: string})=>{
  // we log and return zero
  return []
})

export const getOrganisationInfo=jest.fn(async({uuid, token}: {uuid: string, token?: string})=>{
  return {
    city: 'Test city',
    description: 'Test description',
    wikipedia_url: 'https://wikipedia.com/test_url',
    ror_types: []
  }
})

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

export const getSoftwareForOrganisation=jest.fn(async({
  organisation, searchFor, keywords, prog_lang,
  licenses, categories, order, page, rows, token,
  isMaintainer
}: OrganisationApiParams)=>{
  // return 0 as default
  return {
    count: 0,
    data: []
  }
})

export const getProjectsForOrganisation=jest.fn(async({
  organisation, searchFor, keywords, domains,
  organisations, order, page, rows, token,
  isMaintainer, project_status, categories
}: OrganisationApiParams)=>{
  // retirn 0 as default
  return {
    count: 0,
    data: []
  }
})
