// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ParsedUrlQuery} from 'querystring'
import logger from './logger'


type EncodeQueryValue = string[] | string | number | undefined | null

type EncodeQueryParamProps = {
  value: EncodeQueryValue
  param: string
}

type BuildUrlQueryProps = EncodeQueryParamProps & {
  query: string
}

export function encodeQueryValue(value: EncodeQueryValue) {
  try {
    if (typeof value === 'string' || typeof value === 'number') {
      return encodeURIComponent(value)
    } else if (Array.isArray(value) === true && (value as any)?.length > 0) {
      // arrays are stringified
      return encodeURIComponent(JSON.stringify(value))
    }
  } catch (e: any) {
    logger(`encodeQueryValue...${e.message}`, 'error')
  }
}

export function encodeQueryParam({param, value}: EncodeQueryParamProps) {
  try {
    // encode value
    const encoded = encodeQueryValue(value)
    // return param
    if (encoded) return `${param}=${encodeQueryValue(value)}`
    // otherwise return null (should be ignored)
    return null
  } catch (e:any) {
    logger(`encodeQueryParam...${e.message}`, 'error')
    return null
  }
}

// encode filters into url query parameters
export function encodeUrlQuery({query, param, value}: BuildUrlQueryProps) {
  // if there is no value we return "" for query=no query
  if (typeof value === 'undefined' || value === '' || value === null) return query
  // encode value
  const encoded = encodeQueryParam({param, value})
  // if nothing is encoded return query
  if (encoded === '' || encoded === null) return query
  // handle string value
  if (query) {
    query += `&${encoded}`
  } else {
    query += encoded
  }
  // return build query
  return query
}

// Decode json stringified and url encoded param value
// Encoding done using encodeQueryValue method
export function decodeJsonParam(value: string|null, defaultValue:any) {
  try {
    if (typeof value == 'undefined' || value === '' || value === null) return defaultValue
    return JSON.parse(decodeURIComponent(value))
  } catch (e: any) {
    // debugger
    logger(`decodeJsonParam: failed to decode ${value} ${e.message ?? ''}`, 'error')
    return defaultValue
  }
}

// decoding Query params back from encodedUrl
export function decodeQueryParam({query,param,castToType='string',defaultValue}:{
  query: ParsedUrlQuery, param: string, castToType?: ('string' | 'number' | 'json-encoded'|'raw'),
  defaultValue:any
}){
  try{
    if (query && query.hasOwnProperty(param)){
      // debugger
      const rawVal = query[param]
      // if value is not "actionable" we return default value
      if (typeof rawVal == 'undefined' || rawVal === '' || rawVal === null) return defaultValue
      // if cast to type is not defined we return raw value
      if (typeof castToType === 'undefined') return rawVal
      // convert to specific type
      switch (castToType){
        case 'number':
          if (typeof rawVal === 'string') {
            return parseInt(rawVal)
          }
          logger(`decodeQueryParam: query param ${param} NOT a string. Returning defaultValue`, 'warn')
          return defaultValue
        case 'string':
          if (typeof rawVal === 'string'){
            return decodeURIComponent(rawVal)
          }else{
            return decodeURIComponent(rawVal?.toString())
          }
        case 'json-encoded':
          if (typeof rawVal === 'string') {
            const json = decodeJsonParam(rawVal,defaultValue)
            return json
          }
          logger(`decodeQueryParam: query param ${param} NOT a string. Returning defaultValue`, 'warn')
          return defaultValue
        case 'raw':
          return rawVal
        default:
          if (defaultValue){
            logger(`decodeQueryParam: castToType ${castToType} NOT supported. Returning defaultValue`, 'warn')
            return defaultValue
          }
          logger(`decodeQueryParam: castToType ${castToType} NOT supported. Returning rawValue`, 'warn')
          return rawVal
      }
    }else{
      // return default value
      // when parameter not available
      return defaultValue
    }
  }catch(e:any){
    // console.log('decodeQueryParam...',query,param,castToType)
    logger(`decodeQueryParam: ${e}`,'error')
    return defaultValue
  }
}

export type SoftwareParams = {
  search?: string
  order?: string,
  keywords?: string[],
  prog_lang?: string[],
  licenses?: string[],
  categories?: string[],
  rsd_host?: string,
  page?: number,
  rows?: number
}

