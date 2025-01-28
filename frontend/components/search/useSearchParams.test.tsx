// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useSearchParams from './useSearchParams'

// mock userSettings hook
jest.mock('~/config/UserSettingsContext')

// mock next router
const mockBack = jest.fn()
const mockReplace = jest.fn()
const mockPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
    push: mockPush,
    pathname: '/organisations',
    query: {
      rows: 12,
      page: 1,
    }
  })
}))

beforeEach(() => {
  jest.resetAllMocks()
})

it('handlesQueryChange with search param', () => {
  // extract function
  const {handleQueryChange} = useSearchParams('organisations')

  // call it with random param
  handleQueryChange('search', 'test-value')

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/organisations?search=test-value&page=1&rows=12',
    '/organisations?search=test-value&page=1&rows=12',
    {'scroll': false}
  )
})

it('handlesQueryChange for pagination', () => {
  // extract function
  const {handleQueryChange} = useSearchParams('organisations')

  // call it with random param
  handleQueryChange('page', '2')


  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/organisations?page=2&rows=12',
    '/organisations?page=2&rows=12',
    {'scroll': true}
  )
})


it('resetFilters calls push without any params', () => {
  // extract function
  const {resetFilters} = useSearchParams('organisations')

  // call it with random param
  resetFilters()

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/organisations',
    '/organisations',
    {'scroll': false}
  )
})

it ('handlesQueryChange supports communities overview',()=>{
  // extract function
  const {handleQueryChange} = useSearchParams('communities')

  // call it with random param
  handleQueryChange('search', 'test-value')

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/communities?search=test-value&page=1&rows=12',
    '/communities?search=test-value&page=1&rows=12',
    {'scroll': false}
  )
})

it ('handlesQueryChange supports news overview',()=>{
  // extract function
  const {handleQueryChange} = useSearchParams('news')

  // call it with random param
  handleQueryChange('search', 'test-value')

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/news?search=test-value&page=1&rows=12',
    '/news?search=test-value&page=1&rows=12',
    {'scroll': false}
  )
})
