// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ComponentPropsWithoutRef} from 'react'

export type ScreenReaderMessage=string | {
  // prio controls when message is read:
  // polite -> after all other messages in the queue
  // assertive -> interrupts and reads message immediately
  prio: 'polite' | 'assertive',
  text: string
}

type StatusForReadersProps = {
  message: ScreenReaderMessage
} & ComponentPropsWithoutRef<'div'>

/**
 * a11y status announcer.
 * Provides status update to screen readers.
 * Default priority is polite and you can use text only.
 * To interrupt use object {prio:'assertive',text:'your important message'}
 * @param param0
 * @returns
 */
export default function StatusForReaders({message, ...props}:StatusForReadersProps) {

  if (!message) return null

  // normalize whether message is a string or an object
  const isObject = typeof message === 'object' && message !== null
  const notification = isObject ? message.text : message
  const priority = isObject ? message.prio : 'polite'

  // Skip rendering if the message text inside the object happens to be empty
  if (!notification) return null

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      {...props}
    >
      {notification}
    </div>
  )
}
