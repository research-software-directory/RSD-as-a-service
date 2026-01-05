// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useRef, useEffect, useState} from 'react'
import {useTheme} from '@mui/material/styles'
import useResizeObserver from './useResizeObserver'
import drawLineChart from './drawLineChart'

export type Point = {
  // date in ms
  x: number,
  // value
  y: number
}

export default function SingleLineChart({data = []}: {data: Point[]}) {
  const theme = useTheme()
  const svgRef: any = useRef(undefined)
  const divRef: any = useRef(undefined)
  const [element, setElement] = useState()
  const size = useResizeObserver(element)

  // console.group('SingleLineChart')
  // console.log('size...', size)
  // console.groupEnd()

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
        data-testid="d3-line-chart"
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
