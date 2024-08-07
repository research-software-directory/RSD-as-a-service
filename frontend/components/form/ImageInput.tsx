// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {InputHTMLAttributes} from 'react'
import {allowedImageMimeTypes} from '~/utils/handleFileUpload'

type ImageInputProps = Omit<InputHTMLAttributes<HTMLInputElement>,'accept'|'style'|'type'>

export default function ImageInput(props:Readonly<ImageInputProps>) {
  return (
    <input
      id="image-input"
      type="file"
      style={{display:'none'}}
      accept={allowedImageMimeTypes}
      {...props}
    />
  )
}
