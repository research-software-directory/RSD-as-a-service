// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'
import {EditProjectState} from '../editProjectContext'

import AutosaveProjectImage from './AutosaveProjectImage'
import {projectInformation as config} from './config'

// MOCKS
const mockPatchProjectTable = jest.fn(props => Promise.resolve({
  status: 200, message: 'OK'
}))
jest.mock('./patchProjectInfo', () => ({
  patchProjectTable: jest.fn(props=>mockPatchProjectTable(props))
}))

// MOCK editImage methods
const mockDeleteImage = jest.fn(props => Promise.resolve([] as any))
const mockUpsertImage = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'uploaded-image-id'
}))
jest.mock('~/utils/editImage', () => ({
  ...jest.requireActual('~/utils/editImage'),
  deleteImage: jest.fn(props => mockDeleteImage(props)),
  upsertImage: jest.fn(props => mockUpsertImage(props))
}))
const mockHandleFileUpload = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK',
  image_b64: 'png,base64-encoded-image-content',
  image_mime_type: 'image/png'
}))
jest.mock('~/utils/handleFileUpload', () => ({
  handleFileUpload: jest.fn(props=>mockHandleFileUpload(props))
}))

// MOCK project state
const projectState: EditProjectState = {
  step: undefined,
  project: {
    id: 'test-id',
    slug: 'test-slug',
    title: 'Test project'
  },
  loading: true
}

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
  const imageCaption = screen.getByPlaceholderText('Image caption')
  // has contain switch
  const containSwitch = screen.getByRole('checkbox', {
    name: config.image_contain.label
  })
  // has input for file
  const imageInput = container.querySelector('#upload-avatar-image')
  expect(imageInput).toBeInTheDocument()
  // has click to upload message
  const clickToUpload = screen.getByText('Click to upload image < 2MB')
  expect(clickToUpload).toBeInTheDocument()
})

it('saves image caption', () => {
  const expectedValue = 'Test caption value'
  const defaultValues = {
    id: projectState.project.id,
    slug: projectState.project.slug
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
  const imageCaption = screen.getByPlaceholderText('Image caption')
  // provide value
  fireEvent.change(imageCaption,{target:{value:expectedValue}})
  // fire onBlur event to save
  fireEvent.blur(imageCaption)

  expect(mockPatchProjectTable).toBeCalledTimes(1)
  expect(mockPatchProjectTable).toBeCalledWith({
    'data': {
      'image_caption': expectedValue,
    },
    'id': defaultValues.id,
    'token': mockSession.token,
  })
})

it('set contain image to true', () => {
  const expectedValue = 'Test caption value'
  const defaultValues = {
    id: projectState.project.id,
    slug: projectState.project.slug
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
  const containSwitch = screen.getByRole('checkbox', {
    name: config.image_contain.label
  })
  // click on switch (set to true)
  fireEvent.click(containSwitch)

  expect(mockPatchProjectTable).toBeCalledTimes(1)
  expect(mockPatchProjectTable).toBeCalledWith({
    'data': {
      'image_contain': true,
    },
    'id': defaultValues.id,
    'token': mockSession.token,
  })
})

it('shows image as background', () => {
  const defaultValues = {
    id: projectState.project.id,
    slug: projectState.project.slug,
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
    id: projectState.project.id,
    slug: projectState.project.slug,
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
  expect(mockPatchProjectTable).toBeCalledTimes(1)
  expect(mockPatchProjectTable).toBeCalledWith({
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
    expect(mockDeleteImage).toBeCalledTimes(1)
    expect(mockDeleteImage).toBeCalledWith({
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
    id: projectState.project.id,
    slug: projectState.project.slug,
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
  expect(mockHandleFileUpload).toBeCalledTimes(1)

  await waitFor(() => {
    // upload image
    expect(mockUpsertImage).toBeCalledTimes(1)
    expect(mockUpsertImage).toBeCalledWith({
      'data': base64data,
      'mime_type': fileType,
      'token': mockSession.token,
    })

    // save as project image
    expect(mockPatchProjectTable).toBeCalledTimes(1)
    expect(mockPatchProjectTable).toBeCalledWith({
      'data': {
        'image_id': newImageId,
      },
      'id': projectState.project.id,
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
    id: projectState.project.id,
    slug: projectState.project.slug,
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
  expect(mockHandleFileUpload).toBeCalledTimes(1)

  await waitFor(() => {
    // patchProject table 2 calls
    expect(mockPatchProjectTable).toBeCalledTimes(2)
    // first call to remove old image
    expect(mockPatchProjectTable).toBeCalledWith({
      'data': {
        'image_id': null,
        },
      'id': projectState.project.id,
      'token': mockSession.token,
    })
    // second call to save new image
    expect(mockPatchProjectTable).toBeCalledWith({
      'data': {
        'image_id': newImageId,
      },
      'id': projectState.project.id,
      'token': mockSession.token,
    })
    // delete old image
    expect(mockDeleteImage).toBeCalledTimes(1)
    expect(mockDeleteImage).toBeCalledWith({
      'id': oldImageId,
      'token': mockSession.token,
    })
    // upload image call
    expect(mockUpsertImage).toBeCalledTimes(1)
    expect(mockUpsertImage).toBeCalledWith({
      'data': base64data,
      'mime_type': fileType,
      'token': mockSession.token,
    })
  })
})
