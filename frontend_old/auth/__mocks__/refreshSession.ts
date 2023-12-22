// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Session} from '..'
import {mockSession} from '~/utils/jest/WithAppContext'

export async function refreshSession(): Promise<Session | null> {
  // return default mocked session
  return mockSession
}
