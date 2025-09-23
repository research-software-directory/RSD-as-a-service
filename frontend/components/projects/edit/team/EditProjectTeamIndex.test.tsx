// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 - 2025 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'

import editProjectState from '../__mocks__/editProjectState'
import mockTeamMembers from './__mocks__/teamMembers.json'
import mockSearchOptions from '~/components/person/__mocks__/searchForPersonOptions.json'
import {modalConfig} from '~/components/person/config'
import {cfgTeamMembers} from './config'
import ProjectTeam from './index'

// MOCK getTeamForProject
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetTeamForProject = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/components/projects/apiProjects', () => ({
  getTeamForProject: jest.fn(props=>mockGetTeamForProject(props))
}))

// MOCK searchForPerson
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSearchForPerson = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/components/person/searchForPerson', () => ({
  searchForPerson: jest.fn(props=>mockSearchForPerson(props)),
}))
// MOCK useAggregatedPerson (use default)
jest.mock('~/components/person/useAggregatedPerson')

// MOCK postTeamMember
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPostTeamMember = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'unique-person-id'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchTeamMember = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteTeamMemberById = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchTeamMemberPositions = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
jest.mock('./apiTeamMembers', () => ({
  postTeamMember: jest.fn(props => mockPostTeamMember(props)),
  patchTeamMember: jest.fn(props => mockPatchTeamMember(props)),
  deleteTeamMemberById: jest.fn(props => mockDeleteTeamMemberById(props)),
  patchTeamMemberPositions: jest.fn(props => mockPatchTeamMemberPositions(props)),
}))

// MOCK deleteImage
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteImage = jest.fn(props => Promise.resolve('OK'))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUpsertImage = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'uploaded-image-id'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSaveBase64Image = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'uploaded-image-id'
}))
jest.mock('~/utils/editImage', () => ({
  ...jest.requireActual('~/utils/editImage'),
  deleteImage: jest.fn(props => mockDeleteImage(props)),
  upsertImage: jest.fn(props => mockUpsertImage(props)),
  saveBase64Image: jest.fn(props => mockSaveBase64Image(props)),
}))

// MOCK handleFileUpload
const mockImageData={
  image_b64: 'data:image/png;base64,base64-encoded-image-content',
  image_mime_type: 'image/png'
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockHandleFileUpload = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK',
  ...mockImageData
}))
jest.mock('~/utils/handleFileUpload', () => ({
  handleFileUpload: jest.fn(props=>mockHandleFileUpload(props))
}))

