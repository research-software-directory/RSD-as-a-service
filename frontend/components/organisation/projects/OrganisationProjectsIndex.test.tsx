// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

/**
 * DEFAULT MOCKS NEED to be imported before "real" imports
 * DEFAULT MOCKS should return jest.fn() with default results
 * THIS MAKES possible to overwrite default mock with import (after mock import)
 */
// MOCK getUserSettings
jest.mock('~/components/user/ssrUserSettings')
// MOCK getActiveModuleNames
jest.mock('~/config/getSettingsServerSide')
// MOCK isOrganisationMaintainer
jest.mock('~/auth/permissions/isMaintainerOfOrganisation')
// MOCK getOrganisationIdForSlug,getProjectsForOrganisation
jest.mock('~/components/organisation/apiOrganisations')
// MOCK patchProjectForOrganisation
jest.mock('~/components/projects/edit/apiEditProject')

import {fireEvent, render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'
import OrganisationProjects from './index'

import mockOrganisation from '../__mocks__/mockOrganisation'
import mockProjects from './__mocks__/mockProjects.json'
// import MOCKS to return custom values
import {isOrganisationMaintainer} from '~/auth/permissions/isMaintainerOfOrganisation'
import {getProjectsForOrganisation} from '~/components/organisation/apiOrganisations'
const mockGetProjectsForOrganisation = getProjectsForOrganisation as jest.Mock
import {patchProjectForOrganisation} from '~/components/projects/edit/apiEditProject'
const mockPatchProjectForOrganisation = patchProjectForOrganisation as jest.Mock

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

describe('frontend/components/organisation/projects/index.tsx', () => {
  beforeEach(() => {
    // reset mock counters
    jest.clearAllMocks()
  })

  it('shows no items icon when no data', async() => {
    const ResolvedPage = await OrganisationProjects({slug:['test-project'],query:{}})
    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    const icon = screen.getByTestId('DoDisturbIcon')
    expect(icon).toBeInTheDocument()
  })

  it('shows project cards', async() => {
    // mock api response
    mockGetProjectsForOrganisation.mockResolvedValueOnce({
      count: mockProjects.length,
      data: mockProjects as any
    })

    const ResolvedPage = await OrganisationProjects({slug:['test-project'],query:{}})

    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    const projects = await screen.findAllByTestId('project-grid-card')
    expect(projects.length).toEqual(mockProjects.length)
  })

  it('shows project cards with menu', async () => {
    // mock response to true
    (isOrganisationMaintainer as jest.Mock).mockResolvedValueOnce(true)

    mockGetProjectsForOrganisation.mockResolvedValueOnce({
      count: mockProjects.length,
      data: mockProjects as any
    })

    const ResolvedPage = await OrganisationProjects({slug:['test-project'],query:{}})

    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    // get menu icons
    const moreIcon = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcon.length).toEqual(mockProjects.length)
  })

  it('maintainer can PIN project', async () => {
    // mock response to true
    (isOrganisationMaintainer as jest.Mock).mockResolvedValueOnce(true)

    mockGetProjectsForOrganisation.mockResolvedValueOnce({
      count: mockProjects.length,
      data: mockProjects as any
    })

    const ResolvedPage = await OrganisationProjects({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
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
    // mock response to true
    (isOrganisationMaintainer as jest.Mock).mockResolvedValueOnce(true)

    mockProjects[0].is_featured = true
    mockGetProjectsForOrganisation.mockResolvedValueOnce({
      count: mockProjects.length,
      data: mockProjects as any
    })

    const ResolvedPage = await OrganisationProjects({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
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
    // mock response to true
    (isOrganisationMaintainer as jest.Mock).mockResolvedValueOnce(true)

    mockProjects[0].is_featured = true
    mockGetProjectsForOrganisation.mockResolvedValueOnce({
      count: mockProjects.length,
      data: mockProjects as any
    })

    const ResolvedPage = await OrganisationProjects({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
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
    // mock response to true
    (isOrganisationMaintainer as jest.Mock).mockResolvedValueOnce(true)

    mockProjects[1].status = 'rejected_by_relation'
    mockGetProjectsForOrganisation.mockResolvedValueOnce({
      count: mockProjects.length,
      data: mockProjects as any
    })

    const ResolvedPage = await OrganisationProjects({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
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
