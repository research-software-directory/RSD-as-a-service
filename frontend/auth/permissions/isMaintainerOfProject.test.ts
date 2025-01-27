// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {isMaintainerOfProject} from './isMaintainerOfProject'

const mockData = {
  slug: 'test-project-id',
  account: 'test-account-id',
  token: 'TEST_TOKEN',
  frontend: true
}

beforeEach(() => {
  // we need to reset fetch mock counts
  jest.resetAllMocks()
})

it('calls expected rpc', async () => {
  const expectedUrl = `/api/v1/rpc/maintainer_for_project_by_slug?maintainer=eq.${mockData.account}&slug=eq.${mockData.slug}`
  const expectedOptions = {
    'headers': {
      'Authorization': `Bearer ${mockData.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'GET'
  }
  const expectedResp = [{
    maintainer: mockData.account,
    slug: mockData.slug
  }]
  // return
  mockResolvedValueOnce(expectedResp)
  // get maintainer value
  await isMaintainerOfProject(mockData)
  // validate call
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions)
})

it('return isMaintainer true', async () => {
  // return array with 1 item
  const expectedResp = [{
    maintainer: mockData.account,
    slug: mockData.slug
  }]
  // return
  mockResolvedValueOnce(expectedResp)
  // get maintainer value
  const isMaintainer = await isMaintainerOfProject(mockData)
  // validate call
  expect(isMaintainer).toBe(true)
})

it('return isMaintainer false', async () => {
  // return empty array
  mockResolvedValueOnce([])
  // get maintainer value
  const isMaintainer = await isMaintainerOfProject(mockData)
  // validate call
  expect(isMaintainer).toBe(false)
})
