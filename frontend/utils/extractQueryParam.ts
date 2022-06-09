// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import type {GetServerSidePropsContext, NextApiRequest} from 'next'
import logger from './logger'

export function extractQueryParam({ctx,param,castToType='string',defaultValue}:{
  ctx: GetServerSidePropsContext, param:string, castToType?:('string'|'number'|'date'),
  defaultValue:any
}){
  try{
    if (ctx?.query && ctx.query.hasOwnProperty(param)){
      const rawVal = ctx.query[param]
      if (typeof rawVal == 'undefined') return defaultValue
      switch (castToType){
      case 'number':
        return parseInt(rawVal?.toString())
      case 'date':
        return new Date(rawVal?.toString())
      case 'string':
      default:
        return rawVal?.toString()
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

export function ssrSoftwareParams(ctx: GetServerSidePropsContext){
  const rows = extractQueryParam({
    ctx,
    param: 'rows',
    defaultValue: 12,
    castToType:'number'
  })
  const page = extractQueryParam({
    ctx,
    param: 'page',
    defaultValue: 0,
    castToType:'number'
  })
  const search = extractQueryParam({
    ctx,
    param: 'search',
    defaultValue: null
  })
  const filterStr = extractQueryParam({
    ctx,
    param: 'filter',
    defaultValue: null
  })
  return {
    search,
    filterStr,
    rows,
    page,
  }
}

export function ssrProjectsParams(ctx: GetServerSidePropsContext) {
  const rows = extractQueryParam({
    ctx,
    param: 'rows',
    defaultValue: 12,
    castToType: 'number'
  })
  const page = extractQueryParam({
    ctx,
    param: 'page',
    defaultValue: 0,
    castToType: 'number'
  })
  const search = extractQueryParam({
    ctx,
    param: 'search',
    defaultValue: null
  })
  return {
    search,
    rows,
    page,
  }
}

export function ssrOrganisationParams(ctx: GetServerSidePropsContext) {
  const rows = extractQueryParam({
    ctx,
    param: 'rows',
    defaultValue: 12,
    castToType: 'number'
  })
  const page = extractQueryParam({
    ctx,
    param: 'page',
    defaultValue: 0,
    castToType: 'number'
  })
  const search = extractQueryParam({
    ctx,
    param: 'search',
    defaultValue: null
  })
  return {
    search,
    rows,
    page,
  }
}
