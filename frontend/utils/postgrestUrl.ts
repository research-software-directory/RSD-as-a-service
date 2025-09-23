// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {rowsPerPageOptions} from '~/config/pagination'
import {encodeUrlQuery} from './extractQueryParam'
import {localeSort} from './sortFn'

export type BasicApiParams = {
  token: string,
  page: number
  rows: number
  searchFor?: string
  orderBy?: string
}

export type OrderByProps<T, K extends keyof T> = {
  column: K,
  direction: 'asc' | 'desc'
}

export type ApiParams<T, K extends keyof T> = Omit<BasicApiParams,'orderBy'> & {
  orderBy?: OrderByProps<T, K>
}

export type QueryParams = {
  search?: string | null
  order?: string | null,
  keywords?: string[] | null
  domains?: string[] | null,
  prog_lang?: string[] | null,
  licenses?: string[] | null,
  categories?: string[] | null,
  rsd_host?: string | null,
  organisations?: string[] | null,
  project_status?: string | null,
  page?: number | null,
  rows?: number | null
}

export type BaseQueryStringProps = Omit<QueryParams,'page,rows'> & {
  limit?: number,
  offset?: number
}

export type PostgrestParams = BaseQueryStringProps & {
  baseUrl: string
}

export function ssrSoftwareUrl(params: QueryParams) {
  const view = 'software'
  const url = buildFilterUrl(params, view)
  return url
}

export function ssrOrganisationUrl(params: QueryParams) {
  const view = 'organisations'
  const url = buildFilterUrl(params, view)
  return url
}

export function ssrProjectsUrl(params: QueryParams) {
  const view = 'projects'
  const url = buildFilterUrl(params, view)
  return url
}


export function buildFilterUrl(params: QueryParams, view: string) {
  const {
    search, order, keywords, domains,
    licenses, prog_lang, rsd_host,
    organisations, project_status,
    categories, rows, page
  } = params
  // console.log('buildFilterUrl...params...', params)
  const url = `/${view}?`
  let query = ''

  // search
  query = encodeUrlQuery({
    query,
    param: 'search',
    value: search
  })
  //keywords
  query = encodeUrlQuery({
    query,
    param: 'keywords',
    value: keywords
  })
  // research domains
  query = encodeUrlQuery({
    query,
    param: 'domains',
    value: domains
  })
  // programming languages
  query = encodeUrlQuery({
    query,
    param: 'prog_lang',
    value: prog_lang
  })
  // licenses
  query = encodeUrlQuery({
    query,
    param: 'licenses',
    value: licenses
  })
  // categories
  query = encodeUrlQuery({
    query,
    param: 'categories',
    value: categories
  })
  // sources (rsd remote source)
  query = encodeUrlQuery({
    query,
    param: 'rsd_host',
    value: rsd_host
  })
  // organisations
  query = encodeUrlQuery({
    query,
    param: 'organisations',
    value: organisations
  })
  // project_status
  query = encodeUrlQuery({
    query,
    param: 'project_status',
    value: project_status
  })
  // sortBy
  query = encodeUrlQuery({
    query,
    param: 'order',
    value: order
  })
  // page
  query = encodeUrlQuery({
    query,
    param: 'page',
    value: page
  })
  // rows
  query = encodeUrlQuery({
    query,
    param: 'rows',
    value: rows
  })
  // debugger
  if (query !== '') {
    return `${url}${query}`
  }
  return url
}

/**
 * Provides url params for postgrest api pagination
 */
export function paginationUrlParams({rows = 12, page = 0}:
{rows: number, page: number}) {
  let params = ''

  if (rows) {
    params += `&limit=${rows}`
  }
  if (page) {
    params += `&offset=${page * rows}`
  }
  return params
}

/**
 * Provides basic url query string for postgrest endpoints
 */
