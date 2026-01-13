// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use server'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type HomepageCounts={
  software_cnt: number | null,
  open_software_cnt: number | null,
  project_cnt: number | null,
  organisation_cnt: number | null,
  contributor_cnt: number | null,
  software_mention_cnt: number | null,
}

export async function getHomepageCounts() {
  try {
    const query = 'rpc/homepage_counts'
    const url = `${getBaseUrl()}/${query}`
    // console.log('getHomepageCounts...url...',url)
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(),
      },
    })

    if (resp.status === 200) {
      const data:HomepageCounts = await resp.json()
      return data
    }
    logger(`getHomepageCounts ${resp.status} ${resp.statusText}`, 'warn')
    return {
      software_cnt: null,
      open_software_cnt: null,
      project_cnt: null,
      organisation_cnt: null,
      contributor_cnt: null,
      software_mention_cnt: null
    }
  } catch (e:any) {
    // otherwise request failed
    logger(`getHomepageCounts failed: ${e?.message}`, 'error')
    // we log and return zero
    return {
      software_cnt: null,
      open_software_cnt: null,
      project_cnt: null,
      organisation_cnt: null,
      contributor_cnt: null,
      software_mention_cnt: null
    }
  }
}
