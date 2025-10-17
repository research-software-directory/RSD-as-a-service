// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ApiParams} from '~/utils/postgrestUrl'
import {BackendLog} from '../useLogs'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getLogs=jest.fn(async({page, rows, token, searchFor, orderBy}: ApiParams<BackendLog, keyof BackendLog>)=>{
  try {
    return {
      count: 0,
      logs: []
    }
  } catch {
    return {
      count: 0,
      logs: []
    }
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteLogById=jest.fn(async({id,token}:{id:string, token:string})=>{
  try{
    return {
      status:200,
      message: 'OK'
    }
  }catch{
    return {
      status: 500,
      message: 'Server error'
    }
  }
})

/**
 * Deletes logs older than specified number of days.
 * Based on created_at value. Default days is 30 and the limit of 1000 records to remove.
 * @param @object{days?,limit?,token}
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteLogsOlderThan=jest.fn(async({days=30,limit=1000,token}:{token:string,days?:number,limit?:number})=>{
  return {
    status: 200,
    message: 0,
  }
})
