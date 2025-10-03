// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved, within, fireEvent, waitFor} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'

import {initialState as editSoftwareState} from '../context/editSoftwareContext'
import {modalConfig} from '~/components/person/config'
import {contributorInformation} from '../editSoftwareConfig'

import SoftwareContributors from '.'

// MOCKS
import mockContributors from './__mocks__/softwareContributors.json'
import mockSearchOptions from '~/components/person/__mocks__/searchForPersonOptions.json'

// MOCK getContributorsForSoftware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetContributorsForSoftware = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPostContributor = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchContributor = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteContributorsById = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchContributorPositions = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
jest.mock('./apiContributors', () => ({
  ...jest.requireActual('./apiContributors'),
  getContributorsForSoftware: jest.fn(props => mockGetContributorsForSoftware(props)),
  postContributor: jest.fn(props => mockPostContributor(props)),
  patchContributor: jest.fn(props => mockPatchContributor(props)),
  deleteContributorsById: jest.fn(props => mockDeleteContributorsById(props)),
  patchContributorPositions: jest.fn(props => mockPatchContributorPositions(props)),
}))

// MOCK searchForPerson
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSearchForPerson = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/components/person/searchForPerson', () => ({
  searchForPerson: jest.fn(props=>mockSearchForPerson(props))
}))
// MOCK useAggregatedPerson (use default)
jest.mock('~/components/person/useAggregatedPerson')

// MOCK getContributorsFromDoi
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetContributorsFromDoi = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/getInfoFromDatacite', () => ({
  getContributorsFromDoi: jest.fn((...props)=>mockGetContributorsFromDoi(props))
}))

// MOCK editImage methods
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

const mockImageData={
  image_b64: 'data:image/png;base64,base64-encoded-image-content',
  image_mime_type: 'image/png'
}

