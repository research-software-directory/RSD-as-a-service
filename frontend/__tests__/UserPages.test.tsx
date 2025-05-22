// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession, defaultUserSettings} from '~/utils/jest/WithAppContext'

import UserPages from '../pages/user/[section]'

import mockSoftwareByMaintainer from '~/components/user/software/__mocks__/softwareByMaintainer.json'
import mockProjectsByMaintainer from '~/components/user/project/__mocks__/projectsByMaintainer.json'
import mockOrganisationsByMaintainer from '~/components/user/organisations/__mocks__/organisationsByMaintainer.json'
import mockCommunitiesByMaintainer from '~/components/user/communities/__mocks__/communitiesByMaintainer.json'
import loginForAccount from '~/components/user/settings/profile/__mocks__/logins.json'
import {UserPageId} from '~/components/user/tabs/UserTabItems'
import {getDisplayName} from '~/utils/getDisplayName'
import {LoginForAccount} from '~/components/user/settings/profile/apiLoginForAccount'
// import {UserPageId} from '~/components/user/UserNavItems'
// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
jest.mock('~/auth/api/useLoginProviders')
// mock user agreement call
jest.mock('~/components/user/settings/agreements/useUserAgreements')
// MOCK user logins call
jest.mock('~/components/user/settings/profile/useLoginForUser')
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
  linkedInAuthLink: null,
  profile:{
    account: 'test-account-id',
    given_names: 'Test given names',
    family_names: 'Test family names',
    email_address: null,
    role: null,
    affiliation: null,
    is_public: false,
    avatar_id: null
  },
  logins:loginForAccount as LoginForAccount[]
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

  it('renders user name', () => {
    mockProps.section = 'software'
    const userName = getDisplayName(mockProps.profile) ?? 'No name'
    render(
      <WithAppContext options={{session:mockSession}}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    screen.getByText(RegExp(userName))
    // expect(navItems.length).toEqual(5)
  })

  it('renders user settings with User profile heading', async() => {
    mockProps.section = 'settings'
    render(
      <WithAppContext options={{session:mockSession}}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )
    // settings page
    await screen.findByTestId('user-profile-page-title')
    // await screen.findByRole('heading',{name:'User profile'})
    // shows user account
    if (mockSession.user?.account) {
      screen.getByText(RegExp(mockSession.user?.account))
    }
  })

  it('renders user software list items', async() => {
    mockProps.section = 'software'
    defaultUserSettings.rsd_page_layout = 'list'
    render(
      <WithAppContext options={{session:mockSession, user:defaultUserSettings}}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate software cards are shown
    const software = await screen.findAllByTestId('software-list-item')
    expect(software.length).toEqual(mockSoftwareByMaintainer.length)
  })

  it('renders user software grid items', async() => {
    mockProps.section = 'software'
    defaultUserSettings.rsd_page_layout = 'grid'
    render(
      <WithAppContext options={{
        session:mockSession,
        user:defaultUserSettings
      }}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate software cards are shown
    const software = await screen.findAllByTestId('software-grid-card')
    expect(software.length).toEqual(mockSoftwareByMaintainer.length)
  })


  it('renders user projects list items', async() => {
    mockProps.section = 'projects'
    defaultUserSettings.rsd_page_layout = 'list'
    render(
      <WithAppContext options={{
        session:mockSession,
        user:defaultUserSettings
      }}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate project cards are shown
    const project = await screen.findAllByTestId('project-list-item')
    expect(project.length).toEqual(mockProjectsByMaintainer.length)
  })

  it('renders user projects grid items', async() => {
    mockProps.section = 'projects'
    defaultUserSettings.rsd_page_layout = 'grid'
    render(
      <WithAppContext options={{session:mockSession}}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate project cards are shown
    const project = await screen.findAllByTestId('project-grid-card')
    expect(project.length).toEqual(mockProjectsByMaintainer.length)
  })

  it('renders user organisations list items', async() => {
    mockProps.section = 'organisations'
    defaultUserSettings.rsd_page_layout = 'list'

    render(
      <WithAppContext options={{
        session:mockSession,
        user: defaultUserSettings
      }}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate project cards are shown
    const project = await screen.findAllByTestId('organisation-list-item')
    expect(project.length).toEqual(mockOrganisationsByMaintainer.length)
  })

  it('renders user organisations grid items', async() => {
    mockProps.section = 'organisations'
    defaultUserSettings.rsd_page_layout = 'grid'

    render(
      <WithAppContext options={{
        session:mockSession,
        user: defaultUserSettings
      }}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate project cards are shown
    const project = await screen.findAllByTestId('organisation-card-link')
    expect(project.length).toEqual(mockOrganisationsByMaintainer.length)
  })

  it('renders user communities list items', async() => {
    mockProps.section = 'communities'
    defaultUserSettings.rsd_page_layout = 'list'

    render(
      <WithAppContext options={{
        session:mockSession,
        user: defaultUserSettings
      }}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate community cards are shown
    const project = await screen.findAllByTestId('community-list-item')
    expect(project.length).toEqual(mockCommunitiesByMaintainer.length)
  })

  it('renders user communities card items', async() => {
    mockProps.section = 'communities'
    defaultUserSettings.rsd_page_layout = 'grid'

    render(
      <WithAppContext options={{
        session:mockSession,
        user: defaultUserSettings
      }}>
        <UserPages {...mockProps} />
      </WithAppContext>
    )

    // validate community cards are shown
    const project = await screen.findAllByTestId('community-card-link')
    expect(project.length).toEqual(mockCommunitiesByMaintainer.length)
  })

})
