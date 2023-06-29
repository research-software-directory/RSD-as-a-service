// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import OrganisationPage from '../pages/organisations/[...slug]'

// MOCKS
import mockRORIinfo from './__mocks__/apiRORInfo.json'
import mockOrganisation from '~/components/organisation/__mocks__/mockOrganisation'
import mockSoftware from '~/components/organisation/software/__mocks__/mockSoftware.json'
import mockProjects from '~/components/organisation/projects/__mocks__/mockProjects.json'
import mockUnits from '~/components/organisation/units/__mocks__/mockUnits.json'
import {TabKey} from '~/components/organisation/tabs/OrganisationTabItems'

// MOCK user agreement call
jest.mock('~/components/user/settings/fetchAgreementStatus')

const mockProps = {
  organisation: mockOrganisation,
  slug:['dutch-research-council'],
  tab: 'software' as TabKey,
  ror: mockRORIinfo as any,
  isMaintainer: false
}
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

// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
jest.mock('~/auth/api/useLoginProviders')

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
    expect(mockSoftwareForOrganisation).toBeCalledTimes(1)
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
    expect(mockProjectsForOrganisation).toBeCalledTimes(1)
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
    expect(mockGetOrganisationChildren).toBeCalledTimes(1)
    // validate units
    const units = screen.getAllByTestId('research-unit-item')
    expect(units.length).toEqual(mockUnits.length)
  })
})
