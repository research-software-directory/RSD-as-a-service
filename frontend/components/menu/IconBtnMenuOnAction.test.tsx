// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@testing-library/react'
import IconBtnMenuOnAction from './IconBtnMenuOnAction'

const mockAction=jest.fn()
const mockProps = {
  options: [{
    key: 'key 1',
    type: 'action' as any,
    label: 'Option 1',
    disabled: false,
    action: {
      type: 'TEST_1',
      payload:'TEST_PAYLOAD_1'
    }
  },{
    key:'key 2',
    type: 'action',
    label: 'Option 2',
    disabled: false,
    action: {
      type: 'TEST_2',
      payload:'TEST_PAYLOAD_2'
    }
  }],
  onAction: mockAction
}

it('renders component with two options', () => {

  render(<IconBtnMenuOnAction {...mockProps} />)

  const moreBtn = screen.getByTestId('icon-menu-button')
  expect(moreBtn).toBeInTheDocument()

  fireEvent.click(moreBtn)

  const options = screen.getAllByRole('menuitem')
  expect(options.length).toEqual(mockProps.options.length)

})

it('calls action on item click', () => {

  render(<IconBtnMenuOnAction {...mockProps} />)

  const moreBtn = screen.getByTestId('icon-menu-button')
  expect(moreBtn).toBeInTheDocument()

  fireEvent.click(moreBtn)

  const options = screen.getAllByRole('menuitem')
  fireEvent.click(options[0])

  expect(mockAction).toHaveBeenCalledTimes(1)
  expect(mockAction).toHaveBeenCalledWith(mockProps.options[0].action)

})
