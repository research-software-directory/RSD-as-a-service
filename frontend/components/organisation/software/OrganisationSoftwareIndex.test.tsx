// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
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
// MOCK getOrganisationIdForSlug,getSoftwareForOrganisation
jest.mock('~/components/organisation/apiOrganisations')

import {fireEvent, render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'

import OrganisationSoftware from './index'
import mockOrganisation from '../__mocks__/mockOrganisation'
import mockSoftware from './__mocks__/mockSoftware.json'
import {getSoftwareForOrganisation} from '~/components/organisation/apiOrganisations'
const mockGetSoftwareForOrganisation = getSoftwareForOrganisation as jest.Mock
import {isOrganisationMaintainer} from '~/auth/permissions/isMaintainerOfOrganisation'
const mockIsOrganisationMaintainer = isOrganisationMaintainer as jest.Mock

// mock software categories api
jest.mock('~/components/organisation/software/filters/useOrgSoftwareCategoriesList')

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

// MOCK patchSoftwareForOrganisation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const ResolvedPage = await OrganisationSoftware({slug:['test-project'],query:{}})

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

  it('shows software cards', async() => {

    mockGetSoftwareForOrganisation.mockResolvedValueOnce({
      count: mockSoftware.length,
      data: mockSoftware
    })

    const ResolvedPage = await OrganisationSoftware({slug:['test-project'],query:{}})
    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    const software = screen.getAllByTestId('software-grid-card')
    expect(software.length).toEqual(mockSoftware.length)
  })

  it('shows software cards with menu when isMaintainer=true', async () => {
    // pass in session
    mockProps.isMaintainer=true
    // mock is maintainer server side
    mockIsOrganisationMaintainer.mockResolvedValueOnce(true)
    // mock data
    mockGetSoftwareForOrganisation.mockResolvedValueOnce({
      count: mockSoftware.length,
      data: mockSoftware as any
    })

    const ResolvedPage = await OrganisationSoftware({slug:['test-project'],query:{}})
    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockSoftware.length)
  })

  it('maintainer can PIN software', async () => {
    // pass in session
    mockProps.isMaintainer=true
    // mock is maintainer server side
    mockIsOrganisationMaintainer.mockResolvedValueOnce(true)
    // mock data
    mockGetSoftwareForOrganisation.mockResolvedValueOnce({
      count: mockSoftware.length,
      data: mockSoftware as any
    })

    const ResolvedPage = await OrganisationSoftware({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

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
    expect(mockPatchSoftwareForOrganisation).toHaveBeenCalledTimes(1)
    expect(mockPatchSoftwareForOrganisation).toHaveBeenCalledWith({
      'data': {
        'is_featured': true,
      },
      'organisation': mockProps.organisation.id,
      'software': mockSoftware[0].id,
      'token': mockSession.token,
    })
  })

  it('maintainer can UNPIN pinned software', async () => {
    // pass in session
    mockProps.isMaintainer=true
    // mock is maintainer server side
    mockIsOrganisationMaintainer.mockResolvedValueOnce(true)
    // mock data
    mockSoftware[0].is_featured = true
    mockGetSoftwareForOrganisation.mockResolvedValueOnce({
      count: mockSoftware.length,
      data: mockSoftware as any
    })

    const ResolvedPage = await OrganisationSoftware({slug:['test-project'],query:{}})
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

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
    expect(mockPatchSoftwareForOrganisation).toHaveBeenCalledTimes(1)
    expect(mockPatchSoftwareForOrganisation).toHaveBeenCalledWith({
      'data': {
        'is_featured': false,
      },
      'organisation': mockProps.organisation.id,
      'software': mockSoftware[0].id,
      'token': mockSession.token,
    })
  })

  it('maintainer can DENY software affiliation', async () => {
    // pass in session
    mockProps.isMaintainer=true
    // mock is maintainer server side
    mockIsOrganisationMaintainer.mockResolvedValueOnce(true)
    // mock data
    mockGetSoftwareForOrganisation.mockResolvedValueOnce({
      count: mockSoftware.length,
      data: mockSoftware as any
    })

    const ResolvedPage = await OrganisationSoftware({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockSoftware.length)

    // select action on second software
    fireEvent.click(moreIcons[1])

    mockResolvedValueOnce('OK',{status:200})

    // select deny affiliation menu option
    const actionBtn = screen.getByRole('menuitem', {
      name: 'Block affiliation'
    })
    // deny affiliation for second software in list
    fireEvent.click(actionBtn)

    // validate patchSoftware fn is called with expected params
    expect(mockPatchSoftwareForOrganisation).toHaveBeenCalledTimes(1)
    expect(mockPatchSoftwareForOrganisation).toHaveBeenCalledWith({
      'data': {
        'status': 'rejected_by_relation'
      },
      'organisation': mockProps.organisation.id,
      'software': mockSoftware[1].id,
      'token': mockSession.token,
    })
  })

  it('maintainer can APPROVE denied software affiliation', async () => {
    // pass in session
    mockProps.isMaintainer=true
    // mock is maintainer server side
    mockIsOrganisationMaintainer.mockResolvedValueOnce(true)
    // mock data
    mockSoftware[1].status = 'rejected_by_relation'
    mockGetSoftwareForOrganisation.mockResolvedValueOnce({
      count: mockSoftware.length,
      data: mockSoftware as any
    })

    const ResolvedPage = await OrganisationSoftware({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    // get menu icons
    const moreIcons = screen.getAllByTestId('MoreVertIcon')
    expect(moreIcons.length).toEqual(mockSoftware.length)

    // select action on first software
    fireEvent.click(moreIcons[1])

    // select approve affiliation menu option
    const actionBtn = screen.getByRole('menuitem', {
      name: 'Allow affiliation'
    })
    // approve affiliation for first software
    fireEvent.click(actionBtn)

    // validate patchSoftware fn is called with expected params
    expect(mockPatchSoftwareForOrganisation).toHaveBeenCalledTimes(1)
    expect(mockPatchSoftwareForOrganisation).toHaveBeenCalledWith({
      'data': {
        'status': 'approved'
      },
      'organisation': mockProps.organisation.id,
      'software': mockSoftware[1].id,
      'token': mockSession.token,
    })
  })
})
