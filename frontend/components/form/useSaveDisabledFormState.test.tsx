// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSaveDisabledFormState} from './useSaveDisabledFormState'

describe('useSaveDisabledFormState', () => {
  it('returns true when isValidating is true', () => {
    const result = useSaveDisabledFormState({isValidating: true})
    expect(result).toBe(true)
  })

  it('returns true when form is not dirty', () => {
    const result = useSaveDisabledFormState({isDirty: false})
    expect(result).toBe(true)
  })

  it('returns true when form is submitting', () => {
    const result = useSaveDisabledFormState({isDirty: true, isSubmitting: true})
    expect(result).toBe(true)
  })

  it('returns true when form is submitted', () => {
    const result = useSaveDisabledFormState({isDirty: true, isSubmitted: true})
    expect(result).toBe(true)
  })

  it('returns true when form is invalid', () => {
    const result = useSaveDisabledFormState({isDirty: true, isValid: false})
    expect(result).toBe(true)
  })

  it('returns false only when form is dirty, valid, and not processing', () => {
    const result = useSaveDisabledFormState({
      isValidating: false,
      isDirty: true,
      isSubmitting: false,
      isSubmitted: false,
      isValid: true,
    })
    expect(result).toBe(false)
  })
})
