// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next'

import {app} from '~/config/app'
import {decodeQueryParam} from '~/utils/extractQueryParam'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getGlobalSearch, GlobalSearchResults} from '~/components/GlobalSearchAutocomplete/apiGlobalSearch'
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

  // Fetch search results if query exists
  let results: GlobalSearchResults[] = []
  let groupedResults: {[key: string]: GlobalSearchResults[]} = {}

  if (query && query.length > 0) {
    try {
      results = await getGlobalSearch(query, token ?? '', activeModules)
      groupedResults = groupResultsBySource(results)
    } catch {
      // Error is already logged by getGlobalSearch
      results = []
      groupedResults = {}
    }
  }

  return (
    <SearchResultsClient
      query={query || ''}
      results={results}
      groupedResults={groupedResults}
      view={view}
      activeModules={activeModules}
    />
  )
}
