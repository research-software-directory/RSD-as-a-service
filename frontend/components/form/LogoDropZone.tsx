// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ImageDataProps} from '~/components/layout/Logo'
import logger from '~/utils/logger'
import useSnackbar from '~/components/snackbar/useSnackbar'

export type ImageDropZoneProps = {
  children: React.ReactNode,
  onImageDrop: (image: ImageDataProps) => any
}

export default function LogoDropZone(props: Readonly<ImageDropZoneProps>) {
  const {showErrorMessage} = useSnackbar()

  return (
    <div
      onDragOver={(e: any) => {
        e.preventDefault()
        e.currentTarget.style.border = '3px dashed grey'
      }}
      onDragLeave={(e: any) => {
        e.currentTarget.style.border = 'inherit'
      }}
      onDrop={(e: any) => {
        e.currentTarget.style.border = 'inherit'
        e.preventDefault()
        const reader = new FileReader()

        if (e.dataTransfer.files.length) {
          const file = e.dataTransfer.files[0]
          reader.onloadend = () => {
            props.onImageDrop({data: reader.result as string, mime_type: file.type})
          }
          reader.readAsDataURL(file)
        } else if (e.dataTransfer.getData('text/uri-list')) {
          fetch(e.dataTransfer.getData('text/uri-list'))
            .then(resp => resp.blob())
            .then(blob => {
              reader.onloadend = () => {
                props.onImageDrop({data: reader.result as string, mime_type: blob.type})
              }
              reader.readAsDataURL(blob)
            })
            .catch(e => {
              logger(e, 'error')
              showErrorMessage('Could not download image, try downloading and uploading it manually.')
            })
        }
      }}>
      {props.children}
    </div>
  )
}
