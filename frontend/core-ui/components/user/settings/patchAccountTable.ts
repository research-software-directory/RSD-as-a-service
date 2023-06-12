// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type PatchAccountTableProps = {
  account: string,
  data: {
    [key: string]: any
  },
  token: string
}

export async function patchAccountTable({account, data, token}: PatchAccountTableProps) {
  try {
    const url = `/api/v1/account?id=eq.${account}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, account)
  } catch (e: any) {
    logger(`patchAccountTable failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
