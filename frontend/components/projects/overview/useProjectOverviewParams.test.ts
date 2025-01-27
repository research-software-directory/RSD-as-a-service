// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useProjectOverviewParams from './useProjectOverviewParams'

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
    pathname: '/projects',
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
  const {handleQueryChange} = useProjectOverviewParams()

  // call it with random param
  handleQueryChange('search', 'test-value')

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/projects?search=test-value&page=1&rows=12',
    '/projects?search=test-value&page=1&rows=12',
    {'scroll': false}
  )
})

it('handlesQueryChange for pagination', () => {
  // extract function
  const {handleQueryChange} = useProjectOverviewParams()

  // call it with random param
  handleQueryChange('page', '2')

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/projects?page=2&rows=12',
    '/projects?page=2&rows=12',
    {'scroll': true}
  )
})

it('resetFilters calls push without any params', () => {
  // extract function
  const {resetFilters} = useProjectOverviewParams()

  // call it with random param
  resetFilters()

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/projects?order=impact_cnt',
    '/projects?order=impact_cnt',
    {'scroll': false}
  )
})
