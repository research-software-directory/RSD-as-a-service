// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export type LogType = ('info'|'warn'|'error')

export default function logger(
  message:string,
  logType:LogType='info'
){
  switch(logType){
    case 'error':
    // eslint-disable-next-line
    console.error(`[ERROR] ${message}`)
      break
    case 'warn':
    // eslint-disable-next-line
    console.warn(`[WARNING] ${message}`)
      break
    default:
    // info logs only in dev
      if (process.env.NODE_ENV ==='development'){
      // eslint-disable-next-line
      console.log(`[INFO] ${message}`)
      }
  }
}
