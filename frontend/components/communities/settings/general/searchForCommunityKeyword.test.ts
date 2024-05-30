// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {searchForCommunityKeyword} from './searchForCommunityKeyword'

beforeEach(() => {
  jest.clearAllMocks()
})

it('searchForCommunityKeyword calls api with proper params', async() => {
  const searchFor = 'Search for keyword'
  const expectUrl = `/api/v1/rpc/keyword_count_for_community?keyword=ilike.*${encodeURIComponent(searchFor)}*&order=cnt.desc.nullslast,keyword.asc&limit=30`
  const expectPayload = {
    'method': 'GET'
  }

  mockResolvedValueOnce('OK')

  const resp = await searchForCommunityKeyword({searchFor})

  // validate api call
  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectUrl, expectPayload)
})
