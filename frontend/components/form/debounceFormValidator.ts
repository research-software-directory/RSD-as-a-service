// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ValidateResult} from 'react-hook-form'

// Shape of validation function
export type DebouncedValidationPayload<P> = P & {
  value: string;
}

// IMPORTANT! We allow only ONE instance of debouncedValidator
let timeoutId: ReturnType<typeof setTimeout> | undefined

/**
 * Factory for creating instance of debouceValidator to used in validate fn of react-hook-form.
 *
 * IMPORTANT! We allow only ONE instance of debouncedValidator at the time.
 * This means that only ONE input can use debounceValidator at time.
 * When new instance is created the previous timeout will be removed.
 * This constrain is set to prevent memory leaks in an highly reactive UI.
 * One input limit per form is sufficient for our current needs.
 * @param fn Function that does actual work
 * @param params Additional parameters that will be passed to function beside input value
 * @param delay Debounce time, defaults to 500ms
 * @returns Promise with react-hook-form results of type ValidateResult
 */
export function createDebounceValidator<P extends Record<string, any>>(
  fn:(payload: DebouncedValidationPayload<P>) => Promise<ValidateResult>,
  params:P,
  delay:number=500
){

  return (value: string) => {
    // clear the previous execution
    // if mode=onChange -> on every key stroke
    if (timeoutId) {
      // console.log('clear old interval...', timeoutId)
      clearTimeout(timeoutId)
    }

    // return promise to react-hook-form validate function
    return new Promise<ValidateResult>((res) => {
      // set timeout to desired debounce time
      timeoutId = setTimeout(() => {
        // console.log('call fn for...', value)
        res(
          fn({
            // pass additional fn parameters
            ...params,
            // pass the value received from react-hook-form validate fn
            value
          })
        )
      }, delay)
    })
  }
}
