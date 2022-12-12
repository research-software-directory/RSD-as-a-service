// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {GoBackLink} from './GoBackLink'

it('renders GoBack button', () => {
  render(<GoBackLink />)
  const backLink = screen.getByText(/Go back/)
  expect(backLink).toBeInTheDocument()
})
