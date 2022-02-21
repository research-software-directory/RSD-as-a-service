import * as d3 from 'd3'
import {SizeType} from './useResizeObserver'
import logger from '../../../utils/logger'
import {colors} from '../../../styles/themeConfig'

type LineData = {
  x: number,
  y: number
}

type LineChartConfig = {
  svgEl: SVGAElement,
  dim: SizeType,
  data: LineData[]
}

const margin = {
  left: 5, right: 5,
  top: 0, bottom: 20
}

function findMax(data:LineData[]) {
  const max = d3.max(data, d => d.y)
  if (max) {
    // return Math.ceil(max * 1.5)
    return max
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
  const {dim: {w, h}, svgEl, data} = props
  // ignore if no size
  if (!w || !h) return
  // defined dimensions
  const width = w - margin.left - margin.right
  const height = h - margin.top - margin.bottom

  // select svg element
  const svg = d3.select(svgEl)
    // important! for resizing the svg dimensions
    // need to be set to 100% while the actual
    // dimensions of wrapper div element are used
    // to calculate
    .attr('width', '100%')
    .attr('height', '100%')
    // .style('background', '#eeee')

  // define x scale as time scale
  const xScale = d3.scaleTime()
    .domain(timeRange(data))
    .range([0,width])

  // define y scale as linear
  const yScale = d3.scaleLinear()
    .domain([0, findMax(data)])
    .range([height, margin.top])

  // generate
  const generateScaledLine = d3.line()
    .x((d:any,i:number) => {
      // x as date value, using xScale to calculate position
      const val = xScale(new Date(d.x))
      return val
    })
    .y((d:any,i) => {
      // y as number, using yScale to calculate position
      const val = yScale(d.y)
      if (val < 0) {
        logger('drawLineChart.generateScaledLine...unexpected negative y values','warn')
      }
      return val
    })
    // curve type, see http://bl.ocks.org/d3indepth/b6d4845973089bc1012dec1674d3aff8
    .curve(d3.curveBasis)


  const bottomAxe = d3.axisBottom(xScale)
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
      .attr('stroke', colors.primary)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.7)

  return true
}
