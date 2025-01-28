// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {patchOrganisationTable} from './updateOrganisationSettings'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'


beforeEach(() => {
  jest.clearAllMocks()
})

it('calls api with proper params', async() => {
  const mockData = {
    id: 'test-id',
    data: {
      'field':'value'
    },
    token: 'TEST-TOKEN'
  }
  const expectUrl = '/api/v1/organisation?id=eq.test-id'
  const expectApi = {
    'body': JSON.stringify(mockData.data),
    'headers': {
      'Authorization': `Bearer ${mockData.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'PATCH'
  }

  mockResolvedValueOnce('OK',{status:200})

  const resp = await patchOrganisationTable(mockData)
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectUrl,expectApi)
  expect(resp).toEqual({
    status: 200,
    message: 'OK'
  })
})

it('returns api error', async () => {
  const mockData = {
    id: 'test-id',
    data: {
      'field': 'value'
    },
    token: 'TEST-TOKEN'
  }

  // resolve to error with custom error message
  mockResolvedValueOnce({message:'Custom error message'}, {status: 400})

  const resp = await patchOrganisationTable(mockData)
  expect(global.fetch).toHaveBeenCalledTimes(1)

  expect(resp).toEqual({
    'status': 400,
    'message': 'Custom error message',
  })
})
