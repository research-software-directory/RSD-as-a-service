// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import UserPages from '../pages/user/[section]'

import mockSoftwareByMaintainer from '~/components/user/software/__mocks__/softwareByMaintainer.json'
import mockProjectsByMaintainer from '~/components/user/project/__mocks__/projectsByMaintainer.json'
import mockOrganisationsByMaintainer from '~/components/user/organisations/__mocks__/organisationsByMaintainer.json'
import mockCommunitiesByMaintainer from '~/components/user/communities/__mocks__/communitiesByMaintainer.json'
import {UserPageId} from '~/components/user/UserNavItems'
// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
jest.mock('~/auth/api/useLoginProviders')
// MOCK user agreement call
jest.mock('~/components/user/settings/useUserAgreements')
// MOCK user logins call
jest.mock('~/components/user/settings/useLoginForAccount')
// MOCK user project list
jest.mock('~/components/user/project/useUserProjects')
// MOCK user software list
jest.mock('~/components/user/software/useUserSoftware')
// MOCK user organisation list
jest.mock('~/components/user/organisations/useUserOrganisations')
// MOCK user communities list
jest.mock('~/components/user/communities/useUserCommunities')
// MOCK global search
jest.mock('~/components/GlobalSearchAutocomplete/apiGlobalSearch')
jest.mock('~/components/GlobalSearchAutocomplete/useHasRemotes')

// MOCKS
const mockProps = {
  section: 'software' as UserPageId,
  counts: {
    software_cnt: 0,
    project_cnt: 0,
    organisation_cnt: 0,
    community_cnt: 0
  },
  orcidAuthLink:null,
  rsd_page_rows: 12,
  showSearch: false
}

describe('pages/user/[section].tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders 401 when not logged in', () => {
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
    const software = await screen.findAllByTestId('software-list-item')
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
    const project = await screen.findAllByTestId('project-list-item')
    expect(project.length).toEqual(mockProjectsByMaintainer.length)
  })

  it('renders user organisation section', async() => {
    mockProps.section = 'organisations'

    render(
      <WithAppContext options={{session:mockSession}}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate project cards are shown
    const project = await screen.findAllByTestId('organisation-list-item')
    expect(project.length).toEqual(mockOrganisationsByMaintainer.length)
  })

  it('renders user communities section', async() => {
    mockProps.section = 'communities'

    render(
      <WithAppContext options={{session:mockSession}}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate community cards are shown
    const project = await screen.findAllByTestId('community-list-item')
    expect(project.length).toEqual(mockCommunitiesByMaintainer.length)
  })

})
