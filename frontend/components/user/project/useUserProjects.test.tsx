// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import useUserProjects from './useUserProjects'
import projectsByMaintainer from './__mocks__/projectsByMaintainer.json'


function WithUserProjectsHook() {
  const {loading, projects} = useUserProjects({
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
      {JSON.stringify(projects,null,2)}
    </div>
  )
}

beforeEach(() => {
  // reset mock counters
  jest.clearAllMocks()
})


it('shows loader', () => {
  render(
    <WithUserProjectsHook />
  )
  screen.getByText('Loading...')
  // screen.debug()
})

it('resolves no projects', async() => {

  mockResolvedValueOnce([])

  render(
    <WithAppContext options={{session:mockSession}}>
      <WithUserProjectsHook />
    </WithAppContext>
  )
  await screen.findByText('[]')
})

it('resolves projects', async() => {

  mockResolvedValueOnce(projectsByMaintainer)

  render(
    <WithAppContext options={{session:mockSession}}>
      <WithUserProjectsHook />
    </WithAppContext>
  )
  await screen.findByText(RegExp(projectsByMaintainer[0].id))
})

