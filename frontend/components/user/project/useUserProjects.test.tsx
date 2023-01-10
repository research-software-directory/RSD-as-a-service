// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {mockSession} from '~/utils/jest/WithAppContext'

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import useUserProjects, {UserProjectsProp} from './useUserProjects'
import projectsByMaintainer from './__mocks__/projectsByMaintainer.json'

const mockProps:UserProjectsProp = {
  searchFor:'',
  page:0,
  rows:12,
  session: mockSession
}


function WithUserProjectsHook(props:UserProjectsProp) {
  const {loading, projects, count} = useUserProjects(props)

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
    <WithUserProjectsHook {...mockProps} />
  )
  const loadingMsg = screen.getByText('Loading...')
  // screen.debug()
})

it('resolves no projects', async() => {

  mockResolvedValueOnce([])

  render(
    <WithUserProjectsHook {...mockProps} />
  )
  const emptyArray = await screen.findByText('[]')
})

it('resolves projects', async() => {

  mockResolvedValueOnce(projectsByMaintainer)

  render(
    <WithUserProjectsHook {...mockProps} />
  )
  const id = await screen.findByText(RegExp(projectsByMaintainer[0].id))
})

