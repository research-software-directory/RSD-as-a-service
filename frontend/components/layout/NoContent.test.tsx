// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import NoContent from './NoContent'

it('renders component', () => {
  const testMsg = 'This is test message'

  render(<NoContent message={testMsg} />)

  const msg = screen.getByText(testMsg)
  expect(msg).toBeInTheDocument()

})
