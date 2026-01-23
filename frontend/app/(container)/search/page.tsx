// SPDX-FileCopyrightText: Jesse Gonzalez (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next'

import {app} from '~/config/app'
import {decodeQueryParam} from '~/utils/extractQueryParam'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getGlobalSearch, getGlobalSearchCounts, GlobalSearchResults} from '~/components/GlobalSearchAutocomplete/apiGlobalSearch'
import SearchResultsClient from '~/components/search/SearchResultsClient'

export const metadata: Metadata = {
  title: `Search | ${app.title}`,
  description: 'Search results for software, projects, organisations and more.'
}

// Group results by source type
function groupResultsBySource(results: GlobalSearchResults[]) {
  const grouped: {[key: string]: GlobalSearchResults[]} = {}

  results.forEach(result => {
    const source = result.source
    if (!grouped[source]) {
      grouped[source] = []
    }
    grouped[source].push(result)
  })

  return grouped
}

export default async function SearchResultsPage({
  searchParams
}:Readonly<{
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}>) {
  // extract params and user settings
  const [params, {token}] = await Promise.all([
    searchParams,
    getUserSettings(),
  ])

  const activeModules = await getActiveModuleNames()

  // Extract search query (using 'q' parameter)
  const query:string|null = decodeQueryParam({
    query: params,
    param: 'q',
    defaultValue: null,
    castToType:'raw'
  })

  // Extract view mode
  const view:string = decodeQueryParam({
    query: params,
    param: 'view',
    defaultValue: 'grid',
    castToType:'string'
  })

  // Fetch search results and counts if query exists
  let groupedResults: {[key: string]: GlobalSearchResults[]} = {}
  let resultCounts: Record<string, number> = {}

  if (query && query.length > 0) {
    try {
      // Fetch results and counts in parallel
      const [searchResults, counts] = await Promise.all([
        getGlobalSearch(query, token ?? '', activeModules),
        getGlobalSearchCounts(query, token ?? '', activeModules)
      ])
      groupedResults = groupResultsBySource(searchResults)
      resultCounts = counts
    } catch {
      // Error is already logged by getGlobalSearch/getGlobalSearchCounts
      groupedResults = {}
      resultCounts = {}
    }
  }

  return (
    <SearchResultsClient
      query={query || ''}
      groupedResults={groupedResults}
      resultCounts={resultCounts}
      view={view}
      activeModules={activeModules}
    />
  )
}
