// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

type PatchProjectTableProp = {
  id: string,
  data: {},
  token: string
}

export async function patchProjectTable({id, data, token}: PatchProjectTableProp) {
  try {
    const url = `/api/v1/project?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(data)
    })

    // debugger
    return extractReturnMessage(resp, id)
  } catch (e: any) {
    logger(`patchProjectInfo failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
