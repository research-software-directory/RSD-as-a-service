// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'

import AutosaveProjectImage from './AutosaveProjectImage'
import {projectInformation as config} from './config'
import projectState from '../__mocks__/editProjectState'

// MOCKS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchProjectTable = jest.fn(props => Promise.resolve({
  status: 200, message: 'OK'
}))
jest.mock('./patchProjectInfo', () => ({
  patchProjectTable: jest.fn(props=>mockPatchProjectTable(props))
}))

// MOCK editImage methods
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteImage = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUpsertImage = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'uploaded-image-id'
}))
jest.mock('~/utils/editImage', () => ({
  ...jest.requireActual('~/utils/editImage'),
  deleteImage: jest.fn(props => mockDeleteImage(props)),
  upsertImage: jest.fn(props => mockUpsertImage(props))
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockHandleFileUpload = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK',
  image_b64: 'png,base64-encoded-image-content',
  image_mime_type: 'image/png'
}))
jest.mock('~/utils/handleFileUpload', () => ({
  handleFileUpload: jest.fn(props=>mockHandleFileUpload(props))
}))

beforeEach(() => {
  jest.clearAllMocks()
})

it('renders upload image inputs', () => {
  const {container} = render(
    <WithAppContext options={{session:mockSession}}>
      <WithFormContext>
        <AutosaveProjectImage />
      </WithFormContext>
    </WithAppContext>
  )

  // has image caption
  screen.getByRole('textbox',{name:'Image caption'})
  // has contain switch
  screen.getByRole('switch', {
    name: config.image_contain.label
  })
  // has input for file
  const imageInput = container.querySelector('#upload-avatar-image')
  expect(imageInput).toBeInTheDocument()
  // has click to upload message
  const clickToUpload = screen.getByText('Click or drop to upload image < 2MB')
  expect(clickToUpload).toBeInTheDocument()
})

it('saves image caption', () => {
  const expectedValue = 'Test caption value'
  const defaultValues = {
    id: projectState.id,
    slug: projectState.slug
  }
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithProjectContext state={projectState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveProjectImage />
        </WithFormContext>
      </WithProjectContext>
    </WithAppContext>
  )
  // has image caption
  const imageCaption = screen.getByRole('textbox',{name:'Image caption'})
  // provide value
  fireEvent.change(imageCaption,{target:{value:expectedValue}})
  // fire onBlur event to save
  fireEvent.blur(imageCaption)

  expect(mockPatchProjectTable).toHaveBeenCalledTimes(1)
  expect(mockPatchProjectTable).toHaveBeenCalledWith({
    'data': {
      'image_caption': expectedValue,
    },
    'id': defaultValues.id,
    'token': mockSession.token,
  })
})

it('set contain image to true', () => {
  const defaultValues = {
    id: projectState.id,
    slug: projectState.slug
  }
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithProjectContext state={projectState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveProjectImage />
        </WithFormContext>
      </WithProjectContext>
    </WithAppContext>
  )

  // has contain switch
  const containSwitch = screen.getByRole('switch', {
    name: config.image_contain.label
  })
  // click on switch (set to true)
  fireEvent.click(containSwitch)

  expect(mockPatchProjectTable).toHaveBeenCalledTimes(1)
  expect(mockPatchProjectTable).toHaveBeenCalledWith({
    'data': {
      'image_contain': true,
    },
    'id': defaultValues.id,
    'token': mockSession.token,
  })
})

it('shows image as background', () => {
  const defaultValues = {
    id: projectState.id,
    slug: projectState.slug,
    image_id: 'any-string-id-longer-than-10-positions'
  }
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithProjectContext state={projectState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveProjectImage />
        </WithFormContext>
      </WithProjectContext>
    </WithAppContext>
  )

  // get image as background component
  const imgAsBg = screen.getByTestId('image-as-background')
  expect(imgAsBg).toBeInTheDocument()
  // validate style has image_id provided
  expect(imgAsBg).toHaveStyle(`background-image: url(/image/rpc/get_image?uid=${defaultValues.image_id});`)
})

it('can delete existing image', async() => {
  const defaultValues = {
    id: projectState.id,
    slug: projectState.slug,
    image_id: 'any-string-id-longer-than-10-positions'
  }

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithProjectContext state={projectState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveProjectImage />
        </WithFormContext>
      </WithProjectContext>
    </WithAppContext>
  )

  // get image as background component
  const deleteBtn = screen.getByRole('button', {
    // can find aria-label as name
    name: 'remove picture'
  })

  fireEvent.click(deleteBtn)

  // remove image reference in project table
  expect(mockPatchProjectTable).toHaveBeenCalledTimes(1)
  expect(mockPatchProjectTable).toHaveBeenCalledWith({
    'data': {
      'image_caption': null,
      'image_contain': false,
      'image_id': null,
    },
    'id': defaultValues.id,
    'token': mockSession.token,
  })

  // we need to await prevoius calls to complete
  await waitFor(() => {
    // try to remove image
    expect(mockDeleteImage).toHaveBeenCalledTimes(1)
    expect(mockDeleteImage).toHaveBeenCalledWith({
      'id': defaultValues.image_id,
      'token': mockSession.token,
    })
  })
})

