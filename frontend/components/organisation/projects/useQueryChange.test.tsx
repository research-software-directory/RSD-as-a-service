// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {render} from '@testing-library/react'
import useQueryChange from './useQueryChange'
import {TabKey} from '../tabs/OrganisationTabItems'

// mock next navigation router
const mockBack = jest.fn()
const mockReplace = jest.fn()
const mockPush = jest.fn()
const mockSearchParam = jest.fn(()=>new URLSearchParams())

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
    push: mockPush
  }),
  usePathname: () => '/organisations/test-slug-project',
  useSearchParams: ()=> mockSearchParam()
}))

beforeEach(() => {
  jest.resetAllMocks()
})

function WrappedHandleChangeHook({param,value}:{param: string, value: string | string[]}) {
  // extract function
  const {handleQueryChange} = useQueryChange()

  useEffect(() => {
    // call it with random param
    handleQueryChange(param, value)
  },[param,value,handleQueryChange])

  return (
    <div>WrappedHandleChangeHook</div>
  )
}

function WrappedResetFilterHook({tab}:{tab:TabKey}) {
  // extract function
  const {resetFilters} = useQueryChange()

  useEffect(() => {
    // call it with random param
    resetFilters(tab)
  },[tab,resetFilters])

  return (
    <div>WrappedResetFiltersHook</div>
  )
}


it('handlesQueryChange with search param', () => {

  render(<WrappedHandleChangeHook param="search" value="test-value" />)

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/organisations/test-slug-project?search=test-value&page=1',
    {'scroll': false}
  )
})

it('handlesQueryChange pagination', () => {

  render(<WrappedHandleChangeHook param="page" value="2" />)

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/organisations/test-slug-project?page=2',
    {'scroll': true}
  )
})

it('handlesQueryChange keeps previous params', () => {

  mockSearchParam.mockReturnValue(new URLSearchParams('search=test-search&rows=24') )

  render(<WrappedHandleChangeHook param="page" value="3" />)

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/organisations/test-slug-project?search=test-search&rows=24&page=3',
    {'scroll': true}
  )
})

it('resetFilters but keep order when on same tab', () => {
  mockSearchParam.mockReturnValue(new URLSearchParams('search=test-search&rows=24&order=test-order&tab=projects') )

  render(<WrappedResetFilterHook tab="projects" />)

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    '/organisations/test-slug-project?tab=projects&order=test-order',
    {'scroll': false}
  )
})

