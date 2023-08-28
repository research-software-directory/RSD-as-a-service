// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render} from '@testing-library/react'
import {useEffect, useRef, useState} from 'react'

import useResizeObserver from './useResizeObserver'

// MOCK ResizeObserver
const mockObserve = jest.fn((el) => {
  // console.log('mockObserve...el...',el)
})
const mockUnobserve = jest.fn((el) => {
  // console.log('mockUnobserve...el...',el)
})
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: jest.fn(),
}))

function WrappedResizeObserver() {
  const divRef: any = useRef()
  const [element, setElement] = useState()
  const size = useResizeObserver(element)

  useEffect(() => {
    let abort = false
    if (divRef.current && abort===false) {
      setElement(divRef.current)
    }
    return ()=>{abort=true}
  }, [divRef])

  return (
    <div ref={divRef}>
      <h1>Wrapped observer</h1>
      <pre>Size:{ JSON.stringify(size,null,2)}</pre>
    </div>
  )
}

it('calls ResizeObserver', () => {
  // render
  const {unmount} = render(<WrappedResizeObserver />)
  // expect observe to be called
  expect(mockObserve).toBeCalledTimes(1)

  // remove component
  unmount()
  // expect unobserve to be called
  expect(mockUnobserve).toBeCalledTimes(1)
})
