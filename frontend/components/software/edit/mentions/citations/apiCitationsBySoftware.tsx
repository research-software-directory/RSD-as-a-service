// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {MentionItemProps} from '~/types/Mention'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

type GetCitationsForSoftwareProps={
  software: string,
  token: string
}

export async function getCitationsBySoftware({
  software,token}:GetCitationsForSoftwareProps
){
  try {
    // the content is ordered by type ascending
    const query = `rpc/citation_by_software?software=eq.${software}&order=mention_type.asc`
    // construct url
    const url = `${getBaseUrl()}/${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
        // 'Prefer': 'count=exact'
      }
    })
    if ([200,206].includes(resp.status)===true) {
      const json:MentionItemProps[] = await resp.json()
      return json
    }
    logger(`getCitationsBySoftware: [${resp.status}] [${url}]`, 'error')
    // query not found
    return []
  } catch (e: any) {
    logger(`getCitationsBySoftware: ${e?.message}`, 'error')
    return []
  }
}
