// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, within} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithCommunityContext} from '~/utils/jest/WithCommunityContext'

import {defaultSession} from '~/auth'
import CommunityMaintainers from './index'
import mockCommunity from '../../__mocks__/mockCommunity'

// mock user agreement call
jest.mock('~/components/user/settings/agreements/useUserAgreements')

// MOCK useCommunityMaintainers hook
const mockDeleteMaintainer = jest.fn()
const dummyMaintainersData={
  loading: false,
  maintainers:[],
  deleteMaintainer: mockDeleteMaintainer
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseCommunityMaintainers = jest.fn((props)=>dummyMaintainersData)
jest.mock('./useCommunityMaintainers', () => ({
  useCommunityMaintainers:jest.fn((props)=>mockUseCommunityMaintainers(props))
}))

// MOCK useCommunityInvitations hook
const mockCreateInvitation = jest.fn()
const mockDeleteInvitation = jest.fn()
const dummyInvitationData={
  magicLink: null,
  unusedInvitations:[],
  createInvitation: mockCreateInvitation,
  deleteInvitation: mockDeleteInvitation
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseCommunityInvitations = jest.fn((props)=>dummyInvitationData)
jest.mock('./useCommunityInvitations', () => ({
  useCommunityInvitations:jest.fn((props)=>mockUseCommunityInvitations(props))
}))

const dummyProps = {
  ...mockCommunity,
  isMaintainer: false
}

const dummyMaintainer = [
  {account: 'test-account-id-1', name: 'John Doe 1', email: 'test1@email.com', affiliation: 'Company 1', disableDelete: false},
  {account: 'test-account-id-2', name: 'John Doe 2', email: null, affiliation: null, disableDelete: false},
]

const dummyInvitations = [
  {id:'test-link-id-1',created_at: new Date().toISOString(),type:'community'},
  {id:'test-link-id-2',created_at: new Date().toISOString(),type:'community'},
  {id:'test-link-id-3',created_at: new Date().toISOString(),type:'community'}
]

describe('frontend/components/organisation/maintainers/index.tsx', () => {

  beforeEach(() => {
    // reset mock counters
    jest.clearAllMocks()
  })

  it('shows loader when hook returns loading=true', () => {
    // user is authenticated
    defaultSession.status = 'authenticated'
    defaultSession.token = 'test-token'
    // it is maintainer of this organisation
    dummyProps.isMaintainer = true
    dummyMaintainersData.loading = true
    // mock hook return with loading true
    mockUseCommunityMaintainers.mockReturnValueOnce(dummyMaintainersData)

    render(
      <WithAppContext options={{session: defaultSession}}>
        <WithCommunityContext {...dummyProps}>
          <CommunityMaintainers />
        </WithCommunityContext>
      </WithAppContext>
    )

    const loader = screen.getByRole('progressbar')
    expect(loader).toBeInTheDocument()
  })

  it('shows "No maintainers" message', async () => {
    // user is authenticated
    defaultSession.status = 'authenticated'
    defaultSession.token = 'test-token'
    // it is maintainer of this organisation
    dummyProps.isMaintainer = true
    dummyMaintainersData.loading = false
    // mock hook return with loading true
    mockUseCommunityMaintainers.mockReturnValueOnce(dummyMaintainersData)

    render(
      <WithAppContext options={{session: defaultSession}}>
        <WithCommunityContext {...dummyProps}>
          <CommunityMaintainers />
        </WithCommunityContext>
      </WithAppContext>
    )
    const noMaintainers = await screen.findByText('No maintainers')
    expect(noMaintainers).toBeInTheDocument()
  })

  it('renders component with "Generate invite link" button', () => {
    // it is maintainer of this organisation
    dummyProps.isMaintainer = true
    dummyMaintainersData.loading = false
    // mock hook return with loading true
    mockUseCommunityMaintainers.mockReturnValueOnce(dummyMaintainersData)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithCommunityContext {...dummyProps}>
          <CommunityMaintainers />
        </WithCommunityContext>
      </WithAppContext>
    )

    const inviteBtn = screen.getByRole('button', {name: 'Generate invite link'})
    expect(inviteBtn).toBeInTheDocument()
    // screen.debug()
  })

  it('shows maintainer name (in the list)', async () => {
    // MOCK maintainers call
    const dummyRawMaintainers = [{
      'maintainer': 'a050aaf3-9c46-490c-ade3-aeeb6a05b1d1',
      'name': 'Jordan Ross Belfort',
      'email': 'Jordan.Belfort@harvard-example.edu',
      'affiliation': 'harvard-example.edu',
      'is_primary': false
    }]
    // user is authenticated
    defaultSession.status = 'authenticated'
    defaultSession.token = 'test-token'
    dummyMaintainersData.maintainers = dummyRawMaintainers as any
    dummyMaintainersData.loading = false
    // mock hook return with loading true
    mockUseCommunityMaintainers.mockReturnValueOnce(dummyMaintainersData)
    // it is maintainer of this organisation
    dummyProps.isMaintainer = true

    render(
      <WithAppContext options={{session: defaultSession}}>
        <WithCommunityContext {...dummyProps}>
          <CommunityMaintainers />
        </WithCommunityContext>
      </WithAppContext>
    )

    const maintainer = await screen.findByText(dummyRawMaintainers[0].name)
    expect(maintainer).toBeInTheDocument()
  })

  it('shows maintainer list with all items', () => {
    dummyMaintainersData.maintainers = dummyMaintainer as any
    dummyMaintainersData.loading = false
    // mock hook return with loading true
    mockUseCommunityMaintainers.mockReturnValueOnce(dummyMaintainersData)
    // it is maintainer of this organisation
    dummyProps.isMaintainer = true

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithCommunityContext {...dummyProps}>
          <CommunityMaintainers />
        </WithCommunityContext>
      </WithAppContext>
    )

    const maintainerItem = screen.getAllByTestId('maintainer-list-item')
    expect(maintainerItem.length).toEqual(dummyMaintainer.length)
  })

  it('maintainer cannot be deleted when disableDelete===true', () => {
    // set disable flag on first item
    dummyMaintainer[0].disableDelete = true
    dummyMaintainersData.maintainers = dummyMaintainer as any
    dummyMaintainersData.loading = false
    // mock hook return with loading true
    mockUseCommunityMaintainers.mockReturnValueOnce(dummyMaintainersData)
    // it is maintainer of this organisation
    dummyProps.isMaintainer = true

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithCommunityContext {...dummyProps}>
          <CommunityMaintainers />
        </WithCommunityContext>
      </WithAppContext>
    )

    const maintainerItem = screen.getAllByTestId('maintainer-list-item')
    const deleteBtn = within(maintainerItem[0]).getByRole('button',{name:'delete'})
    expect(deleteBtn).toBeDisabled()
  })

  it('calls createInvitation method to create new invitation',()=>{
    // it is maintainer of this organisation
    dummyProps.isMaintainer = true

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithCommunityContext {...dummyProps}>
          <CommunityMaintainers />
        </WithCommunityContext>
      </WithAppContext>
    )

    // click on generate invite
    const btnInvite = screen.getByRole('button',{name:'Generate invite link'})
    fireEvent.click(btnInvite)

    expect(mockCreateInvitation).toHaveBeenCalledTimes(1)
  })

  it('shows unused links list',()=>{
    // it is maintainer of this organisation
    dummyProps.isMaintainer = true
    dummyInvitationData.magicLink = null
    dummyInvitationData.unusedInvitations = dummyInvitations as any

    mockUseCommunityInvitations.mockReturnValueOnce(dummyInvitationData)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithCommunityContext {...dummyProps}>
          <CommunityMaintainers />
        </WithCommunityContext>
      </WithAppContext>
    )

    // check number of unused invitations
    const unusedInvites = screen.getAllByTestId('unused-invitation-item')
    expect(unusedInvites.length).toEqual(dummyInvitations.length)
  })

})
