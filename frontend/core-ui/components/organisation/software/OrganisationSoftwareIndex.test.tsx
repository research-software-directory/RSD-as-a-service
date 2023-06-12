// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import OrganisationSoftware from './index'
import mockOrganisation from '../__mocks__/mockOrganisation'
import mockSoftware from './__mocks__/mockSoftware.json'


const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

// MOCK getSoftwareForOrganisation
const mockSoftwareForOrganisation = jest.fn((props) => Promise.resolve({
  status: 206,
  count: 0,
  data: []
}))
jest.mock('~/utils/getOrganisations', () => ({
  getSoftwareForOrganisation: jest.fn((props)=>mockSoftwareForOrganisation(props))
}))

// MOCK patchSoftwareForOrganisation
const mockPatchSoftwareForOrganisation = jest.fn((props) => Promise.resolve({
  status: 200,
  statusText: 'OK'
}))
jest.mock('./patchSoftwareForOrganisation', () => ({
  patchSoftwareForOrganisation: jest.fn((props)=>mockPatchSoftwareForOrganisation(props))
}))

describe('frontend/components/organisation/software/index.tsx', () => {
  beforeEach(() => {
    // reset mock counters
    jest.clearAllMocks()
  })

  it('shows no items icon when no data', async() => {
    render(
      <WithAppContext>
        <OrganisationSoftware {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const icon = screen.getByTestId('DoDisturbIcon')
    expect(icon).toBeInTheDocument()
  })

  it('shows software cards', async() => {
    mockSoftwareForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockSoftware.length,
      data: mockSoftware as any
    })
    render(
      <WithAppContext>
        <OrganisationSoftware {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const projects = screen.getAllByTestId('software-card-link')
    expect(projects.length).toEqual(mockSoftware.length)
  })

  it('shows software cards with menu when isMaintainer=true', async () => {
    mockProps.isMaintainer=true
    mockSoftwareForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockSoftware.length,
      data: mockSoftware as any
    })
    render(
      <WithAppContext>
        <OrganisationSoftware {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockSoftware.length)
  })

  it('maintainer can PIN software', async () => {
    mockProps.isMaintainer=true
    mockSoftwareForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockSoftware.length,
      data: mockSoftware as any
    })
    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationSoftware {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockSoftware.length)

    // select action on first software
    fireEvent.click(moreIcons[0])

    // select pin software menu option
    const pinBtn = screen.getByRole('menuitem', {
      name: 'Pin software'
    })
    // pin first software
    fireEvent.click(pinBtn)

    // validate patchSoftware fn is called with expected params
    expect(mockPatchSoftwareForOrganisation).toBeCalledTimes(1)
    expect(mockPatchSoftwareForOrganisation).toBeCalledWith({
        'data': {
          'is_featured': true,
        },
        'organisation': mockProps.organisation.id,
        'software': mockSoftware[0].id,
        'token': mockSession.token,
    })
  })

  it('maintainer can UNPIN pinned software', async () => {
    mockProps.isMaintainer = true
    mockSoftware[0].is_featured = true
    mockSoftwareForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockSoftware.length,
      data: mockSoftware as any
    })
    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationSoftware {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockSoftware.length)

    // select action on first software
    fireEvent.click(moreIcons[0])

    // select pin software menu option
    const pinBtn = screen.getByRole('menuitem', {
      name: 'Unpin software'
    })
    // pin first software
    fireEvent.click(pinBtn)

    // validate patchSoftware fn is called with expected params
    expect(mockPatchSoftwareForOrganisation).toBeCalledTimes(1)
    expect(mockPatchSoftwareForOrganisation).toBeCalledWith({
      'data': {
        'is_featured': false,
      },
      'organisation': mockProps.organisation.id,
      'software': mockSoftware[0].id,
      'token': mockSession.token,
    })
  })

  it('maintainer can DENY software affiliation', async () => {
    mockProps.isMaintainer = true

    mockSoftwareForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockSoftware.length,
      data: mockSoftware as any
    })
    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationSoftware {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockSoftware.length)

    // select action on second software
    fireEvent.click(moreIcons[1])

    mockResolvedValueOnce('OK',{status:200})

    // select deny affiliation menu option
    const actionBtn = screen.getByRole('menuitem', {
      name: 'Deny affiliation'
    })
    // deny affiliation for second software in list
    fireEvent.click(actionBtn)

    // validate patchSoftware fn is called with expected params
    expect(mockPatchSoftwareForOrganisation).toBeCalledTimes(1)
    expect(mockPatchSoftwareForOrganisation).toBeCalledWith({
      'data': {
        'status': 'rejected_by_relation'
      },
      'organisation': mockProps.organisation.id,
      'software': mockSoftware[1].id,
      'token': mockSession.token,
    })
  })

  it('maintainer can APPROVE denied software affiliation', async () => {
    mockProps.isMaintainer = true
    mockSoftware[1].status = 'rejected_by_relation'

    mockSoftwareForOrganisation.mockResolvedValueOnce({
      status: 206,
      count: mockSoftware.length,
      data: mockSoftware as any
    })
    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationSoftware {...mockProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockSoftware.length)

    // select action on first software
    fireEvent.click(moreIcons[1])

    // select approve affiliation menu option
    const actionBtn = screen.getByRole('menuitem', {
      name: 'Approve affiliation'
    })
    // approve affiliation for first software
    fireEvent.click(actionBtn)

    // validate patchSoftware fn is called with expected params
    expect(mockPatchSoftwareForOrganisation).toBeCalledTimes(1)
    expect(mockPatchSoftwareForOrganisation).toBeCalledWith({
      'data': {
        'status': 'approved'
      },
      'organisation': mockProps.organisation.id,
      'software': mockSoftware[1].id,
      'token': mockSession.token,
    })
  })
})
