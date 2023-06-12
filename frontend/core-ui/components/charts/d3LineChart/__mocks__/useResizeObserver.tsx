// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'

export type SizeType = {
  w: number|undefined,
  h: number|undefined,
}

// DEFAULT MOCK of useResizeObserver hook
export default function useResizeObserver(element: HTMLElement | undefined){
  const [size, setSize] = useState<SizeType>({w: undefined, h: undefined})
  // console.log('useResizeObserver...MOCKED...')
  useEffect(() => {
    if (!element) return
    setSize({
      w: 300,
      h: 150
    })
  }, [element])

  return size
}
