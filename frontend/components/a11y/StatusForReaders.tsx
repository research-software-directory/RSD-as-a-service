// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ComponentPropsWithoutRef} from 'react'

type StatusForReadersProps = {
  message: string
} & ComponentPropsWithoutRef<'div'>

/**
 * a11y status announcer
 * provides polite status update to screen readers
 * @param param0
 * @returns
 */
export default function StatusForReaders({message, ...props}:StatusForReadersProps) {

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      {...props}
    >
      {message}
    </div>
  )
}
