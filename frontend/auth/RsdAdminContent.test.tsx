// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'
import {useAuth, defaultSession} from '.'

import RsdAdminContent from './RsdAdminContent'

const adminText = 'RSD ADMIN component'

function ProtectedComponent() {
  // const {useAuth} = auth
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
  defaultSession.status='loading'
  render(WrappedComponentWithProps(ProtectedComponent, {
    session: defaultSession
  }))
  const loader = screen.getByRole('progressbar')
  expect(loader).toBeInTheDocument()
  // screen.debug()
})

it('Protects content with 401 when session.status==="missing"', () => {
  defaultSession.status='missing'
  render(WrappedComponentWithProps(ProtectedComponent, {
    session: defaultSession
  }))
  const heading = screen.getByRole('heading')
  expect(heading.innerHTML).toContain('401')
})

it('Protects content with 403 when authenticated but not rsd_admin', () => {
  defaultSession.status = 'authenticated'
  defaultSession.user = {
    iss: 'rsd_auth',
    role: 'rsd_user',
    exp: 1212121212,
    account: 'test-account-string',
    name: 'John Doe'
  }
  render(WrappedComponentWithProps(ProtectedComponent, {
    session: defaultSession
  }))
  const heading = screen.getByRole('heading')
  expect(heading.innerHTML).toContain('403')
})

it('Shows content when authenticated AND rsd_admin', () => {
  defaultSession.status = 'authenticated'
  defaultSession.user = {
    iss: 'rsd_auth',
    role: 'rsd_admin',
    exp: 1212121212,
    account: 'test-account-string',
    name: 'John Doe'
  }
  defaultSession.token='TEST_RANDOM_TOKEN'
  render(WrappedComponentWithProps(ProtectedComponent, {
    session: defaultSession
  }))
  const heading = screen.getByRole('heading')
  expect(heading.innerHTML).toContain(adminText)
  // screen.debug()
})
