// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import {searchForProjectKeyword} from './searchForKeyword'

it('searchForProjectKeyword', async () => {
  const mockProps = {
    searchFor:'test-search-string'
  }

  const expectUrl = `/api/v1/rpc/keyword_count_for_projects?keyword=ilike.*${mockProps.searchFor}*&order=cnt.desc.nullslast,keyword.asc&limit=30`
  const expectPayload = {
    'method': 'GET'
  }
  mockResolvedValueOnce({
    status: 200,
    message: 'OK'
  })

  // call patch function
  await searchForProjectKeyword(mockProps)

  // validate proper api call and payload
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(
    expectUrl,
    expectPayload
  )

})
