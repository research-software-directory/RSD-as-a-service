import {useEffect, useState} from 'react'

export type SizeType = {
  w: number|undefined,
  h: number|undefined,
}

function calculateSize(wrapper: ResizeObserverEntry | HTMLElement) {
  let w, h
  // debugger
  if (wrapper instanceof ResizeObserverEntry) {
    w = Math.floor(wrapper.contentRect.width)
    h = Math.floor(wrapper.contentRect.height)
  } else {
    w = Math.floor(wrapper?.getBoundingClientRect().width || 300 )
    h = Math.floor(wrapper?.getBoundingClientRect().height || 154)
  }
  // minimum size
  // if (h < 150) h = 150
  // if (w < 300) w = 300
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
    // debugger
    observer.observe(element)
    return () => {
      observer.unobserve(element)
    }
  }, [element])
  // console.group('useResizeObserver...')
  // console.log('element...', element)
  // console.log('size...', size)
  // console.groupEnd()
  return size
}
