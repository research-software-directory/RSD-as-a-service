// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {refreshSession} from './refreshSession'
import {mockResolvedValueOnce} from '../utils/jest/mockFetch'
import {mockSession} from '~/utils/jest/WithAppContext'

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
  expect(global.console.error).toHaveBeenCalledTimes(1)
})
