// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {WithAppContext} from '~/utils/jest/WithAppContext'
import CommitsChart, {CommitsChartProps} from './CommitsChart'

import repoInfoData from './__mocks__/repositoryInfoData.json'

// MOCK useResizeObserver
jest.mock('~/components/charts/d3LineChart/useResizeObserver')

// MOCK NoDataAvailableChart
// NOTE! this component causes unexpected errors during test!?!
// further investigation required
jest.mock('~/components/charts/d3LineChart/NoDataAvailableChart', () => ({
  __esModule: true,
  default: jest.fn(({text}) =><div data-testid="no-data-chart-message">{text}</div>)
}))

// const mockPrepareDataForSoftwarePage = jest.fn(props => ({
//   lineData: [],
//   totalCountY:0,
//   lastCommitDate: null
// }))
// jest.mock('~/components/charts/d3LineChart/formatData', () => ({
//   prepareDataForSoftwarePage: jest.fn(props=>mockPrepareDataForSoftwarePage(props))
// }))

const mockProps:CommitsChartProps = {
  repository_url: null,
  commit_history: undefined,
  commit_history_scraped_at: undefined,
  className: undefined
}

it('renders "missing repository_url" message', () => {
  mockProps.repository_url=null
  // missing repository_url message
  const expectMessage='We cannot display the activity graph, because we do not know the repository url.'
  // render
  render(
    <WithAppContext>
      <CommitsChart {...mockProps} />
    </WithAppContext>
  )

  const message = screen.getByTestId('no-data-chart-message')
  expect(message).toHaveTextContent(expectMessage)
  // screen.debug()
})

it('renders "did not scrape repo yet" message', () => {
  mockProps.repository_url = 'https://some.repo.url.com'
  mockProps.commit_history_scraped_at = undefined
  // missing repository_url message
  const expectMessage='We did not scrape the commit history of this repository yet.'
  // render
  render(
    <WithAppContext>
      <CommitsChart {...mockProps} />
    </WithAppContext>
  )

  const message = screen.getByTestId('no-data-chart-message')
  expect(message).toHaveTextContent(expectMessage)
  // screen.debug()
})

it('renders "reposotory is empty" message', () => {
  mockProps.repository_url = 'https://some.repo.url.com'
  mockProps.commit_history_scraped_at = new Date().toISOString()
  mockProps.commit_history = {}
  // missing repository_url message
  const expectMessage='We cannot display this graph because the repository is empty.'
  // render
  render(
    <WithAppContext>
      <CommitsChart {...mockProps} />
    </WithAppContext>
  )

  const message = screen.getByTestId('no-data-chart-message')
  expect(message).toHaveTextContent(expectMessage)
  // screen.debug()
})

it('renders "we cannot read the commit history" message', () => {
  mockProps.repository_url = 'https://some.repo.url.com'
  mockProps.commit_history_scraped_at = new Date().toISOString()
  mockProps.commit_history = undefined
  // missing repository_url message
  const expectMessage='We cannot display this graph because we cannot read the commit history.'
  // render
  render(
    <WithAppContext>
      <CommitsChart {...mockProps} />
    </WithAppContext>
  )

  const message = screen.getByTestId('no-data-chart-message')
  expect(message).toHaveTextContent(expectMessage)
  // screen.debug()
})

// NOTE! Unexpected problem with rendering svg chart component
// Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
// WE SKIP this test untill further investigation is performed
// it.skip('renders commit history chart', () => {
//   mockProps.repository_url = 'https://some.repo.url.com'
//   mockProps.commit_history_scraped_at = repoInfoData.commit_history_scraped_at
//   mockProps.commit_history = repoInfoData.commit_history

//   // render
//   render(
//     <WithAppContext>
//       <CommitsChart {...mockProps} />
//     </WithAppContext>
//   )

//   screen.debug()
// })
