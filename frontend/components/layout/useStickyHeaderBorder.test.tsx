// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {useRef, useState} from 'react'
import useStickyHeaderBorder from './useStickyHeaderBorder'

const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
// you can also pass the mock implementation
// to jest.fn as an argument
window.IntersectionObserver = jest.fn(() => ({
  observe:mockObserve,
  unobserve:mockUnobserve,
}))

function WithStickyHeaderHook() {
  const headerRef = useRef(null)
  const [classes, setClasses] = useState('')
  // add border when header is at the top of the page
  useStickyHeaderBorder({
    headerRef, setClasses
  })
  return (
    <>
      <h1
        ref={headerRef}
        className="flex-1 xl:text-4xl">
        TEST-HEADER-TITLE
      </h1>
      <div data-testid="sticky-header-classes">
        {classes}
      </div>
    </>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
})

it('hook calls observe method with proper element', () => {
  // render component
  render(<WithStickyHeaderHook />)
  // get h1 element
  const h1 = screen.getByRole('heading')
  expect(h1).toBeInTheDocument()
  // validate observe call
  expect(mockObserve).toHaveBeenCalledTimes(1)
  expect(mockObserve).toHaveBeenCalledWith(h1)
})

it('hook calls unobserve method with proper element', () => {
  // mount component
  const {unmount} = render(<WithStickyHeaderHook />)
  // get h1 element
  const h1 = screen.getByRole('heading')
  expect(h1).toBeInTheDocument()
  // unmount component
  unmount()
  // validate unobserve element is called
  expect(mockUnobserve).toHaveBeenCalledTimes(1)
  expect(mockUnobserve).toHaveBeenCalledWith(h1)
})
