// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved, within, fireEvent, waitFor} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'

import {initialState as editSoftwareState} from '../editSoftwareContext'

import SoftwareContributors from '.'
import {contributorInformation as config} from '../editSoftwareConfig'


// MOCKS
import mockContributors from './__mocks__/softwareContributors.json'
import mockSearchPerson from '~/components/projects/edit/team/__mocks__/searchPerson.json'

// MOCK getContributorsForSoftware
const mockGetContributorsForSoftware = jest.fn(props => Promise.resolve([] as any))
const mockPostContributor = jest.fn(props => Promise.resolve([] as any))
const mockPatchContributor = jest.fn(props => Promise.resolve([] as any))
const mockdeleteContributorsById = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/editContributors', () => ({
  ...jest.requireActual('~/utils/editContributors'),
  getContributorsForSoftware: jest.fn(props => mockGetContributorsForSoftware(props)),
  postContributor: jest.fn(props => mockPostContributor(props)),
  patchContributor: jest.fn(props => mockPatchContributor(props)),
  deleteContributorsById: jest.fn(props => mockdeleteContributorsById(props)),
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

// MOCK getContributorsFromDoi
const mockGetContributorsFromDoi = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/getInfoFromDatacite', () => ({
  getContributorsFromDoi: jest.fn((...props)=>mockGetContributorsFromDoi(props))
}))

// MOCK editImage methods
const mockDeleteImage = jest.fn(props => Promise.resolve('OK'))
const mockUpsertImage = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'uploaded-image-id'
}))
jest.mock('~/utils/editImage', () => ({
  ...jest.requireActual('~/utils/editImage'),
  deleteImage: jest.fn(props => mockDeleteImage(props)),
  upsertImage: jest.fn(props => mockUpsertImage(props))
}))

// MOCK handleFileUpload
const mockHandleFileUpload = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK',
  image_b64: 'png,base64-encoded-image-content',
  image_mime_type: 'image/png'
}))
jest.mock('~/utils/handleFileUpload', () => ({
  handleFileUpload: jest.fn(props=>mockHandleFileUpload(props))
}))


