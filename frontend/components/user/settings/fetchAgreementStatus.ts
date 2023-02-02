// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {UserSettingsType} from '~/types/SoftwareTypes'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export async function fetchAgreementStatus(token: string, account: string) {
  const url = `/api/v1/account?id=eq.${account}&select=agree_terms,notice_privacy_statement`
  try {
    const resp = await fetch(url, {headers: {...createJsonHeaders(token)}})
    const json: UserSettingsType[] = await resp.json()
    return {
      status: 200,
      data: json[0]
    }
  } catch (e: any) {
    logger(`Retrieving user agreement status failed: ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
