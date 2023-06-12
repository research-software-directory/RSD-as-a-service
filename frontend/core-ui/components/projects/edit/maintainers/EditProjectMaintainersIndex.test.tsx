// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import ProjectMaintainers from './index'
import editProjectState from '../__mocks__/editProjectState'

// MOCKS
const mockGetUnusedInvitations=jest.fn(props=>Promise.resolve([]))
jest.mock('~/utils/getUnusedInvitations', () => ({
  getUnusedInvitations: jest.fn(props=>mockGetUnusedInvitations(props))
}))


describe('frontend/components/projects/edit/maintainers/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders no maintainers', async() => {
    // mock no maintainers
    mockResolvedValueOnce([])

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectMaintainers />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // shows no maintainers message
    const noMaintainers = screen.getByText('No maintainers')
    expect(noMaintainers).toBeInTheDocument()
  })
})
