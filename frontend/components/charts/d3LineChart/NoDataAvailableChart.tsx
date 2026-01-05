// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {select,scaleLinear,line} from 'd3'
import {useRef, useEffect, useState} from 'react'
// note! direct import causes jest tests to fail
import {useTheme} from '@mui/material/styles'
import logger from '~/utils/logger'
import useResizeObserver,{SizeType} from './useResizeObserver'

export type Point = {x: number, y: number}

type LineChartConfig = {
  svgEl: SVGAElement,
  dim: SizeType,
  text: string | undefined,
  strokeColor: string
}

const margin = {
  left: 5, right: 5,
  top: 0, bottom: 20
}

const noCommitData: Point[] = [
  {x: 0, y: 0},
  {x: 48, y: 0},
  {x: 50, y: 10},
  {x: 52, y: -5},
  {x: 54, y: 0},
  {x: 60, y:0},
  {x: 65, y: 40},
  {x: 70, y: -30},
  {x: 75, y: 0},
  {x: 100, y: 0},
]

function drawLine(props: LineChartConfig) {
  // eslint-disable-next-line prefer-const
  let {dim: {w, h}, svgEl, text, strokeColor} = props
  if (text === undefined) {
    text = 'Whoops, something went wrong here.'
  }
  // if no data return null
  // ignore if no size
  if (!w || !h) return

  // defined dimensions
  const width = w - margin.left - margin.right
  const height = h - margin.top - margin.bottom

  // select svg element
  const svg = select(svgEl)
    // important! for resizing the svg dimensions
    // need to be set to 100% while the actual
    // dimensions of wrapper div element are used
    // to calculate
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')
    // .style('background', '#eeee')

  const xScale = scaleLinear()
    .domain([0, 100])
    .range([0, width])

  // define y scale as linear
  const yScale = scaleLinear()
    .domain([-40, 50])
    .range([height, margin.top])

  // generate
  const generateScaledLine = line()
    .x((d:any) => {
      // Plot everything below hundred unscaled
      if (d.x < 100) {
        return d.x
      }
      return xScale(d.x)
    })
    .y((d:any) => {
      // y as number, using yScale to calculate position
      const val = yScale(d.y)
      if (val < 0) {
        logger('drawLineChart.generateScaledLine...unexpected negative y values','warn')
      }
      return val
    })

  // remove old groups
  svg.selectAll('g').remove()

  // position
  const group = svg
    .append('g')
    .attr('id','d3-line-chart')
    .attr('transform',`translate(${margin.left},${margin.top})`)

  // bottom axe
  group
    .append('g')
    .attr('class', 'bottom-axe')
    .attr('transform', `translate(0,${height})`)

  const lineGroup = group
    .append('g')
    .attr('id','d3-line-group')

  // replace
  lineGroup.selectAll('.line')
    .data([noCommitData])
    .join('path')
    .attr('class','line')
    .attr('d',d=>generateScaledLine(d as any))
    .attr('fill','none')
    .attr('stroke', strokeColor)
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.7)

  const sw = group.append('switch')
  sw.append('foreignObject')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', yScale(0))
    .attr('width', '100%')
    .append('xhtml:p')
    .attr('style', 'margin-left:100px; position:absolute; bottom:0')
    .text(text)

  sw.append('text')
    .attr('x', 100)
    .attr('y', yScale(0))
    .attr('dy', '-0.5rem')
    .text(text)

  return true
}

function NoDataAvailableChart({text}: {text: string | undefined}) {
  const theme = useTheme()
  const svgRef: any = useRef(undefined)
  const divRef: any = useRef(undefined)
  const [element, setElement] = useState()
  const size = useResizeObserver(element)

  // console.log('size...', size)

  useEffect(() => {
    let abort = false
    if (divRef.current && abort===false) {
      setElement(divRef.current)
    }
    return ()=>{abort=true}
  }, [divRef])

  useEffect(() => {
    if (size?.w && size?.h && text && svgRef.current) {
      drawLine({
        dim: {w:size?.w,h:size?.h},
        svgEl: svgRef.current,
        strokeColor: theme.palette.primary.main,
        text
      })
    }
  },[size?.w, size.h, text, theme.palette.primary.main])

  return (
    <div ref={divRef} className="flex-1 overflow-hidden relative">
      <svg
        data-testid="no-data-chart"
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

export default NoDataAvailableChart
