// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export async function addMaintainerToOrganisation({organisation, account, token, frontend = false}:
  { organisation: string, account: string, token: string, frontend: boolean }) {
  try {
    const query ='maintainer_for_organisation'
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend === true) {
      url = `/api/v1/${query}`
    }
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        maintainer: account,
        organisation,
      })
    })
    // return info
    const info = await extractReturnMessage(resp)
    return info
  } catch (e: any) {
    logger(`addMaintainerToOrganisation failed: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
