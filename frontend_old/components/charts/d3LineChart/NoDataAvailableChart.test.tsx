// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen,within} from '@testing-library/react'
import {WithAppContext} from '~/utils/jest/WithAppContext'

import NoDataAvailableChart from './NoDataAvailableChart'

// MOCK resize obzerver hook
jest.mock('./useResizeObserver')

it('renders no data chart message', () => {
  const noDataMsg = 'This is test message'

  render(
    <WithAppContext>
      <NoDataAvailableChart text={noDataMsg} />
    </WithAppContext>
  )

  // check for main chart group with id d3-line-chart
  const svgGroup = screen.getByTestId('no-data-chart')
  expect(svgGroup).toBeInTheDocument()

  const message = within(svgGroup).getAllByText(noDataMsg)
  expect(message.length).toBeGreaterThan(0)
})
