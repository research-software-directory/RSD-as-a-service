// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
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
/**
 * Encode query values to be url "safe" values.
 * Array values are stringified and URI encoded.
 * Simple string and number values are encoded on request using encode param
 * @param value
 * @param encode boolean Encode string values
 * @returns encoded/raw value depending on value type
 */
export function encodeQueryValue(value: EncodeQueryValue, encode?:boolean) {
  try {
    if (typeof value === 'string' || typeof value === 'number') {
      // encode URI on request
      if (encode) return encodeURIComponent(value)
      // do not encode simple values
      return value.toString()
    } else if (Array.isArray(value) && (value as any[]).length > 0) {
      // arrays are stringified
      return encodeURIComponent(JSON.stringify(value))
    }
  } catch (e: any) {
    logger(`encodeQueryValue...${e.message}`, 'error')
  }
}

function encodeQueryParam({param, value}: EncodeQueryParamProps) {
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

/**
 *
 * @param query the existing query
 * @param param the query parameter key to be appended
 * @param value the query parameter value to be appended
 *
 * @returns The query to which the param and value are appended in the form '&param=value', of which the value is URL encoded.
 * If the query was empty, the leading '&' is omitted.
 */
export function encodeUrlQuery({query, param, value}: BuildUrlQueryProps) {
  // if there is no value we return the query
  if (typeof value === 'undefined' || value === '' || value === null) return query

  // encode value
  const encoded = encodeQueryParam({param, value})
  // if nothing is encoded return query
  if (encoded === '' || encoded === null) return query

  // handle string value
  if (query) {
    query += '&'
  }

  query += encoded
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
      if (rawVal === undefined || rawVal === '' || rawVal === null) return defaultValue
      // if cast to type is not defined we return raw value
      if (typeof castToType === 'undefined') return rawVal
      // convert to specific type
      switch (castToType){
        case 'number':
          if (typeof rawVal === 'string') {
            return Number.parseInt(rawVal)
          }
          logger(`decodeQueryParam: query param ${param} NOT a string. Returning defaultValue`, 'warn')
          return defaultValue
        case 'string':
          return rawVal.toString()
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

export function ssrSoftwareParams(query: ParsedUrlQuery) {
  // console.group('ssrSoftwareParams')
  // console.log('query...', query)

  // extract basic params
  const {search,order,rows,page} = ssrBasicParams(query)
  // extract filters shared by project and software
  const {keywords, categories} = sharedFilters(query)
  // extract software specific filters
  const prog_lang:string[]|null = decodeQueryParam({
    query,
    param: 'prog_lang',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const licenses:string[]|null = decodeQueryParam({
    query,
    param: 'licenses',
    castToType: 'json-encoded',
    defaultValue: null
  })
  const rsd_host:string|null = decodeQueryParam({
    query,
    param: 'rsd_host',
    defaultValue: null
  })

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
  // extract basic params
  const {search,order,rows,page} = ssrBasicParams(query)
  // extract filters shared by project and software
  const {keywords, categories} = sharedFilters(query)
  // extract project specific filters
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

  return {
    search,
    order,
    rows,
    page,
    keywords,
    domains,
    organisations,
    project_status,
    categories
  }
}

function sharedFilters(query: ParsedUrlQuery){
  const keywords:string[]|null = decodeQueryParam({
    query,
    param: 'keywords',
    castToType: 'json-encoded',
    defaultValue: null
  })

  const categories:string[]|null = decodeQueryParam({
    query,
    param: 'categories',
    castToType: 'json-encoded',
    defaultValue: null
  })

  return {
    keywords,
    categories
  }
}

/**
 * Extract basic query parameters search, page, rows and order.
 * Used by organisation, news and communities overview pages.
 * @param query
 * @returns
 */
export function ssrBasicParams(query: ParsedUrlQuery) {
  const rows:number|null = decodeQueryParam({
    query,
    param: 'rows',
    defaultValue: null,
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
  const order:string|null = decodeQueryParam({
    query,
    param: 'order',
    castToType: 'string',
    defaultValue: null
  })
  return {
    search,
    rows,
    page,
    order
  }
}
