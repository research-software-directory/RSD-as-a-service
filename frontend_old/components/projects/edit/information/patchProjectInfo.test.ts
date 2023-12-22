// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import {patchProjectTable} from './patchProjectInfo'

it('patchProjectTable', async () => {
  const mockProps = {
    id: 'project-test-id',
    data: {
      prop: 'value'
    },
    token: 'TEST-TOKEN'
  }

  const expectUrl = `/api/v1/project?id=eq.${mockProps.id}`
  const expectPayload = {
    'body': JSON.stringify(mockProps.data),
    'headers': {
      'Authorization': `Bearer ${mockProps.token}`,
      'Content-Type': 'application/json'
    },
    'method': 'PATCH'
  }
  mockResolvedValueOnce({
    status: 200,
    message: 'OK'
  })

  // call patch function
  const resp = await patchProjectTable(mockProps)

  // validate proper api call and payload
  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(
    expectUrl,
    expectPayload
  )

})
