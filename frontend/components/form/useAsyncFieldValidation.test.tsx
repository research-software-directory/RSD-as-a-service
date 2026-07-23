// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// Tests written by Google AI mode
// adapted slightly by Dusan 20260721
import {renderHook, act} from '@testing-library/react'
import {useFormState, useWatch} from 'react-hook-form'
import {useAsyncFieldValidation} from './useAsyncFieldValidation'

// Mock react-hook-form
jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form')
  return {
    ...actual,
    useFormState: jest.fn(),
    useWatch: jest.fn(),
  }
})

// Type-cast the mocked hooks so TypeScript lets us call mock methods on them
const mockedUseFormState = useFormState as jest.Mock
const mockedUseWatch = useWatch as jest.Mock

let mockSetError: jest.Mock
let mockClearErrors: jest.Mock
let mockValidatorFn: jest.Mock
let mockControl: any

beforeEach(() => {
  jest.useFakeTimers()
  mockSetError = jest.fn()
  mockClearErrors = jest.fn()
  mockValidatorFn = jest.fn()

  mockControl = {
    _names: {mount: new Set()},
    _subjects: {state: {next: jest.fn()}},
    _formValues: {badgeUrl: ''},
    _defaultValues: {badgeUrl: ''},
    _state: {isSubmitted: false},
  }
})

afterEach(() => {
  jest.useRealTimers()
  jest.clearAllMocks()
})

test('do not validate if isDirty = false', () => {
  mockedUseFormState.mockReturnValue({
    errors: {},
    dirtyFields: {badgeUrl: false},
  })
  mockedUseWatch.mockReturnValue('https://example.com')

  const {result} = renderHook(() =>
    useAsyncFieldValidation({
      name: 'badgeUrl',
      control: mockControl,
      setError: mockSetError,
      clearErrors: mockClearErrors,
      validatorFn: mockValidatorFn,
    })
  )

  expect(result.current.isValidating).toBe(false)

  act(() => {
    jest.advanceTimersByTime(500)
  })

  expect(mockValidatorFn).not.toHaveBeenCalled()
})

test('returns isValidating=true and calls validatorFn', async () => {
  const targetUrl = 'https://example.com'
  mockValidatorFn.mockResolvedValue(true)

  mockedUseFormState.mockReturnValue({
    errors: {},
    dirtyFields: {badgeUrl: true},
  })
  mockedUseWatch.mockReturnValue(targetUrl)

  const {result} = renderHook(() =>
    useAsyncFieldValidation({
      name: 'badgeUrl',
      control: mockControl,
      setError: mockSetError,
      clearErrors: mockClearErrors,
      validatorFn: mockValidatorFn,
      delay: 300,
    })
  )

  expect(result.current.isValidating).toBe(true)
  expect(mockValidatorFn).not.toHaveBeenCalled()

  act(() => {
    jest.advanceTimersByTime(300)
  })

  expect(mockValidatorFn).toHaveBeenCalledWith(targetUrl)

  await act(async () => {
    await Promise.resolve()
  })

  expect(result.current.isValidating).toBe(false)
})

test('do not call validatorFn when synchronous error present', () => {
  mockedUseFormState.mockReturnValue({
    errors: {
      badgeUrl: {type: 'minLength', message: 'Minimum length is 20'},
    },
    dirtyFields: {badgeUrl: true},
  })
  mockedUseWatch.mockReturnValue('https://a.c')

  const {result} = renderHook(() =>
    useAsyncFieldValidation({
      name: 'badgeUrl',
      control: mockControl,
      setError: mockSetError,
      clearErrors: mockClearErrors,
      validatorFn: mockValidatorFn,
    })
  )

  expect(result.current.isValidating).toBe(false)

  act(() => {
    jest.advanceTimersByTime(500)
  })

  expect(mockValidatorFn).not.toHaveBeenCalled()
})

test('call setError with custom type "async" and error message', async () => {
  const validationErrorMessage = 'The URL does not point to a valid, viewable badge image'
  mockValidatorFn.mockResolvedValue(validationErrorMessage)

  mockedUseFormState.mockReturnValue({
    errors: {},
    dirtyFields: {badgeUrl: true},
  })
  mockedUseWatch.mockReturnValue('invalid-url')

  const {result} = renderHook(() =>
    useAsyncFieldValidation({
      name: 'badgeUrl',
      control: mockControl,
      setError: mockSetError,
      clearErrors: mockClearErrors,
      validatorFn: mockValidatorFn,
    })
  )

  act(() => {
    jest.advanceTimersByTime(500)
  })

  await act(async () => {
    await Promise.resolve()
  })

  expect(mockSetError).toHaveBeenCalledWith('badgeUrl', {
    type: 'async',
    message: validationErrorMessage,
  })
  expect(result.current.isValidating).toBe(false)
})

test('clears async error when validation succeeds', async () => {
  mockValidatorFn.mockResolvedValue(true)

  mockedUseFormState.mockReturnValue({
    errors: {
      badgeUrl: {type: 'async', message: 'Old error message string'},
    },
    dirtyFields: {badgeUrl: true},
  })
  mockedUseWatch.mockReturnValue('https://valid-image.png')

  renderHook(() =>
    useAsyncFieldValidation({
      name: 'badgeUrl',
      control: mockControl,
      setError: mockSetError,
      clearErrors: mockClearErrors,
      validatorFn: mockValidatorFn,
    })
  )

  act(() => {
    jest.advanceTimersByTime(500)
  })

  await act(async () => {
    await Promise.resolve()
  })

  expect(mockClearErrors).toHaveBeenCalledWith('badgeUrl')
})

test('handles runtime rejections gracefully', async () => {
  mockValidatorFn.mockRejectedValue(new Error('Network disconnected timeout failure'))

  mockedUseFormState.mockReturnValue({
    errors: {},
    dirtyFields: {badgeUrl: true},
  })
  mockedUseWatch.mockReturnValue('https://some-url.com')

  renderHook(() =>
    useAsyncFieldValidation({
      name: 'badgeUrl',
      control: mockControl,
      setError: mockSetError,
      clearErrors: mockClearErrors,
      validatorFn: mockValidatorFn,
    })
  )

  act(() => {
    jest.advanceTimersByTime(500)
  })

  await act(async () => {
    await Promise.resolve()
  })

  expect(mockSetError).toHaveBeenCalledWith('badgeUrl', {
    type: 'async',
    message: 'Validation failed unexpectedly',
  })
})

test('cancel older pending promises on rapid typing', async () => {

  mockValidatorFn.mockResolvedValue('Stale error response string should be discarded')

  mockedUseFormState.mockReturnValue({
    errors: {},
    dirtyFields: {badgeUrl: true},
  })
  mockedUseWatch.mockReturnValue('url-1')

  const {unmount} = renderHook(() =>
    useAsyncFieldValidation({
      name: 'badgeUrl',
      control: mockControl,
      setError: mockSetError,
      clearErrors: mockClearErrors,
      validatorFn: mockValidatorFn,
    })
  )

  unmount()

  act(() => {
    jest.advanceTimersByTime(500)
  })

  await act(async () => {
    await Promise.resolve()
  })

  expect(mockSetError).not.toHaveBeenCalled()
})
