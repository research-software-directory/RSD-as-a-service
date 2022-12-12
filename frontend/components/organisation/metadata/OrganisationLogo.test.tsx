// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {screen, render, fireEvent, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext,mockSession} from '~/utils/jest/WithAppContext'
import OrganisationLogo from './OrganisationLogo'


//  MOCKS
const mockDeleteImage = jest.fn((props) => Promise.resolve({status: 200, statusText: 'OK'}))
const mockUpsertImage = jest.fn((props) => Promise.resolve({status: 201, statusText: 'OK', message:''}))
jest.mock('~/utils/editImage', () => ({
  ...jest.requireActual('~/utils/editImage'),
  upsertImage: jest.fn((props)=>mockUpsertImage(props)),
  deleteImage: jest.fn((props)=>mockDeleteImage(props))
}))

const mockPatchOrganisation = jest.fn((props) => Promise.resolve({status: 200, statusText: 'OK'}))
jest.mock('~/utils/editOrganisation', () => ({
  ...jest.requireActual('~/utils/editOrganisation'),
  patchOrganisation: jest.fn((props)=>mockPatchOrganisation(props))
}))

const mockFileUpload = jest.fn((props) => Promise.resolve({
  status: 200,
  message: 'OK',
  image_b64: 'png,test-b64-encoded-as-string',
  image_mime_type: 'image/png'
}))
jest.mock('~/utils/handleFileUpload', () => ({
  handleFileUpload: jest.fn((props)=>mockFileUpload(props))
}))

const mockProps = {
  id: 'test-id',
  logo_id: 'test-logo-id',
  name: 'Test organisation name',
  isMaintainer: false
}


beforeEach(() => {
  jest.clearAllMocks()
})

it('renders avatar component', () => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <OrganisationLogo {...mockProps} />
    </WithAppContext>
  )

  const avatar = screen.getByTestId('logo-avatar')
  expect(avatar).toBeInTheDocument()
  // avatar has title
  expect(avatar.title).toEqual(mockProps.name)
})

it('renders avatar image with url', () => {
  const expectedUrl=`/image/rpc/get_image?uid=${mockProps.logo_id}`
  render(
    <WithAppContext options={{session:mockSession}}>
      <OrganisationLogo {...mockProps} />
    </WithAppContext>
  )

  // image has proper link
  const img = screen.getByRole('img')
  expect(img).toHaveAttribute('src',expectedUrl)
})

it('shows edit image buttons when isMaintainer=true', () => {
  mockProps.isMaintainer=true
  render(
    <WithAppContext options={{session:mockSession}}>
      <OrganisationLogo {...mockProps} />
    </WithAppContext>
  )

  // edit button
  const btnEdit = screen.getByRole('button', {
    name: 'Change logo'
  })
  expect(btnEdit).toBeInTheDocument()
  // delete button
  const btnDelete = screen.getByRole('button', {
    name: 'Remove logo'
  })
  expect(btnDelete).toBeInTheDocument()
  // screen.debug()
})

it('removes logo', async() => {
  mockProps.isMaintainer = true
  // mockPatchOrganisation.mockResolvedValueOnce('OK')
  render(
    <WithAppContext options={{session:mockSession}}>
      <OrganisationLogo {...mockProps} />
    </WithAppContext>
  )

  // delete button
  const btnDelete = screen.getByRole('button', {
    name: 'Remove logo'
  })
  expect(btnDelete).toBeInTheDocument()
  expect(btnDelete).toBeEnabled()

  // use remove logo button
  fireEvent.click(btnDelete)

  // validate patch call
  expect(mockPatchOrganisation).toBeCalledTimes(1)
  expect(mockPatchOrganisation).toBeCalledWith({
    'data': {
      'id': mockProps.id,
      'logo_id': null,
    },
    'token': mockSession.token,
  })

  // wait for image to be removed
  await waitForElementToBeRemoved(screen.getByRole('img'))

  // validate delete image api call
  expect(mockDeleteImage).toBeCalledTimes(1)
  expect(mockDeleteImage).toBeCalledWith({
    'id': mockProps.logo_id,
    'token': mockSession.token,
  })
})

it('uploads the logo', async () => {
  // return image id as message prop
  const mockImageId = 'mocked-image-id'
  mockUpsertImage.mockResolvedValueOnce({
    status: 201, statusText: 'OK', message: mockImageId
  })
  const mockFile = new File(
    ['some content'],
    'mock-file-name.png',
    {
      type: 'image/png',
    })

  mockProps.isMaintainer = true
  // mockPatchOrganisation.mockResolvedValueOnce('OK')
  render(
    <WithAppContext options={{session:mockSession}}>
      <OrganisationLogo {...mockProps} />
    </WithAppContext>
  )

  // fileinput
  const fileInput = screen.getByTestId('organisation-logo-input')
  expect(fileInput).toBeInTheDocument()

  // add file to upload
  fireEvent.change(fileInput,{target:{files:[mockFile]}})

  // wait for image to be removed
  await waitFor(() => {
    const img = screen.getByRole('img')
    expect(img).toBeVisible()
  })

  // validate handleFileUpload call
  expect(mockFileUpload).toBeCalledTimes(1)

  // validate upserImage call
  expect(mockUpsertImage).toBeCalledTimes(1)
  expect(mockUpsertImage).toBeCalledWith({
    'data': 'test-b64-encoded-as-string',
    'mime_type': 'image/png',
    'token': mockSession.token,
  })

  // validate patchOrganisation call
  expect(mockPatchOrganisation).toBeCalledTimes(1)
  expect(mockPatchOrganisation).toBeCalledWith({
    'data': {
      'id': mockProps.id,
      'logo_id': mockImageId,
    },
    'token': mockSession.token
  })
})
