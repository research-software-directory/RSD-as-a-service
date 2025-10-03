// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import useOrganisationMaintainer from './useOrganisationMaintainer'
import {Session} from '..'

const mockData = {
  organisation: 'test-organisation-id',
  user: {
    account: 'test-account-id',
    role: 'rsd_admin'
  },
  token: 'TEST_TOKEN',
  frontend: true
}

beforeEach(() => {
  // we need to reset fetch mock counts
  jest.resetAllMocks()
})

function WrappedHook() {
  const {loading, isMaintainer} = useOrganisationMaintainer({
    organisation: mockData.organisation
  })

  // console.group('WrappedHook')
  // console.log('loading...', loading)
  // console.log('isMaintainer...', isMaintainer)
  // console.groupEnd()

  if (loading===true) {
    return (
      <h1>Loading</h1>
    )
  }

  if (isMaintainer===true) {
    return (
      <h1>IS MAINTAINER</h1>
    )
  }

  return (
    <h1>403</h1>
  )
}

it('returns isMaintainer=true for rsd_admin role', async () => {
  const testSession = {
    ...mockSession,
    status: 'authenticated',
    token: mockData.token,
    user: {
      ...mockSession.user,
      ...mockData.user
    }
  } as Session

  // return response to getMaintainerOrganisations
  // mockResolvedValueOnce(['Random organisation name'])

  render(
    <WithAppContext options={{session: testSession}}>
      <WrappedHook />
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading', {name: 'IS MAINTAINER'})
})

it('returns isMaintainer=true when user is maintainer of organisation', async() => {
  // return organisation in the list
  mockResolvedValueOnce([mockData.organisation])

  render(
    <WithAppContext options={{session: mockSession}}>
      <WrappedHook />
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: 'IS MAINTAINER'})
})

it('returns isMaintainer=false when user is NOT maintainer of organisation', async () => {
  // set authenticated props

  mockResolvedValueOnce(['Random organisation name'])

  render(
    <WithAppContext options={{session: mockSession}}>
      <WrappedHook />
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: '403'})
})


it('returns isMaintainer=false when user is NOT maintainer of organisation', async () => {
  // set authenticated props

  mockResolvedValueOnce(['Random organisation name'])

  render(
    <WithAppContext options={{session: mockSession}}>
      <WrappedHook />
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: '403'})
})


it('returns isMaintainer=false when NO user.account OR user.role defined', async () => {
  // set authenticated props
  // mockResolvedValueOnce(['Random organisation name'])
  const noUser = {
    ...mockSession,
    user: {}
  } as Session

  render(
    <WithAppContext options={{session: noUser}}>
      <WrappedHook />
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: '403'})
})

it('returns isMaintainer=false when NO TOKEN', async () => {
  // set authenticated props
  // mockResolvedValueOnce(['Random organisation name'])
  const noUser = {
    ...mockSession,
    token: ''
  } as Session

  render(
    <WithAppContext options={{session: noUser}}>
      <WrappedHook />
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: '403'})
})

it('returns isMaintainer=false when user.account=""', async () => {
  // set authenticated props
  // mockResolvedValueOnce(['Random organisation name'])
  const noUser = {
    ...mockSession,
    user: {
      ...mockSession.user,
      account: ''
    }
  } as Session

  render(
    <WithAppContext options={{session: noUser}}>
      <WrappedHook />
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: '403'})
})

it('returns isMaintainer=false when token is expired', async () => {
  // set authenticated props
  // mockResolvedValueOnce(['Random organisation name'])
  const noUser = {
    ...mockSession,
    user: {
      ...mockSession.user,
      // expired user values
      exp: 1111111
    }
  } as Session

  render(
    <WithAppContext options={{session: noUser}}>
      <WrappedHook />
    </WithAppContext>
  )

  // find maintainer header
  await screen.findByRole('heading',{name: '403'})
})

