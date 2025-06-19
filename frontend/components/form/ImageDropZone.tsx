// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type ImageDropZoneProps = {
  children: React.ReactNode,
  onImageDrop: (targetLike: {target: {files: FileList | Blob[]}}) => void
}

export default function ImageDropZone(props: Readonly<ImageDropZoneProps>) {
  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault()
        if (e.dataTransfer.files.length) {
          props.onImageDrop({target: {files: e.dataTransfer.files}})
        } else if (e.dataTransfer.getData('text/uri-list')) {
          fetch(e.dataTransfer.getData('text/uri-list'))
            .then(resp => resp.blob())
            .then(blob => props.onImageDrop({target: {files: [blob]}}))
        }
      }}>
      {props.children}
    </div>
  )
}
