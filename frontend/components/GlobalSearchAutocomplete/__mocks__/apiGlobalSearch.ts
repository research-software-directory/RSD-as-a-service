// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

export type GlobalSearchResultsSource = 'software' | 'projects' | 'organisations' | 'communities'

export type GlobalSearchResults = {
  rsd_host: string | null
  domain: string | null
  slug: string,
  name: string,
  source: GlobalSearchResultsSource,
  is_published?: boolean,
  search_text?: string
}

import apiResponse from './globalSearchApiResponse.json'
/**
 *
 * @param searchText
 * @param token
 */
export const getGlobalSearch=jest.fn(async()=>{
  return apiResponse
})
