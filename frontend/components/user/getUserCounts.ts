// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {UserCounts} from './UserNav'

const defaultResponse = {
  software_cnt: undefined,
  project_cnt: undefined,
  organisation_cnt: undefined,
}

export async function getUserCounts({token}:{token?: string}) {
  try {
    // NOTE! the selection is based on the token
    // RLS in postgres returns only counts for the user
    // therefore no additional account filter is required
    let query = 'rpc/counts_by_maintainer'
    let url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const counts: UserCounts = await resp.json()
      return counts
    }
    // ERRORS
    logger(`getUserCounts: ${resp.status}:${resp.statusText}`, 'warn')
    return defaultResponse
  } catch (e: any) {
    logger(`getUserCounts: ${e?.message}`, 'error')
    return defaultResponse
  }
}
