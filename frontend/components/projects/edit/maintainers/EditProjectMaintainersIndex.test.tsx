// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'

import ProjectMaintainers from './index'
import editProjectState from '../__mocks__/editProjectState'

// MOCK useProjectMaintainers hook
const mockDeleteMaintainer = jest.fn()
const dummyMaintainersData={
  loading: false,
  maintainers:[],
  deleteMaintainer: mockDeleteMaintainer
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseProjectMaintainers = jest.fn((props)=>dummyMaintainersData)
jest.mock('./useProjectMaintainers', () => ({
  useProjectMaintainers:jest.fn((props)=>mockUseProjectMaintainers(props))
}))

// MOCK useProjectInvitations hook
const mockCreateInvitation = jest.fn()
const mockDeleteInvitation = jest.fn()
const dummyInvitationData={
  magicLink: null,
  unusedInvitations:[],
  createInvitation: mockCreateInvitation,
  deleteInvitation: mockDeleteInvitation
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseProjectInvitations = jest.fn((props)=>dummyInvitationData)
jest.mock('./useProjectInvitations', () => ({
  useProjectInvitations:jest.fn((props)=>mockUseProjectInvitations(props))
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


describe('frontend/components/projects/edit/maintainers/index.tsx', () => {
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
    mockUseProjectMaintainers.mockReturnValueOnce(dummyMaintainersData)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectMaintainers />
        </WithProjectContext>
      </WithAppContext>
    )

    const loader = screen.getByRole('progressbar')
    expect(loader).toBeInTheDocument()
  })

  it('renders no maintainers', async() => {
    // mock no maintainers
    dummyMaintainersData.loading = false
    // mock hook return with loading true
    mockUseProjectMaintainers.mockReturnValueOnce(dummyMaintainersData)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectMaintainers />
        </WithProjectContext>
      </WithAppContext>
    )

    // shows no maintainers message
    const noMaintainers = screen.getByText('No maintainers')
    expect(noMaintainers).toBeInTheDocument()
  })

  it('shows maintainer list with all items', async() => {
    // mock maintainers
    dummyMaintainersData.maintainers = dummyMaintainers as any
    dummyMaintainersData.loading = false
    // mock hook return with loading true
    mockUseProjectMaintainers.mockReturnValueOnce(dummyMaintainersData)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectMaintainers />
        </WithProjectContext>
      </WithAppContext>
    )

    const maintainerItem = screen.getAllByTestId('maintainer-list-item')
    expect(maintainerItem.length).toEqual(dummyMaintainers.length)
  })

  it('shows unused links list',()=>{
    // it is maintainer of this organisation
    dummyInvitationData.magicLink = null
    dummyInvitationData.unusedInvitations = dummyInvitations as any

    mockUseProjectInvitations.mockReturnValueOnce(dummyInvitationData)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectMaintainers />
        </WithProjectContext>
      </WithAppContext>
    )

    // check number of unused invitations
    const unusedInvites = screen.getAllByTestId('unused-invitation-item')
    expect(unusedInvites.length).toEqual(dummyInvitations.length)
  })

})
