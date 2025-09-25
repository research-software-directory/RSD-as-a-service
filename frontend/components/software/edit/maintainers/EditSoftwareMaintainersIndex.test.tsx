// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'

import SoftwareMaintainers from './index'

// MOCKS
import {initialState as softwareState} from '~/components/software/edit/context/editSoftwareContext'

// MOCK useSoftwareMaintainers hook
const mockDeleteMaintainer = jest.fn()
const dummyMaintainersData={
  loading: false,
  maintainers:[],
  deleteMaintainer: mockDeleteMaintainer
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseSoftwareMaintainers = jest.fn((props)=>dummyMaintainersData)
jest.mock('./useSoftwareMaintainers', () => ({
  useSoftwareMaintainers:jest.fn((props)=>mockUseSoftwareMaintainers(props))
}))

// MOCK useSoftwareInvitations hook
const mockCreateInvitation = jest.fn()
const mockDeleteInvitation = jest.fn()
const dummyInvitationData={
  magicLink: null,
  unusedInvitations:[],
  createInvitation: mockCreateInvitation,
  deleteInvitation: mockDeleteInvitation
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseSoftwareInvitations = jest.fn((props)=>dummyInvitationData)
jest.mock('./useSoftwareInvitations', () => ({
  useSoftwareInvitations:jest.fn((props)=>mockUseSoftwareInvitations(props))
}))


const dummyMaintainers = [
  {account: 'test-account-id-1', name: 'John Doe 1', email: 'test1@email.com', affiliation: 'Company 1', disableDelete: false},
  {account: 'test-account-id-2', name: 'John Doe 2', email: null, affiliation: null, disableDelete: false},
]

const dummyInvitations = [
  {id:'test-link-id-1',created_at: new Date().toISOString(),type:'community'},
  {id:'test-link-id-2',created_at: new Date().toISOString(),type:'community'},
  {id:'test-link-id-3',created_at: new Date().toISOString(),type:'community'}
]

describe('frontend/components/software/edit/maintainers/index.tsx', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loader when hook returns loading=true', () => {
    // user is authenticated
    mockSession.status = 'authenticated'
    mockSession.token = 'test-token'
    // it is maintainer of this organisation
    dummyMaintainersData.loading = true
    // mock hook return with loading true
    mockUseSoftwareMaintainers.mockReturnValueOnce(dummyMaintainersData)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMaintainers />
        </WithSoftwareContext>
      </WithAppContext>
    )

    const loader = screen.getByRole('progressbar')
    expect(loader).toBeInTheDocument()
  })

  it('renders no maintainers', async() => {
    // software id required for requests
    softwareState.id = 'software-test-id'
    // it is maintainer of this organisation
    dummyMaintainersData.loading = false
    // mock hook return with loading true
    mockUseSoftwareMaintainers.mockReturnValueOnce(dummyMaintainersData)

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMaintainers />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // validate no maintainers message
    screen.getByText('No maintainers')
  })

  it('shows maintainer list with all items', async() => {
    // mock maintainers
    dummyMaintainersData.maintainers = dummyMaintainers as any
    dummyMaintainersData.loading = false
    // mock hook return with loading true
    mockUseSoftwareMaintainers.mockReturnValueOnce(dummyMaintainersData)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMaintainers />
        </WithSoftwareContext>
      </WithAppContext>
    )

    const maintainerItem = screen.getAllByTestId('maintainer-list-item')
    expect(maintainerItem.length).toEqual(dummyMaintainers.length)
  })

  it('shows unused links list',()=>{
    // it is maintainer of this organisation
    dummyInvitationData.magicLink = null
    dummyInvitationData.unusedInvitations = dummyInvitations as any

    mockUseSoftwareInvitations.mockReturnValueOnce(dummyInvitationData)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMaintainers />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // check number of unused invitations
    const unusedInvites = screen.getAllByTestId('unused-invitation-item')
    expect(unusedInvites.length).toEqual(dummyInvitations.length)
  })

})
