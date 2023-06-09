// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {rowsPerPageOptions} from '~/config/pagination'

export type OrderByProps<T, K extends keyof T> = {
  column: K,
  direction: 'asc' | 'desc'
}

export type ApiParams<T, K extends keyof T> = {
  token: string,
  page: number
  rows: number
  searchFor?: string
  orderBy?: OrderByProps<T,K>
}

type baseQueryStringProps = {
  search?: string | null,
  keywords?: string[] | null,
  domains?: string[] | null,
  prog_lang?: string[] | null,
  licenses?: string[] | null,
  organisations?: string[] | null,
  order?: string,
  limit?: number,
  offset?: number
}

export type PostgrestParams = baseQueryStringProps & {
  baseUrl:string
}

export type QueryParams={
  // query: ParsedUrlQuery
  search?:string
  order?: string,
  keywords?:string[]
  domains?:string[],
  prog_lang?: string[],
  licenses?: string[],
  organisations?: string[],
  page?:number,
  rows?:number
}

export function ssrSoftwareUrl(params:QueryParams){
  const view = 'software'
  const url = buildFilterUrl(params, view)
  return url
}

export function ssrOrganisationUrl(params: QueryParams) {
  const view = 'organisations'
  const url = buildFilterUrl(params,view)
  return url
}

export function ssrProjectsUrl(params: QueryParams) {
  const view = 'projects'
  const url = buildFilterUrl(params, view)
  return url
}

type BuildUrlQueryProps = {
  query: string
  param: string
  value: string[]|string|number|undefined
}

function buildUrlQuery({query, param, value}: BuildUrlQueryProps) {
  // if there is no value we return "" for query=no query
  if (typeof value === 'undefined' || value === '') return query

  // handle string value
  if (typeof value === 'string') {
    if (query) {
      query += `&${param}=${encodeURIComponent(value)}`
    } else {
      query = `${param}=${encodeURIComponent(value)}`
    }
  } else if (Array.isArray(value) === true && (value as any)?.length > 0) {
    // arrays are stringified
    if (query) {
      query += `&${param}=${encodeURIComponent(JSON.stringify(value))}`
    } else {
      query = `${param}=${encodeURIComponent(JSON.stringify(value))}`
    }
  } else if (typeof value === 'number') {
    if (query) {
      query += `&${param}=${encodeURIComponent(value)}`
    } else {
      query = `${param}=${encodeURIComponent(value)}`
    }
  }
  // return build query
  return query
}


export function buildFilterUrl(params: QueryParams, view:string) {
  const {
    search, order, keywords, domains,
    licenses, prog_lang, organisations,
    rows, page
  } = params
  // console.log('buildFilterUrl...params...', params)
  let url = `/${view}?`
  let query = ''

  // search
  query = buildUrlQuery({
    query,
    param: 'search',
    value: search
  })
  //keywords
  query = buildUrlQuery({
    query,
    param: 'keywords',
    value: keywords
  })
  // research domains
  query = buildUrlQuery({
    query,
    param: 'domains',
    value: domains
  })
  // programming languages
  query = buildUrlQuery({
    query,
    param: 'prog_lang',
    value: prog_lang
  })
  // licenses
  query = buildUrlQuery({
    query,
    param: 'licenses',
    value: licenses
  })
  // organisations
  query = buildUrlQuery({
    query,
    param: 'organisations',
    value: organisations
  })
  // sortBy
  query = buildUrlQuery({
    query,
    param: 'order',
    value: order
  })
  // page
  query = buildUrlQuery({
    query,
    param: 'page',
    value: page
  })
  // rows
  query = buildUrlQuery({
    query,
    param: 'rows',
    value: rows
  })
  // debugger
  if (query!=='') {
    return `${url}${query}`
  }
  return url
}

/**
 * Provides url params for postgrest api pagination
 */
