// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useOrganisationOverviewParams from './useOrganisationOverviewParams'

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
  const {handleQueryChange} = useOrganisationOverviewParams()

  // call it with random param
  handleQueryChange('search', 'test-value')

  expect(mockPush).toBeCalledTimes(1)
  expect(mockPush).toBeCalledWith(
    '/organisations?search=test-value&page=1&rows=12',
    '/organisations?search=test-value&page=1&rows=12',
    {'scroll': false}
  )
})

it('handlesQueryChange for pagination', () => {
  // extract function
  const {handleQueryChange} = useOrganisationOverviewParams()

  // call it with random param
  handleQueryChange('page', '2')


  expect(mockPush).toBeCalledTimes(1)
  expect(mockPush).toBeCalledWith(
    '/organisations?page=2&rows=12',
    '/organisations?page=2&rows=12',
    {'scroll': true}
  )
})


it('resetFilters calls push without any params', () => {
  // extract function
  const {resetFilters} = useOrganisationOverviewParams()

  // call it with random param
  resetFilters()

  expect(mockPush).toBeCalledTimes(1)
  expect(mockPush).toBeCalledWith(
    '/organisations',
    '/organisations',
    {'scroll': false}
  )
})
