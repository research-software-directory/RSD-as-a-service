// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ParsedUrlQuery} from 'querystring'

export type PostgrestParams={
  baseUrl:string,
  search?:string | null,
  keywords?:string[] | null,
  order?:string,
  limit:number,
  offset:number
}

export function softwareListUrl(props:PostgrestParams){
  const {baseUrl, search, keywords, order, limit, offset} = props
  let url = `${baseUrl}/rpc/software_search?`

  // console.log('softwareListUrl.keywords...', keywords)
  // console.log('softwareListUrl.typeof...', typeof keywords)
  // console.log('softwareListUrl.length...', keywords?.length)

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
    // use cs. command to fin
    url += `keywords=cs.%7B${keywordsAll}%7D`
  }

  if (search) {
    // search for term in brand_name and short_statement
    // we use ilike (case INsensitive) and * to indicate partial string match
    url+=`&or=(brand_name.ilike.*${search}*, short_statement.ilike.*${search}*)`
  }

  if (order){
    url+=`&order=${order}`
  }

  // add limit and offset
  url+=`&limit=${limit || 12}&offset=${offset || 0}`

  return url
}

type QueryParams={
  // query: ParsedUrlQuery
  search?:string
  keywords?:string[]
  page?:number,
  rows?:number
}

export function softwareUrl(params:QueryParams){
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

function ssrUrl(params: QueryParams, view:string) {
  const {search, keywords, rows, page} = params
  // console.log('ssrUrl...params...', params)
  let url = `/${view}?`
  if (search) {
    url += `search=${encodeURIComponent(search)}`
  } else if (search === '') {
    //remove search query
  }
  if (keywords && keywords.length > 0) {
    // stringify JSON object and encode URI
    url += `&keywords=${encodeURIComponent(JSON.stringify(keywords))}`
  } else if (keywords === null) {
    // remove filter
  }
  if (page || page === 0) {
    url += `&page=${page}`
  } else {
    // default
    url += '&page=0'
  }
  if (rows) {
    url += `&rows=${rows}`
  } else {
    url += '&rows=12'
  }
  // debugger
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
