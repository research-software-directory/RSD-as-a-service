// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import OrganisationProjects from './index'
import mockOrganisation from '../__mocks__/mockOrganisation'
import mockProjects from './__mocks__/mockProjects.json'

// mock user agreement call
jest.mock('~/components/user/settings/fetchAgreementStatus')

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

// MOCK getProjectsForOrganisation
const mockProjectsForOrganisation = jest.fn((props) => Promise.resolve({
  status: 206,
  count: 0,
  data: []
}))
jest.mock('~/utils/getOrganisations', () => ({
  getProjectsForOrganisation: jest.fn((props)=>mockProjectsForOrganisation(props))
}))

// MOCK patchProjectForOrganisation
const mockPatchProjectForOrganisation = jest.fn((props) => Promise.resolve({
  status: 200,
  statusText: 'OK'
}))
jest.mock('~/utils/editProject', () => ({
  patchProjectForOrganisation: jest.fn((props)=>mockPatchProjectForOrganisation(props))
}))


describe('frontend/components/organisation/projects/index.tsx', () => {
  beforeEach(() => {
    // reset mock counters
    jest.clearAllMocks()
  })

  it('shows no items icon when no data', async() => {
    render(
      <WithAppContext>
        <OrganisationProjects {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const icon = screen.getByTestId('DoDisturbIcon')
    expect(icon).toBeInTheDocument()
  })

  it('shows project cards', async() => {
    mockProjectsForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockProjects.length,
      data: mockProjects as any
    })
    render(
      <WithAppContext>
        <OrganisationProjects {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const projects = screen.getAllByTestId('project-card-link')
    expect(projects.length).toEqual(mockProjects.length)
  })

  it('shows project cards with menu', async () => {
    mockProps.isMaintainer=true
    mockProjectsForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockProjects.length,
      data: mockProjects as any
    })

    render(
      <WithAppContext>
        <OrganisationProjects {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    //
    const projects = screen.getAllByTestId('project-card-link')
    expect(projects.length).toEqual(mockProjects.length)
    // get menu icons
    const moreIcon = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcon.length).toEqual(mockProjects.length)
  })

  it('maintainer can PIN project', async () => {
    mockProps.isMaintainer=true
    mockProjectsForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockProjects.length,
      data: mockProjects as any
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationProjects {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
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
    expect(mockPatchProjectForOrganisation).toBeCalledTimes(1)
    expect(mockPatchProjectForOrganisation).toBeCalledWith({
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
    mockProjectsForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockProjects.length,
      data: mockProjects as any
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationProjects {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
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
    expect(mockPatchProjectForOrganisation).toBeCalledTimes(1)
    expect(mockPatchProjectForOrganisation).toBeCalledWith({
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
    mockProjectsForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockProjects.length,
      data: mockProjects as any
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationProjects {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockProjects.length)

    // select action on second project
    fireEvent.click(moreIcons[1])

    // select deny project menu option
    const actionBtn = screen.getByRole('menuitem', {
      name: 'Deny affiliation'
    })
    // deny second project
    fireEvent.click(actionBtn)

    // validate patchProject fn is called with expected params
    expect(mockPatchProjectForOrganisation).toBeCalledTimes(1)
    expect(mockPatchProjectForOrganisation).toBeCalledWith({
       'data': {
         'status': 'rejected_by_relation'
       },
       'organisation': mockProps.organisation.id,
       'project': mockProjects[1].id,
       'token': mockSession.token,
    })
  })

  it('maintainer can APPROVE denied project affiliation', async () => {
    mockProps.isMaintainer = true
    mockProjects[1].status = 'rejected_by_relation'
    mockProjectsForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockProjects.length,
      data: mockProjects as any
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationProjects {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockProjects.length)

    // select action on second project
    fireEvent.click(moreIcons[1])

    // select approve project menu option
    const actionBtn = screen.getByRole('menuitem', {
      name: 'Approve affiliation'
    })
    // approve second project
    fireEvent.click(actionBtn)

    // validate patchProject fn is called with expected params
    expect(mockPatchProjectForOrganisation).toBeCalledTimes(1)
    expect(mockPatchProjectForOrganisation).toBeCalledWith({
       'data': {
         'status': 'approved'
       },
       'organisation': mockProps.organisation.id,
       'project': mockProjects[1].id,
       'token': mockSession.token,
    })
  })

})