export function baseQueryString(props: BaseQueryStringProps) { // NOSONAR - avoid complexity warning
  const {
    keywords,
    domains,
    prog_lang,
    licenses,
    rsd_host,
    organisations,
    project_status,
    categories,
    order,
    limit,
    offset
  } = props
  let query
  // console.group('baseQueryString')
  // console.log('keywords...', keywords)
  // console.log('domains...', domains)
  // console.log('prog_lang...', prog_lang)
  // console.log('order...', order)
  // console.log('limit...', limit)
  // console.log('offset...', offset)
  // console.groupEnd()
  // filter on keywords using AND
  if (keywords !== undefined &&
    keywords !== null &&
    typeof keywords === 'object') {
    // sort and convert keywords array to comma separated string
    // we need to sort because search is on ARRAY field in pgSql
    // and all keywords should be present (AND).
    // and it needs to be enclosed in {} uri encoded see
    // https://postgrest.org/en/v9.0/api.html?highlight=filter#calling-functions-with-array-parameters
    const keywordsAll = keywords
      .toSorted(localeSort)
      .map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    query = `keywords=cs.%7B${keywordsAll}%7D`
  }
  if (domains !== undefined &&
    domains !== null &&
    typeof domains === 'object') {
    // sort and convert research domains array to comma separated string
    // we need to sort because search is on ARRAY field in pgSql
    const domainsAll = domains
      .toSorted(localeSort)
      .map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    if (query) {
      query = `${query}&research_domain=cs.%7B${domainsAll}%7D`
    } else {
      query = `research_domain=cs.%7B${domainsAll}%7D`
    }
  }
  if (prog_lang !== undefined &&
    prog_lang !== null &&
    typeof prog_lang === 'object') {
    // sort and convert prog_lang array to comma separated string
    // we need to sort because search is on ARRAY field in pgSql
    // and all prog_lang should be present (AND).
    // It needs to be enclosed in {} uri encoded see
    // https://postgrest.org/en/v9.0/api.html?highlight=filter#calling-functions-with-array-parameters
    const languagesAll = prog_lang
      .toSorted(localeSort)
      .map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    if (query) {
      query = `${query}&prog_lang=cs.%7B${languagesAll}%7D`
    } else {
      query = `prog_lang=cs.%7B${languagesAll}%7D`
    }
  }
  if (licenses !== undefined &&
    licenses !== null &&
    typeof licenses === 'object') {
    // sort and convert array to comma separated string
    const licensesAll = licenses
      .toSorted(localeSort)
      .map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    if (query) {
      query = `${query}&licenses=cs.%7B${licensesAll}%7D`
    } else {
      query = `licenses=cs.%7B${licensesAll}%7D`
    }
  }
  // RSD Host
  if (rsd_host !== undefined &&
    rsd_host !== null
  ) {
    const rsd_host_encoded = encodeURIComponent(rsd_host)
    if (query) {
      // the null value is passed as string in url query
      if (rsd_host_encoded === 'null') {
        query = `${query}&rsd_host=is.null`
      } else {
        query = `${query}&rsd_host=eq.${rsd_host_encoded}`
      }
    } else if (rsd_host_encoded === 'null' || rsd_host_encoded === null) {
      // the null value is passed as string in url query
      query = 'rsd_host=is.null'
    } else {
      query = `rsd_host=eq.${rsd_host_encoded}`
    }
  }
  if (organisations !== undefined &&
    organisations !== null &&
    typeof organisations === 'object') {
    // sort and convert array to comma separated string
    // we need to sort because search is on ARRAY field in pgSql
    const organisationsAll = organisations
      .toSorted(localeSort)
      .map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    if (query) {
      query = `${query}&participating_organisations=cs.%7B${organisationsAll}%7D`
    } else {
      query = `participating_organisations=cs.%7B${organisationsAll}%7D`
    }
  }
  if (categories !== undefined &&
    categories !== null &&
    typeof categories === 'object') {
    // sort and convert array to comma separated string
    // we need to sort because search is on ARRAY field in pgSql
    const categoriesAll = categories
      .toSorted(localeSort)
      .map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    if (query) {
      query = `${query}&categories=cs.%7B${categoriesAll}%7D`
    } else {
      query = `categories=cs.%7B${categoriesAll}%7D`
    }
  }
  if (project_status !== undefined &&
    project_status !== null) {
    // show records with any of project_status values from the filter
    const encodedStatus = encodeURIComponent(project_status)
    if (query) {
      query = `${query}&project_status=eq.${encodedStatus}`
    } else {
      query = `project_status=eq.${encodedStatus}`
    }
  }
  // order
  if (order) {
    if (query) {
      query += `&order=${order}`
    } else {
      query = `order=${order}`
    }
  }
  // add limit and offset
  if (query) {
    query += `&limit=${limit ?? rowsPerPageOptions[0]}&offset=${offset ?? 0}`
  } else {
    query = `limit=${limit ?? rowsPerPageOptions[0]}&offset=${offset ?? 0}`
  }
  // console.log('query...', query)
  // console.groupEnd()
  return query
}

export function softwareListUrl(props: PostgrestParams) {
  const {baseUrl, search} = props
  let query = baseQueryString(props)
  let url = ''

  if (search) {
    // console.log('softwareListUrl...keywords...', props.keywords)
    const encodedSearch = encodeURIComponent(search)
    // search query is performed in aggregated_software_search RPC
    // we search in title,subtitle,slug,keywords_text and prog_lang
    // check rpc in 124-aggregated-software-views.sql for exact filtering
    query += `&search=${encodedSearch}`

    url = `${baseUrl}/rpc/aggregated_software_search`
    // console.log('softwareListUrl...', url)
  } else {
    url = `${baseUrl}/rpc/aggregated_software_overview`
  }

  if (!props.categories) {
    const selectList = 'id,rsd_host,domain,slug,brand_name,short_statement,image_id,updated_at,contributor_cnt,mention_cnt,is_published,keywords,keywords_text,prog_lang,licenses'
    query += `&select=${selectList}`
  }

  url += `?${query}`
  // console.log('softwareListUrl...', url)
  return url
}

export function highlightsListUrl(props: PostgrestParams) {
  const {baseUrl, search} = props
  let query = baseQueryString(props)

  if (search) {
    // console.log('softwareListUrl...keywords...', props.keywords)
    const encodedSearch = encodeURIComponent(search)
    // search query is performed in highlight_search RPC
    // we search in title,subtitle,slug,keywords_text and prog_lang
    // check rpc in 104-software-views.sql for exact filtering
    query += `&search=${encodedSearch}`

    const url = `${baseUrl}/rpc/highlight_search?${query}`
    // console.log('softwareListUrl...', url)
    return url
  }

  const url = `${baseUrl}/rpc/highlight_overview?${query}`
  // console.log('softwareListUrl...', url)
  return url
}

export function projectListUrl(props: PostgrestParams) {
  const {baseUrl, search} = props
  let query = baseQueryString(props)

  if (search) {
    const encodedSearch = encodeURIComponent(search)
    // search query is performed in project_search RPC
    // we search in title,subtitle,slug,keywords_text and research domains_text
    // check rpc in 105-project-views.sql for exact filtering
    query += `&search=${encodedSearch}`

    const url = `${baseUrl}/rpc/project_search?${query}`
    return url
  }
  // if search term is not used we use different RPC (more performant)
  const url = `${baseUrl}/rpc/project_overview?${query}`
  return url
}
