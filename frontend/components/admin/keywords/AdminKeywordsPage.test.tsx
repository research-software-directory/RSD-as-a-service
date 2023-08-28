// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AdminKeywordsIndexPage from '~/components/admin/keywords/index'
import {Session} from '~/auth'

const testSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'rsd_admin'
  }
} as Session

describe('components/admin/keywords/index.tsx', () => {

  it('shows progressbar initialy', () => {

    render(
      <WithAppContext options={{session: testSession}}>
        <AdminKeywordsIndexPage />
      </WithAppContext>
    )
    screen.getByRole('progressbar')
    // screen.debug()
  })
})
