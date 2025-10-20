// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {screen, render, fireEvent, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext,mockSession} from '~/utils/jest/WithAppContext'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'

import OrganisationLogo from './OrganisationLogo'


//  MOCKS
import mockOrganisation from '../__mocks__/mockOrganisation'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteImage = jest.fn((props) => Promise.resolve({status: 200, statusText: 'OK'}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUpsertImage = jest.fn((props) => Promise.resolve({status: 201, statusText: 'OK', message:''}))
jest.mock('~/utils/editImage', () => ({
  ...jest.requireActual('~/utils/editImage'),
  upsertImage: jest.fn((props)=>mockUpsertImage(props)),
  deleteImage: jest.fn((props)=>mockDeleteImage(props))
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchOrganisation = jest.fn((props) => Promise.resolve({status: 200, statusText: 'OK'}))
jest.mock('~/components/organisation/apiEditOrganisation', () => ({
  ...jest.requireActual('~/components/organisation/apiEditOrganisation'),
  patchOrganisation: jest.fn((props)=>mockPatchOrganisation(props))
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockFileUpload = jest.fn((props) => Promise.resolve({
  status: 200,
  message: 'OK',
  image_b64: 'png,test-b64-encoded-as-string',
  image_mime_type: 'image/png'
}))
jest.mock('~/utils/handleFileUpload', () => ({
  // handleFileUpload: jest.fn((props) => mockFileUpload(props)),
  showDialogAndGetFile: jest.fn((props) => mockFileUpload(props))
}))

const mockImg = {
  id: 'test-id',
  logo_id: 'test-logo-id',
  name: 'Test organisation name',
  isMaintainer: false
}

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

beforeEach(() => {
  jest.clearAllMocks()
})

it('renders avatar component', () => {
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithOrganisationContext {...mockProps}>
        <OrganisationLogo isMaintainer={mockProps.isMaintainer} />
      </WithOrganisationContext>
    </WithAppContext>
  )

  const avatar = screen.getByTestId('logo-avatar')
  expect(avatar).toBeInTheDocument()
  // avatar has title
  expect(avatar.title).toEqual(mockProps.organisation.name)
})

it('renders avatar image with url', () => {
  mockProps.organisation.logo_id = mockImg.logo_id
  const expectedUrl=`/image/rpc/get_image?uid=${mockProps.organisation.logo_id}`
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithOrganisationContext {...mockProps}>
        <OrganisationLogo isMaintainer={mockProps.isMaintainer} />
      </WithOrganisationContext>
    </WithAppContext>
  )

  // image has proper link
  const img = screen.getByRole('img')
  expect(img).toHaveAttribute('src',expectedUrl)
})

it('shows edit image buttons when isMaintainer=true', () => {
  mockProps.organisation.logo_id = mockImg.logo_id
  mockProps.isMaintainer = true
  render(
    <WithAppContext options={{session:mockSession}}>
      <WithOrganisationContext {...mockProps}>
        <OrganisationLogo isMaintainer={mockProps.isMaintainer} />
      </WithOrganisationContext>
    </WithAppContext>
  )

  // menu button
  const btnMenu = screen.getByTestId('icon-menu-button')
  fireEvent.click(btnMenu)

  // edit button
  const btnEdit = screen.getByRole('menuitem', {
    name: 'Change logo'
  })
  expect(btnEdit).toBeInTheDocument()
  // delete button
  const btnDelete = screen.getByRole('menuitem', {
    name: 'Remove logo'
  })
  expect(btnDelete).toBeInTheDocument()
  // screen.debug()
})

it('removes logo', async () => {
  mockProps.organisation.logo_id = mockImg.logo_id
  mockProps.isMaintainer = true
  render(
    <WithAppContext options={{session:mockSession}}>
      <WithOrganisationContext {...mockProps}>
        <OrganisationLogo isMaintainer={mockProps.isMaintainer} />
      </WithOrganisationContext>
    </WithAppContext>
  )

  // menu button
  const btnMenu = screen.getByTestId('icon-menu-button')
  fireEvent.click(btnMenu)

  // delete button
  const btnDelete = screen.getByRole('menuitem', {
    name: 'Remove logo'
  })
  expect(btnDelete).toBeInTheDocument()
  expect(btnDelete).toBeEnabled()

  // use remove logo button
  fireEvent.click(btnDelete)

  // validate patch call
  expect(mockPatchOrganisation).toHaveBeenCalledTimes(1)
  expect(mockPatchOrganisation).toHaveBeenCalledWith({
    'data': {
      'id': mockProps.organisation.id,
      'logo_id': null,
    },
    'token': mockSession.token,
  })

  // wait for image to be removed
  await waitForElementToBeRemoved(screen.getByRole('img'))

  // validate delete image api call
  expect(mockDeleteImage).toHaveBeenCalledTimes(1)
  expect(mockDeleteImage).toHaveBeenCalledWith({
    'id': mockProps.organisation.logo_id,
    'token': mockSession.token,
  })
})

it('can change the logo', async () => {
  // return image id as message prop
  mockProps.organisation.logo_id = 'mocked-image-id'
  mockUpsertImage.mockResolvedValueOnce({
    status: 201, statusText: 'OK', message: mockProps.organisation.logo_id
  })

  mockProps.isMaintainer = true
  // mockPatchOrganisation.mockResolvedValueOnce('OK')
  render(
    <WithAppContext options={{session:mockSession}}>
      <WithOrganisationContext {...mockProps}>
        <OrganisationLogo isMaintainer={mockProps.isMaintainer} />
      </WithOrganisationContext>
    </WithAppContext>
  )

  // menu button
  const btnMenu = screen.getByTestId('icon-menu-button')
  fireEvent.click(btnMenu)

  // edit button
  const btnEdit = screen.getByRole('menuitem', {
    name: 'Change logo'
  })
  fireEvent.click(btnEdit)

  // wait for image to be removed
  await waitFor(() => {
    const img = screen.getByRole('img')
    expect(img).toBeVisible()
  })

  // validate handleFileUpload call
  expect(mockFileUpload).toHaveBeenCalledTimes(1)

  // validate upsertImage call
  expect(mockUpsertImage).toHaveBeenCalledTimes(1)
  expect(mockUpsertImage).toHaveBeenCalledWith({
    'data': 'test-b64-encoded-as-string',
    'mime_type': 'image/png',
    'token': mockSession.token,
  })

  // validate patchOrganisation call
  expect(mockPatchOrganisation).toHaveBeenCalledTimes(1)
  expect(mockPatchOrganisation).toHaveBeenCalledWith({
    'data': {
      'id': mockProps.organisation.id,
      'logo_id': mockProps.organisation.logo_id,
    },
    'token': mockSession.token
  })
})
