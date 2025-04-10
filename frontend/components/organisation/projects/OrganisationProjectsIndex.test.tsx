// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'

import OrganisationProjects from './index'
import mockOrganisation from '../__mocks__/mockOrganisation'
import mockProjects from './__mocks__/mockProjects.json'

// mock user agreement call
jest.mock('~/components/user/settings/agreements/useUserAgreements')
// mock project categories api
jest.mock('~/components/organisation/projects/filters/useOrgProjectCategoriesList')

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

// MOCK getProjectsForOrganisation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseOrganisationProjects = jest.fn((props) => ({
  loading: false,
  count: 0,
  projects: []
}))
jest.mock('~/components/organisation/projects/useOrganisationProjects', () => ({
  __esModule: true,
  default: jest.fn((props)=>mockUseOrganisationProjects(props))
}))

// MOCK patchProjectForOrganisation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchProjectForOrganisation = jest.fn((props) => Promise.resolve({
  status: 200,
  statusText: 'OK'
}))
jest.mock('~/utils/editProject', () => ({
  patchProjectForOrganisation: jest.fn((props)=>mockPatchProjectForOrganisation(props))
}))

// MOCK project filters - use default mocks
jest.mock('~/components/organisation/projects/filters/useOrgProjectDomainsList')
jest.mock('~/components/organisation/projects/filters/useOrgProjectKeywordsList')
jest.mock('~/components/organisation/projects/filters/useOrgProjectOrganisationsList')
jest.mock('~/components/organisation/projects/filters/useOrgProjectStatusList')


describe('frontend/components/organisation/projects/index.tsx', () => {
  beforeEach(() => {
    // reset mock counters
    jest.clearAllMocks()
  })

  it('shows no items icon when no data', async() => {
    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          <OrganisationProjects />
        </WithOrganisationContext>
      </WithAppContext>
    )

    const icon = screen.getByTestId('DoDisturbIcon')
    expect(icon).toBeInTheDocument()
  })

  it('shows project cards', async() => {
    mockUseOrganisationProjects.mockReturnValueOnce({
      loading: false,
      count: mockProjects.length,
      projects: mockProjects as any
    })
    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          <OrganisationProjects />
        </WithOrganisationContext>
      </WithAppContext>
    )

    const projects = screen.getAllByTestId('project-grid-card')
    expect(projects.length).toEqual(mockProjects.length)
  })

  it('shows project cards with menu', async () => {
    mockProps.isMaintainer=true
    mockUseOrganisationProjects.mockReturnValueOnce({
      loading: false,
      count: mockProjects.length,
      projects: mockProjects as any
    })

    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          <OrganisationProjects />
        </WithOrganisationContext>
      </WithAppContext>
    )

    // get menu icons
    const moreIcon = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcon.length).toEqual(mockProjects.length)
  })

  it('maintainer can PIN project', async () => {
    mockProps.isMaintainer=true
    mockUseOrganisationProjects.mockReturnValueOnce({
      loading: false,
      count: mockProjects.length,
      projects: mockProjects as any
    })

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationProjects />
        </WithOrganisationContext>
      </WithAppContext>
    )

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockProjects.length)

    // select action on first project
    fireEvent.click(moreIcons[0])

    // select pin project menu option
    const pinBtn = screen.getByRole('menuitem', {
      name: 'Pin project'
    })
    // pin first project
    fireEvent.click(pinBtn)

    // validate patchProject fn is called with expected params
    expect(mockPatchProjectForOrganisation).toHaveBeenCalledTimes(1)
    expect(mockPatchProjectForOrganisation).toHaveBeenCalledWith({
      'data': {
        'is_featured': true,
      },
      'organisation': mockProps.organisation.id,
      'project': mockProjects[0].id,
      'token': mockSession.token,
    })
  })

  it('maintainer can UNPIN project', async () => {
    mockProps.isMaintainer = true
    mockProjects[0].is_featured = true
    mockUseOrganisationProjects.mockReturnValueOnce({
      loading: false,
      count: mockProjects.length,
      projects: mockProjects as any
    })

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationProjects />
        </WithOrganisationContext>
      </WithAppContext>
    )
    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockProjects.length)

    // select action on first project
    fireEvent.click(moreIcons[0])

    // select pin project menu option
    const pinBtn = screen.getByRole('menuitem', {
      name: 'Unpin project'
    })
    // pin first project
    fireEvent.click(pinBtn)

    // validate patchProject fn is called with expected params
    expect(mockPatchProjectForOrganisation).toHaveBeenCalledTimes(1)
    expect(mockPatchProjectForOrganisation).toHaveBeenCalledWith({
      'data': {
        'is_featured': false,
      },
      'organisation': mockProps.organisation.id,
      'project': mockProjects[0].id,
      'token': mockSession.token,
    })
  })

  it('maintainer can DENY project affiliation', async () => {
    mockProps.isMaintainer=true
    mockUseOrganisationProjects.mockReturnValueOnce({
      loading: false,
      count: mockProjects.length,
      projects: mockProjects as any
    })

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationProjects />
        </WithOrganisationContext>
      </WithAppContext>
    )

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockProjects.length)

    // select action on second project
    fireEvent.click(moreIcons[1])

    // select deny project menu option
    const actionBtn = screen.getByRole('menuitem', {
      name: 'Block affiliation'
    })
    // deny second project
    fireEvent.click(actionBtn)

    // validate patchProject fn is called with expected params
    expect(mockPatchProjectForOrganisation).toHaveBeenCalledTimes(1)
    expect(mockPatchProjectForOrganisation).toHaveBeenCalledWith({
      'data': {
        'status': 'rejected_by_relation'
      },
      'organisation': mockProps.organisation.id,
      'project': mockProjects[1].id,
      'token': mockSession.token,
    })
  })

  it('maintainer can ALLOW project affiliation', async () => {
    mockProps.isMaintainer = true
    mockProjects[1].status = 'rejected_by_relation'
    mockUseOrganisationProjects.mockReturnValueOnce({
      loading: false,
      count: mockProjects.length,
      projects: mockProjects as any
    })

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationProjects />
        </WithOrganisationContext>
      </WithAppContext>
    )

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockProjects.length)

    // select action on second project
    fireEvent.click(moreIcons[1])

    // select approve project menu option
    const actionBtn = screen.getByRole('menuitem', {
      name: 'Allow affiliation'
    })
    // approve second project
    fireEvent.click(actionBtn)

    // validate patchProject fn is called with expected params
    expect(mockPatchProjectForOrganisation).toHaveBeenCalledTimes(1)
    expect(mockPatchProjectForOrganisation).toHaveBeenCalledWith({
      'data': {
        'status': 'approved'
      },
      'organisation': mockProps.organisation.id,
      'project': mockProjects[1].id,
      'token': mockSession.token,
    })
  })

})
