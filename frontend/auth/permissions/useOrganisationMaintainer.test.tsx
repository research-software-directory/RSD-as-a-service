// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import useOrganisationMaintainer from './useOrganisationMaintainer'
import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'
import {defaultSession} from '..'

const mockData = {
  organisation: 'test-organisation-id',
  account: 'test-account-id',
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

  // console.log('2.isMaintainer...', isMaintainer)

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

it('returns isMaintainer=true for rsd_admin', async () => {
  // set authenticated props
  defaultSession.status = 'authenticated'
  defaultSession.token = mockData.token
  defaultSession.user = {
    iss: 'rsd_auth',
    role: 'rsd_admin',
    exp: 11111111,
    account: 'test-account',
    name: 'John Doe'
  }

  // return response to getMaintainerOrganisations
  mockResolvedValueOnce([mockData.organisation])

  // render with basic privilegies
  render(WrappedComponentWithProps(WrappedHook, {
    session:defaultSession
  }))

  // check if maintainer
  const content = await screen.findByText('IS MAINTAINER')
  expect(content).toBeInTheDocument()
})

// THIS DOES NOT WORK PROPERLY!
// it('returns isMaintainer=true when user is maintainer', async () => {
//   // set authenticated props
//   defaultSession.status = 'authenticated'
//   defaultSession.token = mockData.token
//   defaultSession.user = {
//     iss: 'rsd_auth',
//     role: 'rsd_user',
//     exp: 11111111,
//     account: 'test-account',
//     name: 'John Doe'
//   }

//   // return response to getMaintainerOrganisations
//   mockResolvedValueOnce([mockData.organisation])

//   // render with basic privilegies
//   render(WrappedComponentWithProps(WrappedHook, {
//     session:defaultSession
//   }))

//   expect(global.fetch).toBeCalledTimes(1)
//   // expect(global.fetch).toBeCalledWith({})

//   // check if maintainer
//   const content = await screen.findByText('IS MAINTAINER')
//   expect(content).toBeInTheDocument()
// })
