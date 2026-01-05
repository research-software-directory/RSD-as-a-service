// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export async function isMaintainerOfProject({slug, account, token}:
{slug?: string, account?: string, token?: string}) {
  try {
    // return false directly when missing info
    if (!slug || !account || !token) return false
    // build url
    const url = `${getBaseUrl()}/rpc/maintainer_for_project_by_slug?maintainer=eq.${account}&slug=eq.${slug}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    // MAINTAINER
    if (resp.status === 200) {
      const json = await resp.json()
      // it should return exactly 1 item
      if (json?.length === 1) {
        // having maintainer equal to uid
        return json[0].maintainer === account
      }
      return false
    }
    // ERRORS AS NOT MAINTAINER
    logger(`isMaintainerOfProject: Not a maintainer of ${slug}. ${resp.status}:${resp.statusText}`, 'warn')
    return false
  } catch (e: any) {
    logger(`isMaintainerOfProject: ${e?.message}`, 'error')
    // ERRORS AS NOT MAINTAINER
    return false
  }
}

export default isMaintainerOfProject