export function paginationUrlParams({rows=12, page=0}:
  {rows:number,page:number}) {
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
 * @param '{keywords[], order, limit, offset}'
 * @returns string
 */
export function baseQueryString(props: baseQueryStringProps) {
  const {keywords,domains,prog_lang,licenses,organisations,order,limit,offset} = props
  let query
  // console.group('baseQueryString')
  // console.log('keywords...', keywords)
  // console.log('domains...', domains)
  // console.log('prog_lang...', prog_lang)
  // console.log('order...', order)
  // console.log('limit...', limit)
  // console.log('offset...', offset)
  // filter on keywords using AND
  if (typeof keywords !== 'undefined' &&
    keywords !== null &&
    typeof keywords === 'object') {
    // sort and convert keywords array to comma separated string
    // we need to sort because search is on ARRAY field in pgSql
    // and all keywords should be present (AND).
    // and it needs to be enclosed in {} uri encoded see
    // https://postgrest.org/en/v9.0/api.html?highlight=filter#calling-functions-with-array-parameters
    const keywordsAll = keywords.sort().map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    query = `keywords=cs.%7B${keywordsAll}%7D`
  }
  if (typeof domains !== 'undefined' &&
    domains !== null &&
    typeof domains === 'object') {
    // sort and convert research domains array to comma separated string
    // we need to sort because search is on ARRAY field in pgSql
    const domainsAll = domains.sort().map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    if (query) {
      query = `${query}&research_domain=cs.%7B${domainsAll}%7D`
    } else {
      query = `research_domain=cs.%7B${domainsAll}%7D`
    }
  }
  if (typeof prog_lang !== 'undefined' &&
    prog_lang !== null &&
    typeof prog_lang === 'object') {
    // sort and convert prog_lang array to comma separated string
    // we need to sort because search is on ARRAY field in pgSql
    // and all prog_lang should be present (AND).
    // and it needs to be enclosed in {} uri encoded see
    // https://postgrest.org/en/v9.0/api.html?highlight=filter#calling-functions-with-array-parameters
    const languagesAll = prog_lang.sort().map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    if (query) {
      query = `${query}&prog_lang=cs.%7B${languagesAll}%7D`
    } else {
      query = `prog_lang=cs.%7B${languagesAll}%7D`
    }
  }
  if (typeof licenses !== 'undefined' &&
    licenses !== null &&
    typeof licenses === 'object') {
    // sort and convert array to comma separated string
    const licensesAll = licenses.sort().map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    if (query) {
      query = `${query}&licenses=cs.%7B${licensesAll}%7D`
    } else {
      query = `licenses=cs.%7B${licensesAll}%7D`
    }
  }
  if (typeof organisations !== 'undefined' &&
    organisations !== null &&
    typeof organisations === 'object') {
    // sort and convert array to comma separated string
    // we need to sort because search is on ARRAY field in pgSql
    const organisationsAll = organisations.sort().map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
    // use cs. command to find
    if (query) {
      query = `${query}&participating_organisations=cs.%7B${organisationsAll}%7D`
    } else {
      query = `participating_organisations=cs.%7B${organisationsAll}%7D`
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
    query += `&limit=${limit || rowsPerPageOptions[0]}&offset=${offset || 0}`
  } else {
    query = `limit=${limit || rowsPerPageOptions[0]}&offset=${offset || 0}`
  }
  // console.log('query...', query)
  // console.groupEnd()
  return query
}

export function softwareListUrl(props: PostgrestParams) {
  const {baseUrl, search} = props
  let query = baseQueryString(props)

  if (search) {
    // console.log('softwareListUrl...keywords...', props.keywords)
    const encodedSearch = encodeURIComponent(search)
    // search query is performed in software_search RPC
    // we search in title,subtitle,slug,keywords_text and prog_lang
    // check rpc in 105-project-views.sql for exact filtering
    query += `&search=${encodedSearch}`

    const url = `${baseUrl}/rpc/software_search?${query}`
    // console.log('softwareListUrl...', url)
    return url
  }

  const url = `${baseUrl}/rpc/software_overview?${query}`
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