describe('frontend/components/projects/edit/team/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders no team members message', async () => {
    // mock no members
    mockGetTeamForProject.mockResolvedValueOnce([])
    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectTeam />
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // shows no members alert message
    const noMembersAlert = screen.getByTestId('no-team-member-alert')
    const noMembersMsg = within(noMembersAlert).getByText('No team members')
    expect(noMembersMsg).toBeInTheDocument()
  })

  it('renders members list', async() => {
    // mock no members
    mockGetTeamForProject.mockResolvedValueOnce(mockTeamMembers)

    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectTeam />
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const members = screen.getAllByTestId('contributor-item')
    expect(members.length).toEqual(mockTeamMembers.length)
  })

  it('can add new team member', async () => {
    const newPerson = {
      given_names: 'Dusan',
      family_names: 'Mijatovic',
      email: 'test1@email.com',
      role: 'Developer',
      affiliation: 'No name company'
    }
    const memberId='new-team-member-id'
    const searchMember = `${newPerson.given_names} ${newPerson.family_names}`
    // mock no members
    mockGetTeamForProject.mockResolvedValueOnce([])
    // mock searchForPerson response
    mockSearchForPerson.mockResolvedValueOnce(mockSearchOptions)
    // mock post response
    mockPostTeamMember.mockResolvedValueOnce({
      status: 201,
      message: memberId
    })
    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectTeam />
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // find member
    const findMember = screen.getByRole('combobox', {
      name: cfgTeamMembers.find.label
    })
    fireEvent.change(findMember,{target:{value: searchMember}})

    // find all options
    const options = await screen.findAllByRole('option')
    // we always offer add option
    expect(options.length).toEqual(mockSearchOptions.length + 1)

    // validate search called with proper param
    expect(mockSearchForPerson).toHaveBeenCalledTimes(1)
    expect(mockSearchForPerson).toHaveBeenCalledWith({
      searchFor: searchMember,
      token: mockSession.token,
      include_orcid: true
    })

    // select first option: "Add"
    const addBtn = options[0]
    expect(addBtn).toHaveTextContent(`Add "${searchMember}"`)
    fireEvent.click(addBtn)

    // get modal
    const modal = screen.getByRole('dialog')

    // given names
    const givenNames = within(modal).getByRole('textbox', {
      name: modalConfig.given_names.label
    })
    expect(givenNames).toHaveValue(newPerson.given_names)
    // family name
    const familyNames = within(modal).getByRole('textbox', {
      name: modalConfig.family_names.label
    })
    expect(familyNames).toHaveValue(newPerson.family_names)

    // add email
    const email = within(modal).getByRole('textbox', {
      name: modalConfig.email_address.label
    })
    fireEvent.change(email, {target: {value: newPerson.email}})

    // add role
    const role = within(modal).getByRole('combobox', {
      name: modalConfig.role.label
    })
    fireEvent.change(role, {target: {value: newPerson.role}})

    // add affiliation
    const affiliation = within(modal).getByRole('combobox', {
      name: modalConfig.affiliation.label
    })
    fireEvent.change(affiliation, {target: {value: newPerson.affiliation}})

    // switch is_contact_person
    const isContact = within(modal).getByRole('switch', {
      name: modalConfig.is_contact_person.label
    })
    fireEvent.click(isContact)

    const saveBtn = screen.getByRole('button', {
      name: 'Save'
    })

    await waitFor(() => {
      // validate save is enabled
      expect(saveBtn).toBeEnabled()
      // click save
      fireEvent.click(saveBtn)
    })

    // validate api call
    await waitFor(() => {
      expect(mockPostTeamMember).toHaveBeenCalledTimes(1)
      expect(mockPostTeamMember).toHaveBeenCalledWith({
        'member': {
          'affiliation': newPerson.affiliation,
          'avatar_id': null,
          'email_address': newPerson.email,
          'family_names': newPerson.family_names,
          'given_names': newPerson.given_names,
          'id': memberId,
          'is_contact_person': true,
          'orcid': null,
          'account': null,
          'position': 1,
          'project': editProjectState.id,
          'role': newPerson.role,
        },
        'token': mockSession.token,
      })
    })

    // validate list item loaded
    const members = await screen.findAllByTestId('contributor-item')
    expect(members.length).toEqual(1)
    expect(members[0]).toHaveTextContent(newPerson.family_names)
  })

  it('can remove team member', async() => {
    // mock no members
    mockGetTeamForProject.mockResolvedValueOnce(mockTeamMembers)

    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectTeam />
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // get all members
    const members = screen.getAllByTestId('contributor-item')
    // delete first member
    const deleteBtn = within(members[0]).getByRole('button', {
      name: 'delete'
    })
    fireEvent.click(deleteBtn)

    // confirmation modal
    const modal = screen.getByRole('dialog')
    // click on Remove
    const removeBtn = within(modal).getByRole('button', {
      name: 'Remove'
    })
    fireEvent.click(removeBtn)

    await waitFor(() => {
      // validate delete called
      expect(mockDeleteTeamMemberById).toHaveBeenCalledTimes(1)
      expect(mockDeleteTeamMemberById).toHaveBeenCalledWith({
        'ids': [
          mockTeamMembers[0].id,
        ],
        'token': mockSession.token,
      })

      // confirm member removed from list
      const remainedMembers = screen.getAllByTestId('contributor-item')
      expect(remainedMembers.length).toEqual(mockTeamMembers.length - 1)

      // confirm list position patched
      expect(mockPatchTeamMemberPositions).toHaveBeenCalledTimes(1)
      // confirm avatar image tied to be removed
      if (mockTeamMembers[0].avatar_id !== null) {
        expect(mockDeleteImage).toHaveBeenCalledTimes(1)
        expect(mockDeleteImage).toHaveBeenCalledWith({
          'id': mockTeamMembers[0].avatar_id,
          'token': mockSession.token,
        })
      }
    })
  })

  it('can remove avatar', async () => {
    const editedMember = {
      ...mockTeamMembers[0],
      // we remove avatar id
      avatar_id: null,
      // we use project id from context
      project: editProjectState.id
    }
    // mock no members
    mockGetTeamForProject.mockResolvedValueOnce(mockTeamMembers)
    // mock patch
    mockPatchTeamMember.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })

    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectTeam />
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // get all members
    const members = screen.getAllByTestId('contributor-item')
    // edit first member
    const editBtn = within(members[0]).getByTestId('EditIcon')
    fireEvent.click(editBtn)

    const modal = screen.getByRole('dialog')

    // click on no image button
    const noImage = within(modal).getByTestId('no-image-btn')
    fireEvent.click(noImage)

    // save
    const saveBtn = within(modal).getByRole('button', {
      name:'Save'
    })

    await waitFor(() => {
      expect(saveBtn).toBeEnabled()
      fireEvent.click(saveBtn)
    })

    await waitFor(() => {
      // confirm member patched called
      expect(mockPatchTeamMember).toHaveBeenCalledTimes(1)
      expect(mockPatchTeamMember).toHaveBeenCalledWith({
        member: editedMember,
        token: mockSession.token
      })
      // validate delete image called
      expect(mockDeleteImage).toHaveBeenCalledTimes(1)
      expect(mockDeleteImage).toHaveBeenCalledWith({
        'id': mockTeamMembers[0].avatar_id,
        'token': mockSession.token,
      })
    })
  })
  it('can CANCEL modal changes', async () => {
    // mock no members
    mockGetTeamForProject.mockResolvedValueOnce(mockTeamMembers)
    // mock patch
    mockPatchTeamMember.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })

    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectTeam />
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // get all members
    const members = screen.getAllByTestId('contributor-item')
    // edit first member
    const editBtn = within(members[0]).getByTestId('EditIcon')
    fireEvent.click(editBtn)

    const modal = screen.getByRole('dialog')

    // click on no image button
    const removeImage = within(modal).getByTestId('no-image-btn')
    fireEvent.click(removeImage)

    // save
    const saveBtn = within(modal).getByRole('button', {
      name: 'Save'
    })

    await waitFor(() => {
      expect(saveBtn).toBeEnabled()
    })

    // cancel
    const cancelBtn = within(modal).getByRole('button', {
      name:'Cancel'
    })
    fireEvent.click(cancelBtn)

    await waitFor(() => {
      // validate modal hidden
      expect(modal).not.toBeVisible()
      // confirm patch contributor is NOT called
      expect(mockPatchTeamMember).toHaveBeenCalledTimes(0)
      // delete image NOT called
      expect(mockDeleteImage).toHaveBeenCalledTimes(0)
    })
  })

  it('can upload avatar image', async () => {
    const oldAvatarId = mockTeamMembers[0].avatar_id
    const newAvatarId = 'new-avatar-test-id-with-length-10-or-more'
    const fileToUpload = 'test-file-name.png'
    // const base64data = 'base64-encoded-image-content'
    // const fileType = 'image/png'
    const editedMember = {
      ...mockTeamMembers[0],
      // we use project id from context
      project: editProjectState.id,
      // new avatar
      avatar_id: newAvatarId
    }
    // mock no members
    mockGetTeamForProject.mockResolvedValueOnce(mockTeamMembers)
    // mock patch
    mockPatchTeamMember.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })
    // mock image upload
    mockSaveBase64Image.mockResolvedValueOnce({
      status: 201,
      message: newAvatarId
    })

    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectTeam />
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // get all members
    const members = screen.getAllByTestId('contributor-item')
    // edit first member
    const editBtn = within(members[0]).getByTestId('EditIcon')
    fireEvent.click(editBtn)

    const modal = screen.getByRole('dialog')

    // simulate upload action
    const imageInput:any = within(modal).getByTestId('upload-avatar-input')
    // set file to upload
    fireEvent.change(imageInput, {target: {file: fileToUpload}})

    // expect file upload to be called
    expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)

    // save
    const saveBtn = within(modal).getByRole('button', {
      name: 'Save'
    })
    await waitFor(() => {
      expect(saveBtn).toBeEnabled()
      fireEvent.click(saveBtn)
    })

    await waitFor(() => {
      // validate new avatar upload
      expect(mockSaveBase64Image).toHaveBeenCalledTimes(1)
      expect(mockSaveBase64Image).toHaveBeenCalledWith({
        'base64': mockImageData.image_b64,
        'token': mockSession.token,
      })
      // validate delete image called
      expect(mockDeleteImage).toHaveBeenCalledTimes(1)
      expect(mockDeleteImage).toHaveBeenCalledWith({
        'id': oldAvatarId,
        'token': mockSession.token,
      })
      // confirm member patched called
      expect(mockPatchTeamMember).toHaveBeenCalledTimes(1)
      expect(mockPatchTeamMember).toHaveBeenCalledWith({
        member: editedMember,
        token: mockSession.token
      })
    })
  })
})