// MOCK handleFileUpload
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockHandleFileUpload = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK',
  ...mockImageData
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
    editSoftwareState.id='test-software-id'
    editSoftwareState.slug= 'test-software-slug'
    editSoftwareState.brand_name= 'Test software title'
    editSoftwareState.concept_doi= ''
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
    editSoftwareState.id='test-software-id'
    editSoftwareState.slug= 'test-software-slug'
    editSoftwareState.brand_name= 'Test software title'
    editSoftwareState.concept_doi= ''
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
    editSoftwareState.id='test-software-id'
    editSoftwareState.slug= 'test-software-slug'
    editSoftwareState.brand_name= 'Test software title'
    editSoftwareState.concept_doi= ''
    // resolve no contributors
    mockGetContributorsForSoftware.mockResolvedValueOnce([])
    // mock search options returned
    mockSearchForPerson.mockResolvedValueOnce(mockSearchOptions)
    // mock post response
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
      name: contributorInformation.findContributor.label
    })
    fireEvent.change(findMember, {target: {value: searchFor}})

    // find all options
    const options = await screen.findAllByRole('option')
    // we always offer add option
    expect(options.length).toEqual(mockSearchOptions.length + 1)

    // validate search called with proper param
    expect(mockSearchForPerson).toHaveBeenCalledTimes(1)
    expect(mockSearchForPerson).toHaveBeenCalledWith({
      searchFor,
      token: mockSession.token,
      include_orcid: true
    })

    // select first option: "Add"
    const addBtn = options[0]
    expect(addBtn).toHaveTextContent(`Add "${searchFor}"`)
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
      expect(saveBtn).toBeEnabled()
      fireEvent.click(saveBtn)
    })

    // validate api call
    await waitFor(() => {
      expect(mockPostContributor).toHaveBeenCalledTimes(1)
      expect(mockPostContributor).toHaveBeenCalledWith({
        'contributor': {
          'account': null,
          'affiliation': newPerson.affiliation,
          'avatar_id': null,
          'email_address': newPerson.email,
          'family_names': newPerson.family_names,
          'given_names': newPerson.given_names,
          'id': memberId,
          'is_contact_person': true,
          'orcid': null,
          'position': 1,
          'software': editSoftwareState.id,
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
    editSoftwareState.id='test-software-id'
    editSoftwareState.slug= 'test-software-slug'
    editSoftwareState.brand_name= 'Test software title'
    editSoftwareState.concept_doi= '10.5281/zenodo.6379973'

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

    expect(mockGetContributorsFromDoi).toHaveBeenCalledTimes(1)
    expect(mockGetContributorsFromDoi).toHaveBeenCalledWith([
      editSoftwareState.id,
      editSoftwareState.concept_doi
    ])
  })

  it('can remove contributor', async() => {
    // mock software context state
    editSoftwareState.id='test-software-id'
    editSoftwareState.slug= 'test-software-slug'
    editSoftwareState.brand_name= 'Test software title'
    editSoftwareState.concept_doi= ''

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
      expect(mockDeleteContributorsById).toHaveBeenCalledTimes(1)
      expect(mockDeleteContributorsById).toHaveBeenCalledWith({
        ids: [
          mockContributors[0].id
        ],
        token: mockSession.token
      })

      // confirm contributor removed from list
      const remainedContributors = screen.getAllByTestId('contributor-item')
      expect(remainedContributors.length).toEqual(contributors.length - 1)

      // confirm list position patched
      expect(mockPatchContributorPositions).toHaveBeenCalledTimes(1)

      // confirm avatar image tried to be removed
      if (mockContributors[0].avatar_id !== null) {
        expect(mockDeleteImage).toHaveBeenCalledTimes(1)
        expect(mockDeleteImage).toHaveBeenCalledWith({
          'id': mockContributors[0].avatar_id,
          'token': mockSession.token,
        })
      }

    })
  })

  it('can remove avatar', async () => {
    // mock software context state
    // mock software context state
    editSoftwareState.id='test-software-id'
    editSoftwareState.slug= 'test-software-slug'
    editSoftwareState.brand_name= 'Test software title'
    editSoftwareState.concept_doi= ''

    const editedMember = {
      ...mockContributors[0],
      // we remove avatar id
      avatar_id: null,
      // software id received from software context
      software: editSoftwareState.id
    }
    // mock return list of contributors
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
      // confirm patch contributor called
      expect(mockPatchContributor).toHaveBeenCalledTimes(1)
      expect(mockPatchContributor).toHaveBeenCalledWith({
        contributor: editedMember,
        token: mockSession.token
      })
      // validate delete image called
      expect(mockDeleteImage).toHaveBeenCalledTimes(1)
      expect(mockDeleteImage).toHaveBeenCalledWith({
        'id': mockContributors[0].avatar_id,
        'token': mockSession.token,
      })
    })
  })

  it('can CANCEL modal changes', async () => {
    // mock software context state
    editSoftwareState.id='test-software-id'
    editSoftwareState.slug= 'test-software-slug'
    editSoftwareState.brand_name= 'Test software title'
    editSoftwareState.concept_doi= ''
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

    // click on no image button
    const removeImage = within(modal).getByTestId('no-image-btn')
    fireEvent.click(removeImage)

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
      expect(mockPatchContributor).toHaveBeenCalledTimes(0)
      // delete image NOT called
      // expect(mockDeleteImage).toHaveBeenCalledTimes(0)
    })
  })

  it('can upload avatar image', async () => {
    const oldAvatarId = mockContributors[0].avatar_id
    const newAvatarId = 'new-avatar-test-id-with-length-10-or-more'
    const fileToUpload = 'test-file-name.png'
    // mock software context state
    editSoftwareState.id='test-software-id'
    editSoftwareState.slug= 'test-software-slug'
    editSoftwareState.brand_name= 'Test software title'
    editSoftwareState.concept_doi= ''

    const editedMember = {
      ...mockContributors[0],
      // we have new avatar id
      avatar_id: newAvatarId,
      // software id received from software context
      software: editSoftwareState.id,
    }
    // mock no members
    mockGetContributorsForSoftware.mockResolvedValueOnce(mockContributors)
    // mock patch
    mockPatchContributor.mockResolvedValueOnce({
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
      expect(mockPatchContributor).toHaveBeenCalledTimes(1)
      expect(mockPatchContributor).toHaveBeenCalledWith({
        contributor: editedMember,
        token: mockSession.token
      })
    })
  })
})
