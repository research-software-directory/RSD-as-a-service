import {useRef, useEffect, useState} from 'react'
import useResizeObserver from './useResizeObserver'
import drawLineChart from './drawLineChart'

export type Point = {
  // date in ms
  x: number,
  // value
  y: number
}

export default function SingleLineChart({data = []}:{data: Point[]}) {
  const svgRef: any = useRef()
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

  useEffect(() => {
    if (size?.w && size?.h) {
      drawLineChart({
        dim: {w:size?.w,h:size?.h},
        svgEl: svgRef.current,
        data
      })
    }
  },[size?.w,size.h,data])

  return (
    <div ref={divRef} className="flex-1 overflow-hidden relative">
      <svg
          ref={svgRef}
          // requires block to remove 4px space from parent element
          // automatically added to parent
          // see https://stackoverflow.com/questions/22300062/svg-and-parent-height-of-svg-different
          style={{
            display: 'block'
          }}
      ></svg>
    </div>
  )
}
