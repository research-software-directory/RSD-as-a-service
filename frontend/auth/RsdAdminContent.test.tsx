// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {Session} from './index'

import RsdAdminContent from './RsdAdminContent'
import {useAuth} from './AuthProvider'

const adminText = 'RSD ADMIN component'

function ProtectedComponent() {
  const {session} = useAuth()
  return (
    <RsdAdminContent>
      <div>
        <h1>{adminText}</h1>
        <pre>{JSON.stringify(session,null,2)}</pre>
      </div>
    </RsdAdminContent>
  )
}


it('Shows loader when session.status==="loading"', () => {
  const testSession = {
    ...mockSession,
    status: 'loading'
  } as Session

  render(
    <WithAppContext options={{session: testSession}}>
      <ProtectedComponent />
    </WithAppContext>
  )

  screen.getByRole('progressbar')
  // screen.debug()
})

it('Protects content with 401 when session.status==="missing"', () => {
  const testSession = {
    ...mockSession,
    status: 'missing'
  } as Session

  render(
    <WithAppContext options={{session: testSession}}>
      <ProtectedComponent />
    </WithAppContext>
  )

  screen.getByRole('heading', {name:'401'})

})

it('Protects content with 403 when authenticated but not rsd_admin', () => {
  const testSession = {
    ...mockSession
  } as Session

  render(
    <WithAppContext options={{session: testSession}}>
      <ProtectedComponent />
    </WithAppContext>
  )
  screen.getByRole('heading', {name: '403'})
  // screen.debug()
})

it('Shows content when authenticated AND rsd_admin', () => {

  const testSession = {
    ...mockSession,
    user: {
      ...mockSession.user,
      role: 'rsd_admin'
    }

  } as Session

  render(
    <WithAppContext options={{session: testSession}}>
      <ProtectedComponent />
    </WithAppContext>
  )

  const heading = screen.getByRole('heading')
  expect(heading.innerHTML).toContain(adminText)
  // screen.debug()
})