export function ssrSoftwareParams(query: ParsedUrlQuery): SoftwareParams {
  // console.group('ssrSoftwareParams')
  // console.log('query...', query)

  const rows:number = decodeQueryParam({
    query,
    param: 'rows',
    defaultValue: undefined,
    castToType:'number'
  })
  const page:number = decodeQueryParam({
    query,
    param: 'page',
    defaultValue: 1,
    castToType:'number'
  })
  const search:string = decodeQueryParam({
    query,
    param: 'search',
    defaultValue: null,
    // search string is already decoded by next
    // and decodeURIComponent fails when % is in the string to decode
    // see this issue https://github.com/vercel/next.js/issues/10080
    castToType:'raw'
  })
  const keywords:string[]|undefined = decodeQueryParam({
    query,
    param: 'keywords',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const prog_lang:string[]|undefined = decodeQueryParam({
    query,
    param: 'prog_lang',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const licenses:string[]|undefined = decodeQueryParam({
    query,
    param: 'licenses',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const categories:string[]|undefined = decodeQueryParam({
    query,
    param: 'categories',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const rsd_host:string|undefined = decodeQueryParam({
    query,
    param: 'rsd_host',
    defaultValue: undefined
  })
  const order:string = decodeQueryParam({
    query,
    param: 'order',
    castToType: 'string',
    defaultValue: null
  })
  // console.log('keywords...', keywords)
  // console.log('keywords...', typeof keywords)
  // console.groupEnd()
  return {
    search,
    keywords,
    prog_lang,
    licenses,
    categories,
    rsd_host,
    order,
    rows,
    page,
  }
}

export function ssrProjectsParams(query: ParsedUrlQuery) {
  const rows:number = decodeQueryParam({
    query,
    param: 'rows',
    defaultValue: undefined,
    castToType: 'number'
  })
  const page:number = decodeQueryParam({
    query,
    param: 'page',
    defaultValue: 1,
    castToType: 'number'
  })
  const search:string|null = decodeQueryParam({
    query,
    param: 'search',
    defaultValue: null,
    // search string is already decoded by next
    // and decodeURIComponent fails when % is in the string to decode
    // see this issue https://github.com/vercel/next.js/issues/10080
    castToType:'raw'
  })
  const keywords:string[]|null = decodeQueryParam({
    query,
    param: 'keywords',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const domains:string[]|null= decodeQueryParam({
    query,
    param: 'domains',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const organisations:string[]|null = decodeQueryParam({
    query,
    param: 'organisations',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const project_status: string|null = decodeQueryParam({
    query,
    param: 'project_status',
    defaultValue: null
  })
  const order: string|null = decodeQueryParam({
    query,
    param: 'order',
    castToType: 'string',
    defaultValue: null
  })
  return {
    search,
    order,
    rows,
    page,
    keywords,
    domains,
    organisations,
    project_status
  }
}

/**
 * Extract basic query parameters search, page and rows.
 * Used by organisation, news and communities overview pages.
 * @param query
 * @returns
 */
export function ssrBasicParams(query: ParsedUrlQuery) {
  const rows = decodeQueryParam({
    query,
    param: 'rows',
    defaultValue: undefined,
    castToType: 'number'
  })
  const page = decodeQueryParam({
    query,
    param: 'page',
    defaultValue: 1,
    castToType: 'number'
  })
  const search = decodeQueryParam({
    query,
    param: 'search',
    defaultValue: null,
    // search string is already decoded by next
    // and decodeURIComponent fails when % is in the string to decode
    // see this issue https://github.com/vercel/next.js/issues/10080
    castToType:'raw'
  })
  return {
    search,
    rows,
    page,
  }
}

/** Provides complex query parameters (keywords,domains,organisations) in encoded form.
  NOTE! These parameters need to be decoded before passed to the component as array data.
  Use decodeJsonParam method to decode these params into data arrays.
**/
export function getProjectsParams(query: ParsedUrlQuery) {
  const rows: number = decodeQueryParam({
    query,
    param: 'rows',
    defaultValue: undefined,
    castToType: 'number'
  })
  const page: number = decodeQueryParam({
    query,
    param: 'page',
    defaultValue: 1,
    castToType: 'number'
  })
  const search: string | null = decodeQueryParam({
    query,
    param: 'search',
    defaultValue: null
  })
  const project_status: string | null = decodeQueryParam({
    query,
    param: 'project_status',
    defaultValue: null
  })
  // string encoded array used to avoid
  // useEffect change detection with string[]
  const keywords_json: string | null = decodeQueryParam({
    query,
    param: 'keywords',
    defaultValue: null
  })
  // string encoded array used to avoid
  // useEffect change detection with string[]
  const domains_json: string | null = decodeQueryParam({
    query,
    param: 'domains',
    defaultValue: null
  })
  // string encoded array used to avoid
  // useEffect change detection with string[]
  const organisations_json: string | null = decodeQueryParam({
    query,
    param: 'organisations',
    defaultValue: null
  })
  // string encoded array used to avoid
  // useEffect change detection with string[]
  const categories_json: string | null = decodeQueryParam({
    query,
    param: 'categories',
    defaultValue: null
  })
  const order: string | null = decodeQueryParam({
    query,
    param: 'order',
    castToType: 'string',
    defaultValue: null
  })
  return {
    search,
    order,
    rows,
    page,
    project_status,
    keywords_json,
    domains_json,
    organisations_json,
    categories_json
  }
}

/** Provides complex query parameters (keywords,domains,organisations) in encoded form.
  NOTE! These parameters need to be decoded before passed to the component as array data.
  Use decodeJsonParam method to decode these params into data arrays.
**/
export function getSoftwareParams(query: ParsedUrlQuery) {
  const rows: number = decodeQueryParam({
    query,
    param: 'rows',
    defaultValue: undefined,
    castToType: 'number'
  })
  const page: number = decodeQueryParam({
    query,
    param: 'page',
    defaultValue: 1,
    castToType: 'number'
  })
  const search: string | null = decodeQueryParam({
    query,
    param: 'search',
    defaultValue: null
  })
  // string encoded array used to avoid
  // useEffect change detection with string[]
  const keywords_json: string | null = decodeQueryParam({
    query,
    param: 'keywords',
    defaultValue: null
  })
  // string encoded array used to avoid
  // useEffect change detection with string[]
  const prog_lang_json: string | null = decodeQueryParam({
    query,
    param: 'prog_lang',
    defaultValue: null
  })
  // string encoded array used to avoid
  // useEffect change detection with string[]
  const licenses_json: string | null = decodeQueryParam({
    query,
    param: 'licenses',
    defaultValue: null
  })
  // string encoded array used to avoid
  // useEffect change detection with string[]
  const categories_json: string | null = decodeQueryParam({
    query,
    param: 'categories',
    defaultValue: null
  })
  const order: string | null = decodeQueryParam({
    query,
    param: 'order',
    castToType: 'string',
    defaultValue: null
  })
  return {
    search,
    order,
    rows,
    page,
    keywords_json,
    prog_lang_json,
    licenses_json,
    categories_json
  }
}
