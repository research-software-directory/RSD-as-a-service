// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

export type SizeType = {
  w: number|undefined,
  h: number|undefined,
}

function calculateSize(wrapper: ResizeObserverEntry | HTMLElement) {
  let w, h

  if (wrapper instanceof ResizeObserverEntry) {
    w = Math.floor(wrapper.contentRect.width)
    h = Math.floor(wrapper.contentRect.height)
  } else {
    w = Math.floor(wrapper?.getBoundingClientRect().width || 300 )
    h = Math.floor(wrapper?.getBoundingClientRect().height || 154)
  }

  return {
    w,h
  }
}

export default function useResizeObserver(element: HTMLElement | undefined){
  const [size, setSize] = useState<SizeType>({w: undefined, h: undefined})

  useEffect(() => {
    if (!element) return

    const observer = new ResizeObserver(entries => {
      const dim = calculateSize(entries[0])
      setSize(dim)
    })

    observer.observe(element)
    return () => {
      observer.unobserve(element)
    }
  }, [element])

  return size
}
