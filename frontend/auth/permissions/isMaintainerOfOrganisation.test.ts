// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {isOrganisationMaintainer} from './isMaintainerOfOrganisation'

const mockData = {
  organisation: 'test-organisation-id',
  account: 'test-account-id',
  token: 'TEST_TOKEN',
  frontend: true
}

beforeEach(() => {
  // we need to reset fetch mock counts
  jest.resetAllMocks()
})

it('returns true when organisation in list', async () => {
  const expectedUrl='/api/v1/rpc/organisations_of_current_maintainer'
  const expectedOptions = {
    'headers': {
      'Authorization': `Bearer ${mockData.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'GET'
  }
  // return mocked organisation
  mockResolvedValueOnce([mockData.organisation])
  // get maintainer value
  const isMaintainer = await isOrganisationMaintainer(mockData)
  // should return true
  expect(isMaintainer).toBe(true)

  // validate call
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions)
})

it('returns false when organisation NOT in list', async () => {
  // return mocked organisation
  mockResolvedValueOnce([])
  // get maintainer value
  const isMaintainer = await isOrganisationMaintainer(mockData)
  // should return true
  expect(isMaintainer).toBe(false)
})

it('makes call to expected rpc ', async () => {
  const expectedUrl = '/api/v1/rpc/organisations_of_current_maintainer'
  const expectedOptions = {
    'headers': {
      'Authorization': `Bearer ${mockData.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'GET'
  }
  // return mocked organisation
  mockResolvedValueOnce([mockData.organisation])
  // get maintainer value
  await isOrganisationMaintainer(mockData)
  // validate call
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions)
})
