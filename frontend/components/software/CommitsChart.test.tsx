// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {WithAppContext} from '~/utils/jest/WithAppContext'
import CommitsChart, {CommitsChartProps,ArchivedRepo,StarCount,ForkCount} from './CommitsChart'

// MOCK useResizeObserver
jest.mock('~/components/charts/d3LineChart/useResizeObserver')

// MOCK NoDataAvailableChart
// NOTE! this component causes unexpected errors during test!?!
// further investigation required
jest.mock('~/components/charts/d3LineChart/NoDataAvailableChart', () => ({
  __esModule: true,
  default: jest.fn(({text}) =><div data-testid="no-data-chart-message">{text}</div>)
}))

type MutableProps = {
  -readonly [key in keyof CommitsChartProps]: CommitsChartProps[key]
}

const mockProps:MutableProps = {
  repository_url: null,
  commit_history: undefined,
  commit_history_scraped_at: undefined,
  className: undefined,
  archived: null,
  star_count: null,
  fork_count: null
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

it('renders "repository is empty" message', () => {
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

it('renders "archived repository" message', () => {
  // render
  render(
    <WithAppContext>
      <ArchivedRepo archived={true} />
    </WithAppContext>
  )

  screen.getByTestId('archived-repository')
})

it('renders "0 stars" message', () => {
  // render
  render(
    <WithAppContext>
      <StarCount star_count={0} />
    </WithAppContext>
  )

  screen.getByText('0 stars')
})

it('does NOT render the stars message on null', async() => {
  // render
  render(
    <WithAppContext>
      <StarCount star_count={null} />
    </WithAppContext>
  )
  const stars = screen.queryByTestId('star-count')
  expect(stars).not.toBeInTheDocument()
  // screen.debug(stars)
})

it('does NOT render the stars message on undefined', async() => {
  // render
  render(
    <WithAppContext>
      <StarCount star_count={undefined} />
    </WithAppContext>
  )
  const stars = screen.queryByTestId('star-count')
  expect(stars).not.toBeInTheDocument()
})

it('renders "0 forks" message', () => {
  // render
  render(
    <WithAppContext>
      <ForkCount fork_count={0} />
    </WithAppContext>
  )

  screen.getByText('0 forks')
})

it('does NOT render forks message on null', async() => {
  // render
  render(
    <WithAppContext>
      <ForkCount fork_count={null} />
    </WithAppContext>
  )
  const forks = screen.queryByTestId('fork-count')
  expect(forks).not.toBeInTheDocument()
})

it('does NOT render forks message on undefined', async() => {
  // render
  render(
    <WithAppContext>
      <ForkCount fork_count={undefined} />
    </WithAppContext>
  )
  const stars = screen.queryByTestId('fork-count')
  expect(stars).not.toBeInTheDocument()
})

