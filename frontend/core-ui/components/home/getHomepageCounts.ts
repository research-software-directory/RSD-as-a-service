// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export async function getHomepageCounts(frontend?:boolean) {
  try {
    const query = 'rpc/homepage_counts'
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend) {
      url = `/api/v1/${query}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(),
      },
    })

    if (resp.status === 200) {
      const data = await resp.json()
      return data
    }
    logger(`getHomepageCounts ${resp.status} ${resp.statusText}`, 'warn')
    return {
      software_cnt: null,
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
      project_cnt: null,
      organisation_cnt: null,
      contributor_cnt: null,
      software_mention_cnt: null
    }
  }
}
