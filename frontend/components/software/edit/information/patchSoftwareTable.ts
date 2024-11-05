// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {EditSoftwareItem} from '~/types/SoftwareTypes'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

type PatchSoftwareTableProps = {
  id: string,
  data: Partial<EditSoftwareItem>,
  token: string
}

export async function patchSoftwareTable({id,data,token}:PatchSoftwareTableProps) {
  try {
    const url = `/api/v1/software?id=eq.${id}`
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
    logger(`patchSoftwareTable failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
