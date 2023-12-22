// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'

import Announcement from './Announcement'

const mockAnnoucement = 'Test annoucement'

it('renders announcement component with text', () => {
  render(
    <Announcement announcement={mockAnnoucement} />
  )
  // has text
  screen.getByText(mockAnnoucement)
  // has button
  screen.getByRole('button')
})

it('hide announcement when close button is used', () => {
  render(
    <Announcement announcement={mockAnnoucement} />
  )
  // has text
  const announcement = screen.getByText(mockAnnoucement)
  // has button
  const closeBtn = screen.getByRole('button')
  // close
  fireEvent.click(closeBtn)
  // verify is hidden
  expect(announcement).not.toBeInTheDocument()
  // screen.debug()
})
