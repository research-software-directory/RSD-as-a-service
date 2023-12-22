// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {handleFileUpload, maxFileSize} from './handleFileUpload'


it('returns status 400 when target undefined', async() => {
  const props = {}
  const resp = await handleFileUpload(props as any)

  expect(resp).toEqual({
    status: 400,
    'image_b64': null,
    'image_mime_type': null,
    'message': 'Target element missing',
  })
})

it('returns 500 when files undefined', async () => {
  const props = {target:{}}
  const resp = await handleFileUpload(props as any)

  expect(resp).toEqual({
    status: 500,
    'image_b64': null,
    'image_mime_type': null,
    'message': 'handleFileUpload: Cannot read properties of undefined (reading \'0\')',
  })
})

it('returns 400 when files array empty', async () => {
  const props = {target: {files:[]}}
  const resp = await handleFileUpload(props as any)

  expect(resp).toEqual({
    status: 400,
    'image_b64': null,
    'image_mime_type': null,
    'message': 'File not found / not provided',
  })
})

it('returns 413 when file exceeds maxFileSize', async () => {
  const props = {
    target: {
      files: [
        {size: maxFileSize + 1},
      ],
      other: 1,
    },
  }
  const resp = await handleFileUpload(props as any)

  expect(resp).toEqual({
    status: 413,
    'image_b64': null,
    'image_mime_type': null,
    'message': 'The file is too large. Please select image < 2MB.',
  })
})
