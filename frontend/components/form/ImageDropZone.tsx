// SPDX-FileCopyrightText: 2025 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import useSnackbar from '~/components/snackbar/useSnackbar'

export type ImageDropZoneProps = Readonly<{
  children: React.ReactNode,
  ariaLabel: string,
  onImageDrop: (targetLike: {target: {files: FileList | Blob[]}}) => void,
  onClick: () => void
}>

/**
 * This component should be used in the areas where no additional menu is required.
 * The component enables upload for everyone. If you need image upload component
 * which dynamically shows upload menu use <Logo> component!
 * @param props
 * @returns
 */
export default function ImageDropZone(props:ImageDropZoneProps) {
  const {showErrorMessage} = useSnackbar()

  return (
    <button
      // Critical for focus and button functionality
      type="button"
      aria-label={props.ariaLabel}
      // Tailwind utility resets default button styles and handles focus
      className="text-left block bg-transparent border-0 p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      onClick={props.onClick}
      onDragOver={(e: any) => {
        e.preventDefault()
        e.currentTarget.style.outline = '2px dashed var(--rsd-base-content, grey)'
      }}
      onDragLeave={(e: any) => {
        e.currentTarget.style.outline = 'inherit'
      }}
      onDrop={(e: any) => {
        e.currentTarget.style.outline = 'inherit'
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
    </button>
  )
}
