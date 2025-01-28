// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// not sure why I need to import jest-dom here while it is imported in the setup too
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'

import AutosaveSoftwareLogo from './AutosaveSoftwareLogo'

//MOCK patchSoftwareTable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchSoftwareTable = jest.fn(props => Promise.resolve('OK' as any))
jest.mock('./patchSoftwareTable', () => ({
  patchSoftwareTable: jest.fn(props=>mockPatchSoftwareTable(props))
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

it('renders image with proper src value', () => {
  const formValues = {
    id: 'software-test-id',
    image_id: 'any-string-id-longer-than-10-positions',
    image_b64: null,
    image_mime_type: null
  }

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithFormContext defaultValues={formValues}>
        <AutosaveSoftwareLogo />
      </WithFormContext>
    </WithAppContext>
  )

  const img = screen.getByRole('img')
  expect(img).toHaveAttribute('src',`/image/rpc/get_image?uid=${formValues.image_id}`)
})

it('can upload image', async() => {
  // mocked values
  const fileToUpload = 'test-file-name.png'
  const base64data = 'base64-encoded-image-content'
  const fileType = 'image/png'
  const newImageId = 'new-uploaded-image-id'

  const formValues = {
    id: 'software-test-id',
    image_id: null,
    image_b64: null,
    image_mime_type: null
  }

  mockUpsertImage.mockResolvedValueOnce({
    status: 201,
    message: newImageId
  })

  const {container} = render(
    <WithAppContext options={{session: mockSession}}>
      <WithFormContext defaultValues={formValues}>
        <AutosaveSoftwareLogo />
      </WithFormContext>
    </WithAppContext>
  )

  // expect upload image
  screen.getByTestId('PhotoSizeSelectActualOutlinedIcon')

  // simulate upload action
  const imageInput:any = container.querySelector('#upload-software-logo')
  // set file to upload
  fireEvent.change(imageInput, {target: {file: fileToUpload}})

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
    expect(mockPatchSoftwareTable).toHaveBeenCalledTimes(1)
    expect(mockPatchSoftwareTable).toHaveBeenCalledWith({
      'data': {
        'image_id': newImageId,
      },
      'id': formValues.id,
      'token': mockSession.token,
    })
  })
})

it('can replace existing image', async() => {
  // mocked values
  const fileToUpload = 'test-file-name.png'
  const base64data = 'base64-encoded-image-content'
  const fileType = 'image/png'
  const newImageId = 'new-uploaded-image-id'
  const oldImageId = 'old-image-id'
  const formValues = {
    id: 'software-test-id',
    image_id: oldImageId,
    image_b64: null,
    image_mime_type: null
  }

  // resolve file upload api
  mockHandleFileUpload.mockResolvedValueOnce({
    status: 200,
    message: 'OK',
    image_b64: `png,${base64data}`,
    image_mime_type: fileType
  })
  // resolve removing old image
  mockPatchSoftwareTable.mockResolvedValueOnce({
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
      <WithFormContext defaultValues={formValues}>
        <AutosaveSoftwareLogo />
      </WithFormContext>
    </WithAppContext>
  )

  // simulate upload action
  const imageInput:any = container.querySelector('#upload-software-logo')
  // set file to upload
  fireEvent.change(imageInput, {target: {file: fileToUpload}})

  // expect file upload to be called
  expect(mockHandleFileUpload).toHaveBeenCalledTimes(1)

  await waitFor(() => {
    // patchProject table 2 calls
    expect(mockPatchSoftwareTable).toHaveBeenCalledTimes(2)
    // first call to remove old image
    expect(mockPatchSoftwareTable).toHaveBeenCalledWith({
      'data': {
        'image_id': null,
      },
      'id': formValues.id,
      'token': mockSession.token,
    })
    // second call to save new image
    expect(mockPatchSoftwareTable).toHaveBeenCalledWith({
      'data': {
        'image_id': newImageId,
      },
      'id': formValues.id,
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

it('can delete existing image', async() => {
  const oldImageId = 'old-image-id'
  const formValues = {
    id: 'software-test-id',
    image_id: oldImageId,
    image_b64: null,
    image_mime_type: null
  }

  mockPatchSoftwareTable.mockResolvedValueOnce({
    status: 200,
    message: 'OK'
  })

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithFormContext defaultValues={formValues}>
        <AutosaveSoftwareLogo />
      </WithFormContext>
    </WithAppContext>
  )

  // get image as background component
  const deleteBtn = screen.getByRole('button', {
    // can find aria-label as name
    name: 'Delete logo'
  })

  fireEvent.click(deleteBtn)

  // remove image reference in project table
  expect(mockPatchSoftwareTable).toHaveBeenCalledTimes(1)
  expect(mockPatchSoftwareTable).toHaveBeenCalledWith({
    'data': {
      'image_id': null,
    },
    'id': formValues.id,
    'token': mockSession.token,
  })

  // we need to await prevoius calls to complete
  await waitFor(() => {
    // try to remove image
    expect(mockDeleteImage).toHaveBeenCalledTimes(1)
    expect(mockDeleteImage).toHaveBeenCalledWith({
      'id': formValues.image_id,
      'token': mockSession.token,
    })
  })
})
