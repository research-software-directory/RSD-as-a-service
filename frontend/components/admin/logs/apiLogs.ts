// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {ApiParams, paginationUrlParams} from '~/utils/postgrestUrl'
import {BackendLog} from './useLogs'
import {getDateFromNow} from '~/utils/dateFn'

export async function getLogs({page, rows, token, searchFor, orderBy}: ApiParams<BackendLog, keyof BackendLog>) {
  try {
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      query+=`&or=(service_name.ilike."*${searchFor}*",table_name.ilike."*${searchFor}*",message.ilike."*${searchFor}*",stack_trace.ilike."*${searchFor}*",slug.ilike."*${searchFor}*")`
    }
    if (orderBy) {
      query+=`&order=${orderBy.column}.${orderBy.direction}`
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/backend_log_view?${query}`

    // make request
    const headers: any = {
      ...createJsonHeaders(token)
    }
    if (page === 0) {
      // request record count to be returned
      // note: it's returned in the header
      headers['Prefer'] = 'count=exact'
    }
    const resp = await fetch(url,{
      method: 'GET',
      headers: headers
    })

    if ([200,206].includes(resp.status)) {
      const logs: BackendLog[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers),
        logs
      }
    }
    logger(`getLogs: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      logs: []
    }
  } catch (e: any) {
    logger(`getLogs: ${e.message}`,'error')
    return {
      count: 0,
      logs: []
    }
  }
}

export async function deleteLogById({id,token}:{id:string, token:string}){
  const url = `${getBaseUrl()}/backend_log?id=eq.${id}`
  try{
    // make request
    const resp = await fetch(url,{
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      },
    })

    return extractReturnMessage(resp)
  }catch(e:any){
    logger(`getLogs: ${e.message}`,'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

/**
 * Deletes logs older than specified number of days.
 * Based on created_at value. Default days is 30 and the limit of 1000 records to remove.
 * @param @object{days?,limit?,token}
 * @returns
 */
export async function deleteLogsOlderThan({days=30,token}:{token:string,days?:number}){
  // use negative days value
  const targetDate = getDateFromNow(-days)
  // convert to iso string to pass in query
  const isoStrDate = targetDate.toISOString()
  // delete records where created_at < isoStrDate
  const url = `${getBaseUrl()}/backend_log?created_at=lt.${isoStrDate}&select=id`
  try{
    // make request
    const resp = await fetch(url,{
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
        // request deleted records to be returned AND the record count in the response header
        'Prefer': 'return=representation,count=exact'
      },
    })

    if ([200,204,206].includes(resp.status)){
      // const ids:string[] = await resp.json()
      return {
        status: 200,
        message: extractCountFromHeader(resp.headers) ?? 0,
      }
    }else{
      return extractReturnMessage(resp)
    }

  }catch(e:any){
    logger(`getLogs: ${e.message}`,'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
