// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {
  select,scaleLinear,
  scaleTime,line,max,
  curveBasis,axisBottom
} from 'd3'
import logger from '~/utils/logger'
import {SizeType} from './useResizeObserver'

type LineData = {
  x: number,
  y: number
}

type LineChartConfig = {
  svgEl: SVGAElement,
  dim: SizeType,
  data: LineData[],
  strokeColor: string
}

const margin = {
  // minimal margins to host first/last year label 'overflow'
  left: 12, right: 12,
  top: 4, bottom: 24
}

function findMax(data:LineData[]) {
  const mx = max(data, d => d.y)
  if (mx) {
    // return Math.ceil(max * 1.5)
    return mx
  }
  return 0
}

function timeRange(data: LineData[]) {
  // convert unix time in seconds to ms
  const first = data[0].x
  const last = data[data.length-1].x

  const range = [
    new Date(first),
    new Date(last)
  ]

  return range
}


export default function drawLineChart(props: LineChartConfig) {
  const {dim: {w, h}, svgEl, data, strokeColor} = props
  // if no data return null
  if (data.length === 0) return null
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
    // .style('background', '#eeee')

  // define x scale as time scale
  const xScale = scaleTime()
    .domain(timeRange(data))
    .range([0,width])

  // define y scale as linear
  const yScale = scaleLinear()
    .domain([0, findMax(data)])
    .range([height, margin.top])

  // generate
  const generateScaledLine = line()
    .x((d:any) => {
      // x as date value, using xScale to calculate position
      const val = xScale(new Date(d.x))
      return val
    })
    .y((d:any) => {
      // y as number, using yScale to calculate position
      const val = yScale(d.y)
      if (val < 0) {
        logger('drawLineChart.generateScaledLine...unexpected negative y values','warn')
      }
      return val
    })
    // curve type, see http://bl.ocks.org/d3indepth/b6d4845973089bc1012dec1674d3aff8
    .curve(curveBasis)


  const bottomAxe = axisBottom(xScale)
    // remove outer ticks
    .tickSizeOuter(0)

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
    .call(bottomAxe)

  const lineGroup = group
    .append('g')
    .attr('id','d3-line-group')

  // replace
  lineGroup.selectAll('.line')
    .data([data])
    .join('path')
    .attr('class','line')
    .attr('d',d=>generateScaledLine(d as any))
    .attr('fill','none')
    .attr('stroke', strokeColor)
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.7)

  return true
}
