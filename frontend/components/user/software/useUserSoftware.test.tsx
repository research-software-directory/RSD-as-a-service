// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import useUserSoftware from './useUserSoftware'
import softwareByMaintainer from './__mocks__/softwareByMaintainer.json'


function WithUserSoftwareHook() {
  const {loading, software} = useUserSoftware({
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
      {JSON.stringify(software,null,2)}
    </div>
  )
}

beforeEach(() => {
  // reset mock counters
  jest.clearAllMocks()
})


it('shows loader', () => {
  render(
    <WithUserSoftwareHook />
  )
  screen.getByText('Loading...')
  // screen.debug()
})

it('resolves no software', async() => {

  mockResolvedValueOnce([])

  render(
    <WithAppContext options={{session:mockSession}}>
      <WithUserSoftwareHook />
    </WithAppContext>
  )
  await screen.findByText('[]')
})

it('resolves software', async() => {

  mockResolvedValueOnce(softwareByMaintainer)

  render(
    <WithAppContext options={{session:mockSession}}>
      <WithUserSoftwareHook />
    </WithAppContext>
  )
  await screen.findByText(RegExp(softwareByMaintainer[0].id))
})

