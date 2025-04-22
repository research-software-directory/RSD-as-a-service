// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import OrganisationPage, {OrganisationPageProps} from '../pages/organisations/[...slug]'

// MOCKS
import mockRORIinfo from './__mocks__/apiRORInfo.json'
import mockOrganisation from '~/components/organisation/__mocks__/mockOrganisation'
import mockSoftware from '~/components/organisation/software/__mocks__/mockSoftware.json'
import mockProjects from '~/components/organisation/projects/__mocks__/mockProjects.json'
import mockUnits from '~/components/organisation/units/__mocks__/mockUnits.json'
import {TabKey} from '~/components/organisation/tabs/OrganisationTabItems'
import {OrganisationForContext} from '~/components/organisation/context/OrganisationContext'

// mock user agreement call
jest.mock('~/components/user/settings/agreements/useUserAgreements')
// global search
jest.mock('~/components/GlobalSearchAutocomplete/apiGlobalSearch')
jest.mock('~/components/GlobalSearchAutocomplete/useHasRemotes')

// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
jest.mock('~/auth/api/useLoginProviders')
// mock project categories api
jest.mock('~/components/organisation/projects/filters/useOrgProjectCategoriesList')
// mock software categories api
jest.mock('~/components/organisation/software/filters/useOrgSoftwareCategoriesList')

const mockProps = {
  organisation: mockOrganisation as OrganisationForContext,
  slug:['dutch-research-council'],
  tab: 'software' as TabKey,
  ror: mockRORIinfo as any,
  isMaintainer: false,
  rsd_page_rows: 12,
  rsd_page_layout: 'grid',
  units: mockUnits,
  releaseCountsByYear: [],
  releases: []
} as OrganisationPageProps

// MOCK isMaintainerOfOrganisation
const mockIsMaintainerOfOrganisation = jest.fn((props) => {
  // console.log('mockIsMaintainerOfOrganisation...', props)
  return Promise.resolve(true)
})
jest.mock('~/auth/permissions/isMaintainerOfOrganisation', () => {
  // console.log('isMaintainerOfOrganisation...MOCK')
  return {
    __esModule: true,
    default: jest.fn(props=>mockIsMaintainerOfOrganisation(props))
  }
})
// MOCK getSoftwareForOrganisation
const mockSoftwareForOrganisation = jest.fn((props) => Promise.resolve({
  status: 206,
  count: 0,
  data: []
}))
// MOCK software filters - use default mocks
jest.mock('~/components/organisation/software/filters/useOrgSoftwareKeywordsList')
jest.mock('~/components/organisation/software/filters/useOrgSoftwareLanguagesList')
jest.mock('~/components/organisation/software/filters/useOrgSoftwareLicensesList')

// MOCK getProjectsForOrganisation
const mockProjectsForOrganisation = jest.fn((props) => Promise.resolve({
  status: 206,
  count: 0,
  data: []
}))
// MOCK getOrganisationChildren
const mockGetOrganisationChildren = jest.fn((props) => Promise.resolve([]))
jest.mock('~/components/organisation/apiOrganisations', () => ({
  getSoftwareForOrganisation: jest.fn((props) => mockSoftwareForOrganisation(props)),
  getProjectsForOrganisation: jest.fn((props) => mockProjectsForOrganisation(props)),
  getOrganisationChildren: jest.fn((props)=>mockGetOrganisationChildren(props))
}))

// MOCK project filters - use default mocks
jest.mock('~/components/organisation/projects/filters/useOrgProjectDomainsList')
jest.mock('~/components/organisation/projects/filters/useOrgProjectKeywordsList')
jest.mock('~/components/organisation/projects/filters/useOrgProjectOrganisationsList')
jest.mock('~/components/organisation/projects/filters/useOrgProjectStatusList')


describe('pages/organisations/[...slug].tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders organisation about page', async () => {
    // not a maintainer - public page
    mockIsMaintainerOfOrganisation.mockResolvedValueOnce(false)
    // has description
    const mockDescription = 'This is test content of about page'
    mockProps.organisation.description = mockDescription
    mockProps.tab = 'about'
    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationPage {...mockProps} />
      </WithAppContext>
    )
    // wait loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // validate content
    const aboutContent = screen.getByText(mockDescription)
    expect(aboutContent).toBeInTheDocument()
    // screen.debug(aboutPage)
  })

  it('renders organisation software page as default when organisation.description=null', async () => {
    // not a maintainer - public page
    mockIsMaintainerOfOrganisation.mockResolvedValueOnce(false)
    // when no about page content, software is default landing page
    mockProps.organisation.description = null
    mockProps.tab = null
    // mockProps.tab = 'software'
    // mock software list response
    mockSoftwareForOrganisation.mockResolvedValue({
      status: 206,
      count: mockSoftware.length,
      data: mockSoftware as any
    })
    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationPage {...mockProps} />
      </WithAppContext>
    )
    // wait loader to be removed
    // await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // we need to await for all events to run
    const software = await screen.findAllByTestId('software-grid-card')
    expect(software.length).toEqual(mockSoftware.length)
    // validate api call - TODO! FIGURE WHY IS CALLED TWICE!!!
    expect(mockSoftwareForOrganisation).toHaveBeenCalledTimes(1)
  })

  it('renders organisation projects page when page=projects', async () => {
    // not a maintainer - public page
    mockIsMaintainerOfOrganisation.mockResolvedValueOnce(false)
    // set page
    mockProps.tab='projects'
    // mock project list response
    mockProjectsForOrganisation.mockResolvedValue({
      status: 206,
      count: mockProjects.length,
      data: mockProjects as any
    })
    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationPage {...mockProps} />
      </WithAppContext>
    )
    // wait loader to be removed
    // await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // we need to await for all events to run
    // const projectsPage = screen.getByTestId('organisation-content-projects')
    // expect(projectsPage).toBeInTheDocument()
    // validate all cards shown by testId
    const cards = await screen.findAllByTestId('project-grid-card')
    expect(cards.length).toEqual(mockProjects.length)
    // validate api call - TODO! FIGURE WHY IS CALLED TWICE!!!
    expect(mockProjectsForOrganisation).toHaveBeenCalledTimes(1)
  })

  it('shows organisation units', async() => {
    // not a maintainer - public page
    mockIsMaintainerOfOrganisation.mockResolvedValueOnce(false)
    // set page
    mockProps.tab = 'units'
    // mock unit response
    mockGetOrganisationChildren.mockResolvedValueOnce(mockUnits as any)
    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationPage {...mockProps} />
      </WithAppContext>
    )
    // wait loader to be removed
    // await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // we need to await for all events to run
    // const unitsPage = screen.getByTestId('organisation-content-units')
    // expect(unitsPage).toBeInTheDocument()
    // wait projects section loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // validate api call
    expect(mockGetOrganisationChildren).toHaveBeenCalledTimes(0)
    // validate units
    const units = screen.getAllByTestId('research-unit-item')
    expect(units.length).toEqual(mockUnits.length)
  })
})
