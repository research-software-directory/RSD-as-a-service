// SPDX-FileCopyrightText: 2021 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import logger from './logger'

export function extractCountFromHeader(headers:Headers){
  try{
    const stats = headers.get('Content-Range')
    if (stats){
      // example postgREST return string
      // 0-11/190 -> items 0 to 11 of 190
      const splitted = stats.split('/')
      if (splitted.length > 0){
        const count = Number.parseInt(splitted[1])
        return isNaN(count) ? null : count
      }
      return null
    }
    return null
  }catch(e:any){
    logger(`extractCountFromHeader: ${e?.message}`,'error')
    return null
  }
}
