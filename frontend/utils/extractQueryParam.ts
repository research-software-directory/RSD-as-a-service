// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import type {GetServerSidePropsContext} from 'next'
import {ParsedUrlQuery} from 'querystring'
import logger from './logger'

export function extractQueryParam({query,param,castToType='string',defaultValue}:{
  query: ParsedUrlQuery, param: string, castToType?: ('string' | 'number' | 'date' | 'csv-to-array' |'json-encoded'),
  defaultValue:any
}){
  try{
    if (query && query.hasOwnProperty(param)){
      const rawVal = query[param]
      if (typeof rawVal == 'undefined') return defaultValue
      switch (castToType){
        case 'number':
          return parseInt(rawVal?.toString())
        case 'date':
          return new Date(rawVal?.toString())
        case 'string':
          return rawVal?.toString()
        case 'csv-to-array':
          const parsed = rawVal.toString().split(',')
          return parsed
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
  // console.log('query...', ctx.query)
  // console.log('params...', ctx.params)
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
  // console.log('keywords...', keywords)
  // console.log('keywords...', typeof keywords)
  // console.groupEnd()
  return {
    search,
    keywords,
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
  return {
    search,
    rows,
    page,
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
