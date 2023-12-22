// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ApiParams} from '~/utils/postgrestUrl'
import {BackendLog} from '../useLogs'

export async function getLogs({page, rows, token, searchFor, orderBy}: ApiParams<BackendLog, keyof BackendLog>) {
  try {
    return {
      count: 0,
      logs: []
    }
  } catch (e: any) {
    return {
      count: 0,
      logs: []
    }
  }
}

export async function deleteLogById({id,token}:{id:string, token:string}){
  try{
    return {
      status:200,
      message: 'OK'
    }
  }catch(e:any){
    return {
      status: 500,
      message: 'Server error'
    }
  }
}

/**
 * Deletes logs older than specified number of days.
 * Based on created_at value. Default days is 30 and the limit of 1000 records to remove.
 * @param @object{days?,limit?,token}
 * @returns
 */
export async function deleteLogsOlderThan({days=30,limit=1000,token}:{token:string,days?:number,limit?:number}){
  return {
    status: 200,
    message: 0,
  }
}
