// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRef, useEffect, useState} from 'react'
import useResizeObserver from './useResizeObserver'
import drawLineChart from './drawLineChart'
import {useTheme} from '@mui/material'

export type Point = {
  // date in ms
  x: number,
  // value
  y: number
}

export default function SingleLineChart({data = []}: { data: Point[] }) {
  const theme = useTheme()
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
        strokeColor: theme.palette.primary.main,
        data
      })
    }
  },[size?.w,size.h,data,theme.palette.primary.main])

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
