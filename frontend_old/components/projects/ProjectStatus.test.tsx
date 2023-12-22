// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import ProjectStatus from './ProjectStatus'

const mockProps = {
  date_start: null,
  date_end: null
} as any

const now = new Date()

it('renders project with Upcoming status', () => {
  // dates in future
  mockProps.date_start = new Date(now.getTime() + 1000 * 60 * 60).toISOString()
  mockProps.date_end = new Date(now.getTime() + 10000 * 60 * 60).toISOString()

  render(<ProjectStatus {...mockProps} />)

  screen.getByText('Upcoming')

})

it('renders project with In progress status', () => {
  // start_date in past
  mockProps.date_start = new Date(now.getTime() - 10000 * 60 * 60).toISOString()
  // end data in future
  mockProps.date_end = new Date(now.getTime() + 10000 * 60 * 60).toISOString()

  render(<ProjectStatus {...mockProps} />)

  screen.getByText('In progress')
})

it('renders project with Finished status', () => {
  // start_date in past
  mockProps.date_start = new Date(now.getTime() - 20000 * 60 * 60).toISOString()
  // end data in future
  mockProps.date_end = new Date(now.getTime() - 10000 * 60 * 60).toISOString()

  render(<ProjectStatus {...mockProps} />)

  screen.getByText('Finished')
})

it('renders project progress to 50%', () => {
  // start_date in past
  mockProps.date_start = new Date(now.getTime() - 20000 * 60 * 60).toISOString()
  // end data in future
  mockProps.date_end = new Date(now.getTime() + 20000 * 60 * 60).toISOString()

  render(<ProjectStatus {...mockProps} />)

  const progressbar = screen.getByTestId('progress-bar-value')
  expect(progressbar).toHaveStyle('width:50%')

})
