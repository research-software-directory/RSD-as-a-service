// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState, useRef} from 'react'
import {
  Control, FieldValues,
  Path, useFormState,
  useWatch, UseFormSetError,
  UseFormClearErrors, get
} from 'react-hook-form'

export type AsyncValidatorFn<T> = (value: T) => Promise<string | boolean | undefined>

type UseAsyncFieldValidationOptions<TFieldValues extends FieldValues>={
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  setError: UseFormSetError<TFieldValues>
  clearErrors: UseFormClearErrors<TFieldValues>
  validatorFn: AsyncValidatorFn<any>
  delay?: number
}
/**
 * Custom async hook for react-form-hook input validation.
 * This hook is created to solve delay "problem" in react-form-hook
 * validation. Use this hook ONLY for async validations if you want to
 * avoid delay produced by react-hook-form validate function.
 * For sync validation you can use react-hook-form validate function.
 * This hook sets custom error with type `async` on error to notify react-hook-form about error.
 * Use isValidating (true/false) to show spinner to indicate to users that validation is taking place.
 * @param param0
 * @returns boolean
 */
export function useAsyncFieldValidation<TFieldValues extends FieldValues>({
  name, control,
  setError, clearErrors,
  validatorFn, delay = 500,
}: UseAsyncFieldValidationOptions<TFieldValues>) {
  const [isValidating, setIsValidating] = useState(false)
  const lastCheckedValue = useRef<any>(null)

  // Monitor the specific field value internally
  const value = useWatch({control, name})

  // Access the real-time form state
  const {errors, dirtyFields} = useFormState({control, name})

  // Use 'get' to safely parse flat paths from deep objects
  const fieldError = get(errors, name)
  const isDirty = !!get(dirtyFields, name)

  const hasSyncError = fieldError && fieldError.type !== 'async'

  useEffect(() => {
    // exit if sync errors exist or field hasn't been changed by the user
    if (hasSyncError || !isDirty) {
      setIsValidating(false)
      return
    }

    // avoid duplicate execution loops if value is static
    if (value === lastCheckedValue.current) {
      return
    }

    // handle empty fields silently (delegated to standard sync rules)
    if (!value) {
      clearErrors(name)
      lastCheckedValue.current = value
      setIsValidating(false)
      return
    }
    let abort = false
    setIsValidating(true)

    const timer = setTimeout(async () => {
      try {
        // call validation function
        const result = await validatorFn(value)

        if (abort) return
        // if result is (error) message from validation function
        if (result && typeof result === 'string') {
          // we pass error message to react-form-hook
          setError(name, {type: 'async', message: result})
        } else if (fieldError?.type === 'async') {
          // else we clear all errors from validated field
          clearErrors(name)
        }
        // cache last checked value
        lastCheckedValue.current = value
      } catch {
        if (abort) return
        // unexpected error
        setError(name, {type: 'async', message: 'Validation failed unexpectedly'})
      } finally {
        if (abort) return
        // flag validation is done
        setIsValidating(false)
      }
    }, delay)

    return () => {
      abort = true
      clearTimeout(timer)
    }
  }, [
    value, name, delay, validatorFn, isDirty,
    hasSyncError, fieldError?.type, setError,
    clearErrors
  ])

  return {
    isValidating
  }
}
