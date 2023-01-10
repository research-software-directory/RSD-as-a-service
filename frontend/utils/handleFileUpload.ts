// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
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

export function handleFileUpload({target}: { target: any }): Promise<HandleFileUploadResponse>{
  return new Promise((res, rej) => {
    try {
      if (typeof target==='undefined' || target===null) res({
        status: 400,
        message: 'Target element missing',
        image_b64: null,
        image_mime_type: null
      })
      // console.log('Upload files...',target.files)
      let file = target?.files[0] ?? null
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
      let reader = new FileReader()
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
