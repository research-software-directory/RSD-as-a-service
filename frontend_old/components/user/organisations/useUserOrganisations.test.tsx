// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {mockSession} from '~/utils/jest/WithAppContext'

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import useUserOrganisations, {UserOrganisationProp} from './useUserOrganisations'
import organisationsByMaintainer from './__mocks__/organisationsByMaintainer.json'

const mockProps:UserOrganisationProp = {
  searchFor:'',
  page:0,
  rows:12,
  session: mockSession
}


function WithUserOrganisationsHook(props:UserOrganisationProp) {
  const {loading, organisations, count} = useUserOrganisations(props)

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      {JSON.stringify(organisations,null,2)}
    </div>
  )
}

beforeEach(() => {
  // reset mock counters
  jest.clearAllMocks()
})


it('shows loader', () => {
  render(
    <WithUserOrganisationsHook {...mockProps} />
  )
  const loadingMsg = screen.getByText('Loading...')
  // screen.debug()
})

it('resolves no organisations', async() => {

  mockResolvedValueOnce([])

  render(
    <WithUserOrganisationsHook {...mockProps} />
  )
  const emptyArray = await screen.findByText('[]')
})


it('resolves organisations', async() => {

  mockResolvedValueOnce(organisationsByMaintainer)

  render(
    <WithUserOrganisationsHook {...mockProps} />
  )
  const id = await screen.findByText(RegExp(organisationsByMaintainer[0].id))
})

