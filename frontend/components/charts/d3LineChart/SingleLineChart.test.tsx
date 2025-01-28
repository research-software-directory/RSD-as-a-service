// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'

import SingleLineChart from './SingleLineChart'

const mockLineData= [
  {x: 1625356800000, y: 1},
  {x: 1625961600000, y: 4},
  {x: 1626566400000, y: 1},
  {x: 1627171200000, y: 0},
  {x: 1627776000000, y: 0},
  {x: 1628380800000, y: 0}
]

// MOCK resize observer hook
jest.mock('./useResizeObserver')

it('renders chart with d3-line-chart svg group', async() => {
  // render chart with mocked line data
  const {container} = render(WrappedComponentWithProps(
    SingleLineChart, {
      props: {
        data: mockLineData
      }
    }))

  // wait for root svg element
  const svg = await screen.findByTestId('d3-line-chart')
  expect(svg).toBeInTheDocument()
  // check for main chart group with id d3-line-chart
  const svgGroup = await container.querySelector('#d3-line-chart')
  expect(svgGroup).toBeInTheDocument()
})
