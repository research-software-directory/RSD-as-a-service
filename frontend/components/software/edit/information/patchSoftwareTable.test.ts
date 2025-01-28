// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import {patchSoftwareTable} from './patchSoftwareTable'

beforeEach(() => {
  jest.clearAllMocks()
})

it('patchSoftwareTable calls api with proper params', async() => {
  const mockProps = {
    id: 'software-id',
    data: {
      brand_name: 'Test brand name'
    },
    token: 'TEST-TOKEN'
  }

  const expectUrl = `/api/v1/software?id=eq.${mockProps.id}`
  const expectPayload = {
    body: JSON.stringify(mockProps.data),
    'headers':{
      'Authorization': `Bearer ${mockProps.token}`,
      'Content-Type': 'application/json',
    },
    'method': 'PATCH'
  }

  mockResolvedValueOnce('OK')

  await patchSoftwareTable(mockProps)

  // validate api call
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectUrl,expectPayload)
})
