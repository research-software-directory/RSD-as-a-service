// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'

export async function patchSoftwareForOrganisation({software, organisation, data, token}:
{software: string, organisation: string, data: any, token: string}) {
  try {
    const query = `software=eq.${software}&organisation=eq.${organisation}`
    const url = `/api/v1/software_for_organisation?${query}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    // debugger
    return {
      status: 500,
      message: e?.message
    }
  }
}
