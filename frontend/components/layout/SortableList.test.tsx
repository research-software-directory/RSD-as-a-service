// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render} from '@testing-library/react'

import SortableList from './SortableList'


const mockSorted = jest.fn()
const mockRender = jest.fn((item, index) => {
  return (
    <li data-testid="list-item" key={index}>{item.label}</li>
  )
})
const mockProps = {
  items: [
    {id: 'id-1', position: 0, label: 'Test item 1'},
    {id: 'id-2', position: 1, label: 'Test item 2'},
    {id: 'id-3', position: 1, label: 'Test item 3'},
  ],
  onSorted: mockSorted,
  onRenderItem: mockRender
}

it('renders list with items', () => {

  render(
    <SortableList {...mockProps} />
  )

  expect(mockRender).toHaveBeenCalledTimes(mockProps.items.length)
})


