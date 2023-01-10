// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {findSoftwareWithKeyword} from './keywordForSoftware'


beforeEach(() => {
  jest.clearAllMocks()
})

it('findSoftwareWithKeyword', async () => {
  const searchFor = 'Test search'
  const expectUrl = `/api/v1/rpc/keyword_count_for_software?keyword=ilike.*${encodeURIComponent(searchFor)}*&cnt=gt.0&order=cnt.desc.nullslast,keyword.asc&limit=30`
  const expectPayload = {
    'method': 'GET'
  }

  mockResolvedValueOnce([])

  const resp = await findSoftwareWithKeyword({searchFor})

  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectUrl, expectPayload)
})
