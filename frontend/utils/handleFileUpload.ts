// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import logger from './logger'

type HandleFileUploadResponse = {
  status: number,
  message: string,
  image_b64: string|null,
  image_mime_type: string|null
}

// max file size ~ 2MB
export const maxFileSize = 2097152

export const allowedImageMimeTypes: string = 'image/avif,image/gif,image/jpeg,image/png,image/svg+xml,image/webp,image/x-icon'

export function handleFileUpload({target}: {target: any}): Promise<HandleFileUploadResponse>{
  return new Promise((res) => {
    try {
      if (typeof target==='undefined' || target===null) res({
        status: 400,
        message: 'Target element missing',
        image_b64: null,
        image_mime_type: null
      })
      // console.log('Upload files...',target.files)
      const file = target?.files[0] ?? null
      // if no file the upload is canceled
      if (typeof file === 'undefined' || file === null) res({
        status: 400,
        message: 'File not found / not provided',
        image_b64: null,
        image_mime_type: null
      })
      // check file size
      if (file.size > maxFileSize) {
        res({
          status: 413,
          message: 'The file is too large. Please select image < 2MB.',
          image_b64: null,
          image_mime_type: null
        })
      }
      const reader = new FileReader()
      // listen to onloadend event
      reader.onloadend = function () {
        if (reader.result) {
          res({
            status: 200,
            message: 'OK',
            image_b64: reader.result as string,
            image_mime_type: file.type
          })
        }
      }
      reader.readAsDataURL(file)
    } catch (e: any) {
      logger(`handleFileUpload: ${e.message}`, 'error')
      res({
        status: 500,
        message: `handleFileUpload: ${e.message}`,
        image_b64: null,
        image_mime_type: null
      })
    }
  })
}

export function showDialogAndGetFile(): Promise<HandleFileUploadResponse> {
  return new Promise((res, rej) => {
    try {
      const input = document.createElement('input')
      input.id = 'handle-file-upload-element'
      input.type = 'file'
      input.name = 'file-input-element'
      input.accept = allowedImageMimeTypes
      input.onchange = (e) => {
        // call file upload function
        handleFileUpload(e)
          .then(resp => res(resp))
          .catch(err=>rej(err))
          .finally(()=>{
            // remove input element
            // after file upload
            input.remove()
          })
      }
      // click on input element
      input.click()
    } catch (e: any) {
      logger(`handleInputAndFileUpload: ${e.message}`, 'error')
      res({
        status: 500,
        message: `handleInputAndFileUpload: ${e.message}`,
        image_b64: null,
        image_mime_type: null
      })
    }
  })
}
