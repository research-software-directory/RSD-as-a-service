// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import useUserOrganisations from './useUserOrganisations'
import organisationsByMaintainer from './__mocks__/organisationsByMaintainer.json'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'


function WithUserOrganisationsHook() {
  const {loading, organisations} = useUserOrganisations({
    page:0,
    rows:12
  })

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
    <WithUserOrganisationsHook />
  )
  screen.getByText('Loading...')
  // screen.debug()
})

it('resolves no organisations', async() => {

  mockResolvedValueOnce([])

  render(
    <WithAppContext options={{session:mockSession}}>
      <WithUserOrganisationsHook />
    </WithAppContext>
  )

  await screen.findByText('[]')
})


it('resolves organisations', async() => {

  mockResolvedValueOnce(organisationsByMaintainer)

  render(
    <WithAppContext options={{session:mockSession}}>
      <WithUserOrganisationsHook />
    </WithAppContext>
  )
  await screen.findByText(RegExp(organisationsByMaintainer[0].id))
})

