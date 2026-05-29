// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {InputHTMLAttributes, RefObject} from 'react'
import {allowedImageMimeTypes} from '~/utils/handleFileUpload'

type ImageInputProps = Readonly<Omit<InputHTMLAttributes<HTMLInputElement>, 'accept' | 'style' | 'type'> & {
  // Add inputRef type
  inputRef: RefObject<HTMLInputElement | null>
}>

export default function ImageInput({inputRef, ...props}:ImageInputProps) {
  return (
    <input
      id="image-input"
      type="file"
      ref={inputRef}
      style={{display:'none'}}
      accept={allowedImageMimeTypes}
      {...props}
    />
  )
}