describe('frontend/components/software/edit/contributors/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders no contributors message', async () => {
    // mock software context state
    editSoftwareState.software = {
      id: 'test-software-id',
      slug: 'test-software-slug',
      brand_name: 'Test software title',
      concept_doi: ''
    }
    // resolve no contributors
    mockGetContributorsForSoftware.mockResolvedValueOnce([])

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={editSoftwareState}>
          <SoftwareContributors />
        </WithSoftwareContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // shows no members alert message
    const noContributorsAlert = screen.getByTestId('no-contributor-alert')
    const noContributorsMsg = within(noContributorsAlert).getByText('No contributors')
    expect(noContributorsMsg).toBeInTheDocument()
  })

  it('renders contributors list', async () => {
    // mock software context state
    editSoftwareState.software = {
      id: 'test-software-id',
      slug: 'test-software-slug',
      brand_name: 'Test software title',
      concept_doi: ''
    }
    // resolve list of contributors
    mockGetContributorsForSoftware.mockResolvedValueOnce(mockContributors)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={editSoftwareState}>
          <SoftwareContributors />
        </WithSoftwareContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const contributors = screen.getAllByTestId('contributor-item')
    expect(contributors.length).toEqual(mockContributors.length)
  })

  it('can add new contributor', async() => {
    const newPerson = {
      given_names: 'Dusan',
      family_names: 'Mijatovic',
      email: 'test1@email.com',
      role: 'Developer',
      affiliation: 'No name company'
    }
    const memberId='new-contributor-id'
    const searchFor = `${newPerson.given_names} ${newPerson.family_names}`
    // mock software context state
    editSoftwareState.software = {
      id: 'test-software-id',
      slug: 'test-software-slug',
      brand_name: 'Test software title',
      concept_doi: ''
    }
    // resolve no contributors
    mockGetContributorsForSoftware.mockResolvedValueOnce([])
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
    mockPostContributor.mockResolvedValueOnce({
      status: 201,
      message: memberId
    })
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={editSoftwareState}>
          <SoftwareContributors />
        </WithSoftwareContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // find member
    const findMember = screen.getByRole('combobox', {
      name: config.findContributor.label
    })
    fireEvent.change(findMember, {target: {value: searchFor}})

    // find all options
    const options = await screen.findAllByRole('option')
    // we always offer add option
    expect(options.length).toEqual(mockSearchPerson.length + 1)

    // validate search called with proper param
    expect(mockFindRSDPerson).toBeCalledTimes(1)
    expect(mockFindRSDPerson).toBeCalledWith({
      'frontend': true,
      searchFor,
      'token': mockSession.token,
    })

    expect(mockGetORCID).toBeCalledTimes(1)
    expect(mockGetORCID).toBeCalledWith({
      searchFor
    })

    // select first option: "Add"
    const addBtn = options[0]
    expect(addBtn).toHaveTextContent(`Add "${searchFor}"`)
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

    await waitFor(() => {
      expect(saveBtn).toBeEnabled()
      fireEvent.click(saveBtn)
    })

    // validate api call
    await waitFor(() => {
      expect(mockPostContributor).toBeCalledTimes(1)
      expect(mockPostContributor).toBeCalledWith({
       'contributor': {
         'affiliation': newPerson.affiliation,
         'avatar_id': null,
         'email_address': newPerson.email,
         'family_names': newPerson.family_names,
         'given_names': newPerson.given_names,
         'id': memberId,
         'is_contact_person': true,
         'orcid': null,
         'position': 1,
         'software': editSoftwareState.software.id,
         'role': newPerson.role,
       },
       'token': mockSession.token,
      })
    })

    // validate list item loaded
    const contributors = await screen.findAllByTestId('contributor-item')
    expect(contributors.length).toEqual(1)
    expect(contributors[0]).toHaveTextContent(newPerson.family_names)
  })

  it('can import contributors', async() => {
    // mock software context state
    editSoftwareState.software = {
      id: 'test-software-id',
      slug: 'test-software-slug',
      brand_name: 'Test software title',
      concept_doi: '10.5281/zenodo.6379973'
    }

    // resolve no contributors
    mockGetContributorsForSoftware.mockResolvedValueOnce([])
    // resolve import request
    mockGetContributorsFromDoi.mockResolvedValueOnce(mockContributors)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={editSoftwareState}>
          <SoftwareContributors />
        </WithSoftwareContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // click import contributors
    const importBtn = screen.getByRole('button', {
      name: 'Import contributors'
    })
    fireEvent.click(importBtn)

    await waitForElementToBeRemoved(screen.getByTestId('circular-loader'))

    expect(mockGetContributorsFromDoi).toBeCalledTimes(1)
    expect(mockGetContributorsFromDoi).toHaveBeenCalledWith([
      editSoftwareState.software.id,
      editSoftwareState.software.concept_doi
    ])
  })

  it('can remove contributor', async() => {
    // mock software context state
    editSoftwareState.software = {
      id: 'test-software-id',
      slug: 'test-software-slug',
      brand_name: 'Test software title',
      concept_doi: ''
    }

    // resolve contributors
    mockGetContributorsForSoftware.mockResolvedValueOnce(mockContributors)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={editSoftwareState}>
          <SoftwareContributors />
        </WithSoftwareContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const contributors = screen.getAllByTestId('contributor-item')
    expect(contributors.length).toEqual(mockContributors.length)

    const deleteBtn = within(contributors[0]).getByRole('button', {
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
      expect(mockdeleteContributorsById).toBeCalledTimes(1)
      expect(mockdeleteContributorsById).toBeCalledWith({
        ids: [
          mockContributors[0].id
        ],
        token: mockSession.token
      })
    })
  })

  it('can remove avatar', async () => {
    // mock software context state
    editSoftwareState.software = {
      id: 'test-software-id',
      slug: 'test-software-slug',
      brand_name: 'Test software title',
      concept_doi: ''
    }
    const editedMember = {
      ...mockContributors[0],
      // we remove avatar id
      avatar_id: null,
      // software id received from software context
      software: editSoftwareState.software.id
    }
    // mock no members
    mockGetContributorsForSoftware.mockResolvedValueOnce(mockContributors)
    // mock patch contributor response
    mockPatchContributor.mockResolvedValueOnce({
      status: 200,
      message:'OK'
    })

    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={editSoftwareState}>
          <SoftwareContributors />
        </WithSoftwareContext>
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

    // click on remove image
    const removeImage = within(modal).getByRole('button', {
      name: 'remove'
    })

    await waitFor(() => {
      expect(removeImage).toBeEnabled()
      fireEvent.click(removeImage)
    })

    // save
    const saveBtn = within(modal).getByRole('button', {
      name:'Save'
    })

    await waitFor(() => {
      expect(saveBtn).toBeEnabled()
      fireEvent.click(saveBtn)
    })

    await waitFor(() => {
      // confirm patch contributor called
      expect(mockPatchContributor).toBeCalledTimes(1)
      expect(mockPatchContributor).toBeCalledWith({
        contributor: editedMember,
        token: mockSession.token
      })
      // validate delete image called
      expect(mockDeleteImage).toBeCalledTimes(1)
      expect(mockDeleteImage).toBeCalledWith({
        'id': mockContributors[0].avatar_id,
        'token': mockSession.token,
      })
    })
  })

  it('can CANCEL remove avatar (change)', async () => {
    // mock software context state
    editSoftwareState.software = {
      id: 'test-software-id',
      slug: 'test-software-slug',
      brand_name: 'Test software title',
      concept_doi: ''
    }
    // mock no members
    mockGetContributorsForSoftware.mockResolvedValueOnce(mockContributors)
    // mock patch contributor response
    mockPatchContributor.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })

    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={editSoftwareState}>
          <SoftwareContributors />
        </WithSoftwareContext>
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

    // click on remove image
    const removeImage = within(modal).getByRole('button', {
      name: 'remove'
    })
    await waitFor(() => {
      expect(removeImage).toBeEnabled()
      fireEvent.click(removeImage)
    })

    // save
    const saveBtn = within(modal).getByRole('button', {
      name:'Save'
    })
    // validate save is enabled
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
      expect(mockPatchContributor).toBeCalledTimes(0)
      // delete image NOT called
      expect(mockDeleteImage).toBeCalledTimes(0)
    })
  })

  it('can replace avatar image', async () => {
    const oldAvatarId = mockContributors[0].avatar_id
    const newAvatarId = 'new-avatar-test-id-with-length-10-or-more'
    const fileToUpload = 'test-file-name.png'
    const base64data = 'base64-encoded-image-content'
    const fileType = 'image/png'
    // mock software context state
    editSoftwareState.software = {
      id: 'test-software-id',
      slug: 'test-software-slug',
      brand_name: 'Test software title',
      concept_doi: ''
    }
    const editedMember = {
      ...mockContributors[0],
      // we have new avatar id
      avatar_id: newAvatarId,
      // software id received from software context
      software: editSoftwareState.software.id
    }
    // mock no members
    mockGetContributorsForSoftware.mockResolvedValueOnce(mockContributors)
    // mock patch
    mockPatchContributor.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })
    // mock image upload
    mockUpsertImage.mockResolvedValueOnce({
      status: 201,
      message: newAvatarId
    })

    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={editSoftwareState}>
          <SoftwareContributors />
        </WithSoftwareContext>
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
    expect(mockHandleFileUpload).toBeCalledTimes(1)

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
      expect(mockUpsertImage).toBeCalledTimes(1)
      expect(mockUpsertImage).toBeCalledWith({
        'data': base64data,
        'mime_type': fileType,
        'token': mockSession.token,
      })
      // confirm member patched called
      expect(mockPatchContributor).toBeCalledTimes(1)
      expect(mockPatchContributor).toBeCalledWith({
        contributor: editedMember,
        token: mockSession.token
      })
      // validate delete image called
      expect(mockDeleteImage).toBeCalledTimes(1)
      expect(mockDeleteImage).toBeCalledWith({
        'id': oldAvatarId,
        'token': mockSession.token,
      })
    })
  })

})
