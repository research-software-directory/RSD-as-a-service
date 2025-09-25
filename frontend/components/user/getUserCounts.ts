// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {UserCounts} from './context/UserContext'

const defaultResponse:UserCounts = {
  software_cnt: 0,
  project_cnt: 0,
  organisation_cnt: 0,
  community_cnt: 0
}

export async function getUserCounts({token}:{token?: string}) {
  try {
    // NOTE! the selection is based on the token
    // RLS in postgres returns only counts for the user
    // therefore no additional account filter is required
    const query = 'rpc/counts_by_maintainer'
    const url = `${getBaseUrl()}/${query}`

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
