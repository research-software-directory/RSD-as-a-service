// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {rowsPerPageOptions} from '~/config/pagination'

type baseQueryStringProps = {
  search?: string | null,
  keywords?: string[] | null,
  domains?: string[] | null,
  prog_lang?: string[] | null,
  order?: string,
  limit?: number,
  offset?: number
}

export type PostgrestParams = baseQueryStringProps & {
  baseUrl:string
}

type QueryParams={
  // query: ParsedUrlQuery
  search?:string
  keywords?:string[]
  domains?:string[],
  prog_lang?:string[],
  page?:number,
  rows?:number
}

export function ssrSoftwareUrl(params:QueryParams){
  const view = 'software'
  const url = ssrUrl(params, view)
  return url
}

export function ssrOrganisationUrl(params: QueryParams) {
  const view = 'organisations'
  const url = ssrUrl(params,view)
  return url
}

export function ssrProjectsUrl(params: QueryParams) {
  const view = 'projects'
  const url = ssrUrl(params, view)
  return url
}

type BuildUrlQueryProps = {
  query: string
  param: string
  value: string[]|string|undefined
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
  } else if (Array.isArray(value)===true && value?.length > 0) {
    // arrays are stringified
    if (query) {
      query += `&${param}=${encodeURIComponent(JSON.stringify(value))}`
    } else {
      query = `${param}=${encodeURIComponent(JSON.stringify(value))}`
    }
  }
  // return build query
  return query
}


function ssrUrl(params: QueryParams, view:string) {
  const {search, keywords, domains, prog_lang, rows, page} = params
  // console.log('ssrUrl...params...', params)
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
  if (page || page === 0) {
    url += `page=${page}`
  } else {
    // default
    url += 'page=0'
  }
  if (rows) {
    url += `&rows=${rows}`
  } else {
    url += '&rows=12'
  }
  // debugger
  if (query!=='') {
    return `${url}&${query}`
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
  const {keywords, domains, prog_lang,order,limit,offset} = props
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
  const {baseUrl, search, keywords} = props
  let query = baseQueryString(props)

  if (search) {
    // console.log('softwareListUrl...keywords...', props.keywords)
    const encodedSearch = encodeURIComponent(search)
    query += `&or=(brand_name.ilike.*${encodedSearch}*,short_statement.ilike.*${encodedSearch}*`
    // if keyword filter is not used we search in keywords_text too!
    if (typeof keywords === 'undefined' || keywords === null) {
      query += `,keywords_text.ilike.*${encodedSearch}*`
    }
    // close or clause
    query += ')'
  }

  const url = `${baseUrl}/rpc/software_search?${query}`
  // console.log('softwareListUrl...', url)
  return url
}


export function projectListUrl(props: PostgrestParams) {
  const {baseUrl, search, keywords, domains} = props
  let query = baseQueryString(props)

  if (search) {
    const encodedSearch = encodeURIComponent(search)
    query += `&or=(title.ilike.*${encodedSearch}*,subtitle.ilike.*${encodedSearch}*`
    // if keyword filter is not applied we search in keyword_text too!
    if (typeof keywords === 'undefined' || keywords === null) {
      query += `,keywords_text.ilike.*${encodedSearch}*`
    }
    // if domains filter is not applied we search in research_domain_text too!
    if (typeof domains === 'undefined' || domains === null) {
      query += `,research_domain_text.ilike.*${encodedSearch}*`
    }
    // close or clause
    query+=')'
  }

  const url = `${baseUrl}/rpc/project_search?${query}`
  // console.log('projectListUrl...',url)
  return url
}
