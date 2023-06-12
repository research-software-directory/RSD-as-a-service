// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import {sortBySearchFor} from '~/utils/sortFn'

export type GlobalSearchResults = {
  slug: string,
  name: string,
  source: string,
  is_published?: boolean,
  search_text?: string
} | undefined

/**
 *
 * @param searchText
 * @param token
 */
export async function getGlobalSearch(searchText: string, token: string,) {
  try {
    // call the function query
    const query = `rpc/global_search?search_text=ilike.*${searchText}*&limit=30`
    let url = `/api/v1/${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    if (resp.status === 200) {
      const rawData: GlobalSearchResults[] = await resp.json()
      // sort by search value based on name property
      const sorted = rawData.sort((a, b) => sortBySearchFor(a,b,'name',searchText))
      return sorted
    }
  } catch (e: any) {
    logger(`getGlobalSearch: ${e?.message}`, 'error')
    return []
  }
}