it('can upload new image', async () => {
  // mocked values
  const fileToUpload = 'test-file-name.png'
  const base64data = 'base64-encoded-image-content'
  const fileType = 'image/png'
  const newImageId = 'new-uploaded-image-id'
  const defaultValues = {
    id: projectState.id,
    slug: projectState.slug,
    image_id: null
  }

  // resolve file upload api
  mockHandleFileUpload.mockResolvedValueOnce({
    status: 200,
    message: 'OK',
    image_b64: `png,${base64data}`,
    image_mime_type: fileType
  })
  // resolve file upsert with specific id
  mockUpsertImage.mockResolvedValueOnce({
    status: 201,
    message: newImageId
  })
  const {container} = render(
    <WithAppContext options={{session: mockSession}}>
      <WithProjectContext state={projectState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveProjectImage />
        </WithFormContext>
      </WithProjectContext>
    </WithAppContext>
  )

  // has input for file
  const imageInput:any = container.querySelector('#upload-avatar-image')
  // set file to upload
  fireEvent.change(imageInput, {target: {file:fileToUpload}})
  // expect file upload to be called
  expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)

  await waitFor(() => {
    // upload image
    expect(mockUpsertImage).toHaveBeenCalledTimes(1)
    expect(mockUpsertImage).toHaveBeenCalledWith({
      'data': base64data,
      'mime_type': fileType,
      'token': mockSession.token,
    })

    // save as project image
    expect(mockPatchProjectTable).toHaveBeenCalledTimes(1)
    expect(mockPatchProjectTable).toHaveBeenCalledWith({
      'data': {
        'image_id': newImageId,
      },
      'id': projectState.id,
      'token': mockSession.token,
    })
  })
})

it('can replace existing image', async () => {
  // mocked values
  const fileToUpload = 'test-file-name.png'
  const base64data = 'base64-encoded-image-content'
  const fileType = 'image/png'
  const newImageId = 'new-uploaded-image-id'
  const oldImageId = 'old-image-id'
  const defaultValues = {
    id: projectState.id,
    slug: projectState.slug,
    image_id: oldImageId
  }

  // resolve file upload api
  mockHandleFileUpload.mockResolvedValueOnce({
    status: 200,
    message: 'OK',
    image_b64: `png,${base64data}`,
    image_mime_type: fileType
  })
  // resolve removing old image
  mockPatchProjectTable.mockResolvedValueOnce({
    status: 200,
    message: 'OK'
  })
  // resolve file upsert with specific id
  mockUpsertImage.mockResolvedValueOnce({
    status: 201,
    message: newImageId
  })
  const {container} = render(
    <WithAppContext options={{session: mockSession}}>
      <WithProjectContext state={projectState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveProjectImage />
        </WithFormContext>
      </WithProjectContext>
    </WithAppContext>
  )

  // has input for file
  const imageInput:any = container.querySelector('#upload-avatar-image')
  // set file to upload
  fireEvent.change(imageInput, {target: {file:fileToUpload}})
  // expect file upload to be called
  expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)

  await waitFor(() => {
    // patchProject table 2 calls
    expect(mockPatchProjectTable).toHaveBeenCalledTimes(2)
    // first call to remove old image
    expect(mockPatchProjectTable).toHaveBeenCalledWith({
      'data': {
        'image_id': null,
      },
      'id': projectState.id,
      'token': mockSession.token,
    })
    // second call to save new image
    expect(mockPatchProjectTable).toHaveBeenCalledWith({
      'data': {
        'image_id': newImageId,
      },
      'id': projectState.id,
      'token': mockSession.token,
    })
    // delete old image
    expect(mockDeleteImage).toHaveBeenCalledTimes(1)
    expect(mockDeleteImage).toHaveBeenCalledWith({
      'id': oldImageId,
      'token': mockSession.token,
    })
    // upload image call
    expect(mockUpsertImage).toHaveBeenCalledTimes(1)
    expect(mockUpsertImage).toHaveBeenCalledWith({
      'data': base64data,
      'mime_type': fileType,
      'token': mockSession.token,
    })
  })
})
