// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {RsdModuleName} from '~/config/rsdSettingsReducer'

// export type GlobalSearchResultsSource = 'software' | 'projects' | 'organisations' | 'communities' | 'persons'

export type GlobalSearchResults = {
  rsd_host: string | null
  domain: string | null
  slug: string,
  name: string,
  short_description?: string,
  source: RsdModuleName,
  is_published?: boolean,
  image_id?: string | null,
  search_text?: string
}

/**
 * Fetch search results with 100 results per category (not 100 total)
 * This ensures fair representation across all categories
 * @param searchText - The search query
 * @param token - Authentication token
 * @param rsd_modules - Optional filter by specific modules
 */
export async function getGlobalSearch(searchText: string, token: string, rsd_modules?: string[]): Promise<GlobalSearchResults[]> {
  try {
    // Get modules to search
    const modulesToSearch = rsd_modules || ['software', 'projects', 'organisations', 'communities', 'persons', 'news']

    // Fetch 100 results per category in parallel
    const resultsPerCategory = await Promise.all(
      modulesToSearch.map(async (module) => {
        const query = `query=${encodeURIComponent(searchText)}&source=eq.${module}&limit=100&order=rank.asc,index_found.asc`
        const url = `${getBaseUrl()}/rpc/global_search?${query}`

        const resp = await fetch(url, {
          method: 'GET',
          headers: {
            ...createJsonHeaders(token)
          }
        })

        if (resp.status === 200) {
          return await resp.json() as GlobalSearchResults[]
        } else {
          logger(`getGlobalSearch for ${module}: status ${resp.status}`, 'warn')
          return []
        }
      })
    )

    // Flatten all results into a single array
    // Results are already sorted by rank within each category by the backend
    const allResults = resultsPerCategory.flat()

    return allResults
  } catch (e: any) {
    logger(`getGlobalSearch: ${e?.message}`, 'error')
    throw e
  }
}

/**
 * Get the count of results per source type for a search query
 * This fetches actual data to count (no limit) since PostgREST RPC functions
 * don't reliably support the Prefer: count=exact header
 * @param searchText - The search query
 * @param token - Authentication token
 * @param rsd_modules - Optional filter by specific modules
 * @returns Object with counts per source type
 */
export async function getGlobalSearchCounts(
  searchText: string,
  token: string,
  rsd_modules?: string[]
): Promise<Record<string, number>> {
  try {
    // Build query for each module to get counts
    const counts: Record<string, number> = {}

    // Get all modules to count
    const modulesToCount = rsd_modules || ['software', 'projects', 'organisations', 'communities', 'persons', 'news']

    // Fetch counts for each module separately
    // We fetch all results for each module (no limit) and count them
    // This is done in parallel to minimize wait time
    await Promise.all(
      modulesToCount.map(async (module) => {
        // No limit - fetch all results for this source type
        const query = `query=${encodeURIComponent(searchText)}&source=eq.${module}&order=rank.asc`
        const url = `${getBaseUrl()}/rpc/global_search?${query}`

        const resp = await fetch(url, {
          method: 'GET',
          headers: {
            ...createJsonHeaders(token)
          }
        })

        if (resp.status === 200) {
          const results = await resp.json() as GlobalSearchResults[]
          counts[module] = results.length
        } else {
          logger(`getGlobalSearchCounts for ${module}: status ${resp.status}`, 'warn')
          counts[module] = 0
        }
      })
    )

    return counts
  } catch (e: any) {
    logger(`getGlobalSearchCounts: ${e?.message}`, 'error')
    // Return empty counts on error
    return {}
  }
}
