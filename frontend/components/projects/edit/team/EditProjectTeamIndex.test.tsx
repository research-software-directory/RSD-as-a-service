// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'

import ProjectTeam from './index'
import editProjectState from '../__mocks__/editProjectState'
import mockTeamMembers from './__mocks__/teamMembers.json'
import mockSearchPerson from './__mocks__/searchPerson.json'
import {cfgTeamMembers as config} from './config'

// MOCK getTeamForProject
const mockGetTeamForProject = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/getProjects', () => ({
  getTeamForProject: jest.fn(props=>mockGetTeamForProject(props))
}))

// MOCK findRSDPerson
const mockFindRSDPerson = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/findRSDPerson', () => ({
  findRSDPerson: jest.fn(props=>mockFindRSDPerson(props))
}))

// MOCK getORCID
const mockGetORCID = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/getORCID', () => ({
  ...jest.requireActual('~/utils/getORCID'),
  getORCID: jest.fn(props=>mockGetORCID(props))
}))

// MOCK postTeamMember
const mockPostTeamMember = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'unique-person-id'
}))
const mockPatchTeamMember = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
const mockDeleteTeamMemberById = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
const mockPatchTeamMemberPositions = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
jest.mock('./editTeamMembers', () => ({
  postTeamMember: jest.fn(props => mockPostTeamMember(props)),
  patchTeamMember: jest.fn(props => mockPatchTeamMember(props)),
  deleteTeamMemberById: jest.fn(props => mockDeleteTeamMemberById(props)),
  patchTeamMemberPositions: jest.fn(props => mockPatchTeamMemberPositions(props)),
}))

// MOCK deleteImage
const mockDeleteImage = jest.fn(props => Promise.resolve('OK'))
jest.mock('~/utils/editImage', () => ({
  ...jest.requireActual('~/utils/editImage'),
  deleteImage: jest.fn(props=>mockDeleteImage(props))
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
          <ProjectTeam slug="test-slug"/>
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // shows no members alert message
    const noMembersAlert = screen.getByRole('alert')
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
          <ProjectTeam slug="test-slug"/>
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const members = screen.getAllByTestId('team-member-item')
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
    // mock search options returned
    mockFindRSDPerson.mockResolvedValueOnce([{
      key: mockSearchPerson[0].display_name,
      label: mockSearchPerson[0].display_name,
      data: {
        ...mockSearchPerson[0]
      }
    }])
    mockGetORCID.mockResolvedValueOnce([{
      key: mockSearchPerson[1].display_name,
      label: mockSearchPerson[1].display_name,
      data: {
        ...mockSearchPerson[1]
      }
    }])
    mockPostTeamMember.mockResolvedValueOnce({
      status: 201,
      message: memberId
    })
    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectTeam slug="test-slug"/>
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // find member
    const findMember = screen.getByRole('combobox', {
      name: config.find.label
    })
    fireEvent.change(findMember,{target:{value: searchMember}})

    // find all options
    const options = await screen.findAllByRole('option')
    // we always offer add option
    expect(options.length).toEqual(mockSearchPerson.length + 1)

    // validate search called with proper param
    expect(mockFindRSDPerson).toBeCalledTimes(1)
    expect(mockFindRSDPerson).toBeCalledWith({
      'frontend': true,
      'searchFor': searchMember,
      'token': mockSession.token,
    })

    expect(mockGetORCID).toBeCalledTimes(1)
    expect(mockGetORCID).toBeCalledWith({
      'searchFor': searchMember
    })

    // select first option: "Add"
    const addBtn = options[0]
    expect(addBtn).toHaveTextContent(`Add "${searchMember}"`)
    fireEvent.click(addBtn)

    // get modal
    const modal = screen.getByRole('dialog')

    // given names
    const givenNames = within(modal).getByRole('textbox', {
      name: config.given_names.label
    })
    expect(givenNames).toHaveValue(newPerson.given_names)
    // family name
    const familyNames = within(modal).getByRole('textbox', {
      name: config.family_names.label
    })
    expect(familyNames).toHaveValue(newPerson.family_names)

    // add email
    const email = within(modal).getByRole('textbox', {
      name: config.email_address.label
    })
    fireEvent.change(email, {target: {value: newPerson.email}})

    // add role
    const role = within(modal).getByRole('textbox', {
      name: config.role.label
    })
    fireEvent.change(role, {target: {value: newPerson.role}})

    // add affiliation
    const affiliation = within(modal).getByRole('textbox', {
      name: config.affiliation.label
    })
    fireEvent.change(affiliation, {target: {value: newPerson.affiliation}})

    // switch is_contact_person
    const isContact = within(modal).getByRole('checkbox', {
      name: config.is_contact_person.label
    })
    fireEvent.click(isContact)

    const saveBtn = screen.getByRole('button', {
      name: 'Save'
    })
    expect(saveBtn).toBeEnabled()
    fireEvent.click(saveBtn)

    // validate api call
    await waitFor(() => {
      expect(mockPostTeamMember).toBeCalledTimes(1)
      expect(mockPostTeamMember).toBeCalledWith({
       'member': {
         'affiliation': newPerson.affiliation,
         'avatar_id': null,
         'email_address': newPerson.email,
         'family_names': newPerson.family_names,
         'given_names': newPerson.given_names,
         'id': memberId,
         'is_contact_person': true,
         'orcid': null,
         'position': 1,
         'project': editProjectState.project.id,
         'role': newPerson.role,
       },
       'token': mockSession.token,
      })
    })

    // validate list item loaded
    const members = await screen.findAllByTestId('team-member-item')
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
          <ProjectTeam slug="test-slug"/>
        </WithProjectContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // get all members
    const members = screen.getAllByTestId('team-member-item')
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
      expect(mockDeleteTeamMemberById).toBeCalledTimes(1)
      expect(mockDeleteTeamMemberById).toBeCalledWith({
       'ids': [
         mockTeamMembers[0].id,
       ],
       'token': mockSession.token,
      })
      // confirm member removed from list
      const remainedMembers = screen.getAllByTestId('team-member-item')
      expect(remainedMembers.length).toEqual(mockTeamMembers.length - 1)

      // confirm list position patched
      expect(mockPatchTeamMemberPositions).toBeCalledTimes(1)
      // confirm avatar image tied to be removed
      if (mockTeamMembers[0].avatar_id !== null) {
        expect(mockDeleteImage).toBeCalledTimes(1)
        expect(mockDeleteImage).toBeCalledWith({
          'id': mockTeamMembers[0].avatar_id,
          'token': mockSession.token,
        })
      }
    })
  })
})
