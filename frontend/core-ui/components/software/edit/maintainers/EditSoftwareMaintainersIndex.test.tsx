// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import SoftwareMaintainers from './index'

// MOCKS
import {initialState as softwareState} from '~/components/software/edit/editSoftwareContext'

// MOCK getUnusedInvitations
const mockGetUnusedInvitations=jest.fn(props=>Promise.resolve([]))
jest.mock('~/utils/getUnusedInvitations', () => ({
  getUnusedInvitations: jest.fn(props=>mockGetUnusedInvitations(props))
}))

describe('frontend/components/software/edit/maintainers/index.tsx', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders no maintainers', async() => {
    // resolve no maintainers
    mockResolvedValueOnce([])

    // software id required for requests
    softwareState.software.id = 'software-test-id'

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMaintainers />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // validate no maintainers message
    const noMaintainersMsg = screen.getByText('No maintainers')
  })
})
