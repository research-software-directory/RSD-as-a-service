// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'

import SelectedFilterItems from './SelectedFilterItems'

const mockDelete = jest.fn()
const items = ['Item 1', 'Item 2',' Item 3']

beforeEach(() => {
  render(<SelectedFilterItems items={items} onDelete={mockDelete} />)
})

it('renders list items', () => {
  // get all chips
  const chips = screen.getAllByRole('button')
  // expect all items to be present
  expect(chips.length).toEqual(items.length)
})

it('calls onDelete when item deleted', () => {
  // get all delete icons
  const deletes = screen.getAllByTestId('CancelIcon')
  expect(deletes.length).toEqual(items.length)

  // click on the icon
  fireEvent.click(deletes[1])

  expect(mockDelete).toBeCalledTimes(1)
  expect(mockDelete).toBeCalledWith(1)
})
