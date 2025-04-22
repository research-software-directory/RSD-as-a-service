// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import useUserCommunities from './useUserCommunities'
import communitiesByMaintainer from './__mocks__/communitiesByMaintainer.json'


function WithUserCommunitiesHook() {
  const {loading, communities} = useUserCommunities({
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
      {JSON.stringify(communities,null,2)}
    </div>
  )
}

beforeEach(() => {
  // reset mock counters
  jest.clearAllMocks()
})


it('shows loader', () => {
  render(
    <WithUserCommunitiesHook />
  )
  screen.getByText('Loading...')
  // screen.debug()
})

it('resolves no communities', async() => {

  mockResolvedValueOnce([])

  render(
    <WithAppContext options={{session:mockSession}}>
      <WithUserCommunitiesHook />
    </WithAppContext>
  )
  await screen.findByText('[]')
})

it('resolves communities', async() => {

  mockResolvedValueOnce(communitiesByMaintainer)

  render(
    <WithAppContext options={{session:mockSession}}>
      <WithUserCommunitiesHook />
    </WithAppContext>
  )
  await screen.findByText(RegExp(communitiesByMaintainer[0].id))
})

