// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {render} from '@testing-library/react'
import useFilterQueryChange from './useFilterQueryChange'

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
      slug:'test-slug-project',
      rows: 12,
      page: 1,
    }
  })
}))

beforeEach(() => {
  jest.resetAllMocks()
})

function WrappedHandleChangeHook({param,value}:{param: string, value: string | string[]}) {
  // extract function
  const {handleQueryChange} = useFilterQueryChange()

  useEffect(() => {
    // call it with random param
    handleQueryChange(param, value)
  },[param,value,handleQueryChange])

  return (
    <div>WrappedHandleChangeHook</div>
  )
}


it('handleQueryChange with search param', () => {

  render(<WrappedHandleChangeHook param="search" value="test-value" />)

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    {'query': {'page': 1, 'rows': 12, 'slug': 'test-slug-project','search': 'test-value'}},
    undefined,
    {'scroll': false}
  )
})

it('handleQueryChange pagination', () => {

  render(<WrappedHandleChangeHook param="page" value="2" />)

  expect(mockPush).toHaveBeenCalledTimes(1)
  expect(mockPush).toHaveBeenCalledWith(
    {'query': {'page': '2', 'rows': 12, 'slug': 'test-slug-project'}},
    undefined,
    {'scroll': true}
  )
})
