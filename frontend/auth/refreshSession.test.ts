// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {refreshSession} from './refreshSession'
import {mockResolvedValueOnce} from '../utils/jest/mockFetch'
import {mockSession} from '~/utils/jest/WithAppContext'
import {Session} from '.'

// mock console log
global.console = {
  ...global.console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
}

it('returns valid session', async() => {
  mockResolvedValueOnce({session: mockSession})
  const session = await refreshSession()
  expect(session).toEqual(mockSession)
})

it('returns null when no session', async () => {
  mockResolvedValueOnce({})
  const session = await refreshSession()
  expect(session).toEqual(null)
})

it('returns null on error and logs error', async () => {
  mockResolvedValueOnce({}, {
    status:400
  })
  const session = await refreshSession()
  // returns null for session
  expect(session).toEqual(null)
  // calls error log
  expect(global.console.error).toBeCalledTimes(1)
})
