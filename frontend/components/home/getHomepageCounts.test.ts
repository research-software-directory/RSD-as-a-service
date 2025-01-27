// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {getHomepageCounts} from './getHomepageCounts'

const mockResponse = {
  software_cnt: 100,
  project_cnt: 101,
  organisation_cnt: 102,
  contributor_cnt: 103,
  software_mention_cnt: 104,
}

it('makes call to api', async () => {
  const expectedUrl = '/api/v1/rpc/homepage_counts'
  const expectedBody = {
    'headers': {
      'Content-Type': 'application/json'
    }, 'method': 'GET'
  }
  // mock response
  mockResolvedValueOnce(mockResponse)
  // get counts
  const counts = await getHomepageCounts(true)
  // validate counts received propely
  expect(counts).toEqual(mockResponse)
  // validate call
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expectedBody)
})

it('returns null values on error', async () => {
  // mock response
  mockResolvedValueOnce(mockResponse, {
    status: 500,
    statusText: 'This is test errors'
  })
  // get counts
  const counts = await getHomepageCounts(true)
  // validate counts received propely
  expect(counts).toEqual({
    software_cnt: null,
    project_cnt: null,
    organisation_cnt: null,
    contributor_cnt: null,
    software_mention_cnt: null,
    open_software_cnt: null
  })
})
