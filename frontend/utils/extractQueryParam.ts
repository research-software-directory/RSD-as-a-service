// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {ParsedUrlQuery} from 'querystring'
import logger from './logger'

export function extractQueryParam({query,param,castToType='string',defaultValue}:{
  query: ParsedUrlQuery, param: string, castToType?: ('string' | 'number' | 'json-encoded'),
  defaultValue:any
}){
  try{
    if (query && query.hasOwnProperty(param)){
      const rawVal = query[param]
      if (typeof rawVal == 'undefined') return defaultValue
      switch (castToType){
        case 'number':
          return parseInt(rawVal?.toString())
        case 'string':
          return rawVal?.toString()
        case 'json-encoded':
          const json = JSON.parse(decodeURI(rawVal.toString()))
          return json
        default:
          return rawVal
      }
    }else{
    // return default value
    // when parameter not available
      return defaultValue
    }
  }catch(e:any){
    logger(`extractQueryParam: ${e.description}`,'error')
    throw e
  }}

export function ssrSoftwareParams(query: ParsedUrlQuery) {
  // console.group('ssrSoftwareParams')
  // console.log('query...', query)

  const rows = extractQueryParam({
    query,
    param: 'rows',
    defaultValue: 12,
    castToType:'number'
  })
  const page = extractQueryParam({
    query,
    param: 'page',
    defaultValue: 0,
    castToType:'number'
  })
  const search = extractQueryParam({
    query,
    param: 'search',
    defaultValue: null,
    castToType:'string'
  })
  const keywords = extractQueryParam({
    query,
    param: 'keywords',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const prog_lang = extractQueryParam({
    query,
    param: 'prog_lang',
    castToType: 'json-encoded',
    defaultValue: null
  })
  // console.log('keywords...', keywords)
  // console.log('keywords...', typeof keywords)
  // console.groupEnd()
  return {
    search,
    keywords,
    prog_lang,
    rows,
    page,
  }
}

export function ssrProjectsParams(query: ParsedUrlQuery) {
  const rows = extractQueryParam({
    query,
    param: 'rows',
    defaultValue: 12,
    castToType: 'number'
  })
  const page = extractQueryParam({
    query,
    param: 'page',
    defaultValue: 0,
    castToType: 'number'
  })
  const search = extractQueryParam({
    query,
    param: 'search',
    defaultValue: null
  })
  const keywords = extractQueryParam({
    query,
    param: 'keywords',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const domains = extractQueryParam({
    query,
    param: 'domains',
    castToType: 'json-encoded',
    defaultValue: null
  })
  return {
    search,
    rows,
    page,
    keywords,
    domains
  }
}

export function ssrOrganisationParams(query: ParsedUrlQuery) {
  const rows = extractQueryParam({
    query,
    param: 'rows',
    defaultValue: 12,
    castToType: 'number'
  })
  const page = extractQueryParam({
    query,
    param: 'page',
    defaultValue: 0,
    castToType: 'number'
  })
  const search = extractQueryParam({
    query,
    param: 'search',
    defaultValue: null
  })
  return {
    search,
    rows,
    page,
  }
}
