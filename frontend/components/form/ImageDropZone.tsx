// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import useSnackbar from '~/components/snackbar/useSnackbar'

export type ImageDropZoneProps = {
  children: React.ReactNode,
  onImageDrop: (targetLike: {target: {files: FileList | Blob[]}}) => void
}

export default function ImageDropZone(props: Readonly<ImageDropZoneProps>) {
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
        if (e.dataTransfer.files.length) {
          props.onImageDrop({target: {files: e.dataTransfer.files}})
        } else if (e.dataTransfer.getData('text/uri-list')) {
          fetch(e.dataTransfer.getData('text/uri-list'))
            .then(resp => resp.blob())
            .then(blob => props.onImageDrop({target: {files: [blob]}}))
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
