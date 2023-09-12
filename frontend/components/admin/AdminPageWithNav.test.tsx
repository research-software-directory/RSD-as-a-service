// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'


import AdminPageWithNav from './AdminPageWithNav'
import {Session} from '~/auth'

it('returns 401 when status!=authenticated', async () => {
  const testSession = {
    ...mockSession,
    status: 'expired'
  } as Session

  const mockHeader='Admin content body'

  render(
    <WithAppContext options={{session: testSession}}>
      <AdminPageWithNav title="Test nav">
        <h1>{mockHeader}</h1>
      </AdminPageWithNav>
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: '401'})
})

it('returns 401 when user token expired', async () => {
  const testSession = {
    ...mockSession,
    user: {
      ...mockSession.user,
      role: 'rsd_admin',
      exp: 1111111
    }
  } as Session

  const mockHeader='Admin content body'

  render(
    <WithAppContext options={{session: testSession}}>
      <AdminPageWithNav title="Test nav">
        <h1>{mockHeader}</h1>
      </AdminPageWithNav>
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: '401'})
})

it('returns 403 when NOT rsd_admin role and status=authenticated', async () => {
  const testSession = {
    ...mockSession,
    user: {
      ...mockSession.user,
      role: 'rsd_user'
    }
  } as Session

  const mockHeader='Admin content body'

  render(
    <WithAppContext options={{session: testSession}}>
      <AdminPageWithNav title="Test nav">
        <h1>{mockHeader}</h1>
      </AdminPageWithNav>
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: '403'})
  // await screen.findByRole('heading', {name: mockHeader})
})

it('returns 403 when no user', async () => {
  const testSession = {
    ...mockSession,
    user: {}
  } as Session

  const mockHeader='Admin content body'

  render(
    <WithAppContext options={{session: testSession}}>
      <AdminPageWithNav title="Test nav">
        <h1>{mockHeader}</h1>
      </AdminPageWithNav>
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: '403'})
})

it('returns title and content when rsd_admin role', async () => {
  const testSession = {
    ...mockSession,
    user: {
      ...mockSession.user,
      role: 'rsd_admin'
    }
  } as Session

  const mockTitle = 'Test page title'
  const mockContentId='admin-page-content'

  render(
    <WithAppContext options={{session: testSession}}>
      <AdminPageWithNav title={mockTitle}>
        <section data-testid={mockContentId}>
          <h2>Just some content</h2>
        </section>
      </AdminPageWithNav>
    </WithAppContext>
  )

  // find page title
  await screen.findByRole('heading', {name: mockTitle})
  // find passed page content
  screen.getByTestId(mockContentId)
})
