// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
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
      prop: 'value'
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

  const resp = await patchSoftwareTable(mockProps)

  // validate api call
  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectUrl,expectPayload)
})
