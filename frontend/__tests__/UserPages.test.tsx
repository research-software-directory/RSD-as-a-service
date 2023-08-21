// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import UserPages from '../pages/user/[section]'

import mockSoftwareByMaintainer from '~/components/user/software/__mocks__/softwareByMaintainer.json'
import mockProjectsByMaintainer from '~/components/user/project/__mocks__/projectsByMaintainer.json'

// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
jest.mock('~/auth/api/useLoginProviders')
// MOCK user agreement call
jest.mock('~/components/user/settings/fetchAgreementStatus')
// MOCK user project list
jest.mock('~/components/user/project/useUserProjects')
// MOCK user software list
jest.mock('~/components/user/software/useUserSoftware')

// MOCKS
const mockProps = {
  section: 'software',
  counts: {
    software_cnt: 0,
    project_cnt: 0,
    organisation_cnt: 0
  }
}

describe('pages/user/[section].tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders 401 when not loged in', () => {
    render(
      <WithAppContext>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    const p401 = screen.getByRole('heading', {
      name:'401'
    })
    expect(p401).toBeInTheDocument()
  })

  it('renders user nav items', () => {
    mockProps.section = 'software'
    render(
      <WithAppContext options={{session:mockSession}}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    const navItems = screen.getAllByTestId('user-nav-item')
    expect(navItems.length).toEqual(5)
  })

  it('renders user settings section', async() => {
    mockProps.section = 'settings'
    render(
      <WithAppContext options={{session:mockSession}}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // settings page
    const settings = await screen.findByTestId('user-settings-section')
    // shows user account
    if (mockSession.user?.account) {
      const userId = screen.getByText(RegExp(mockSession.user?.account))
    }
  })

  it('renders user software section', async() => {
    mockProps.section = 'software'

    render(
      <WithAppContext options={{session:mockSession}}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate software cards are shown
    const software = screen.getAllByTestId('software-card-link')
    expect(software.length).toEqual(mockSoftwareByMaintainer.length)
  })

  it('renders user projects section', async() => {
    mockProps.section = 'projects'

    render(
      <WithAppContext options={{session:mockSession}}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate project cards are shown
    const project = screen.getAllByTestId('project-card-link')
    expect(project.length).toEqual(mockProjectsByMaintainer.length)
  })

})
