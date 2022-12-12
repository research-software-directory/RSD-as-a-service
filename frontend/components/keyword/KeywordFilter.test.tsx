// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'
import KeywordFilter, {KeywordFilterProps} from './KeywordFilter'

const mockApi = jest.fn()
const mockApply = jest.fn()

const mockProps:KeywordFilterProps = {
  items: [],
  onApply: mockApply,
  searchApi: mockApi,
}

beforeEach(() => {
  jest.resetAllMocks()
})

it('renders component', () => {
  // mock api call
  mockApi.mockResolvedValueOnce([])
  // render
  render(
    <KeywordFilter {...mockProps} />
  )
})

it('renders keyword list returned from api', async() => {
  const mockInput = 'Keyword 1'
  // mock api call
  mockApi.mockResolvedValueOnce(['keyword 1','keyword 2'])
  // render
  render(
    <KeywordFilter {...mockProps} />
  )

  expect(mockApi).toBeCalledTimes(1)
  expect(mockApi).toBeCalledWith({searchFor: ''})
})

it('handles delete of keyword', async() => {
  // add some items
  mockProps.items = ['Keyword 1', 'Keyword 2', 'Keyword 3']
  // mock api call
  mockApi.mockResolvedValueOnce(['keyword 1', 'keyword 2'])

  // render
  render(
    <KeywordFilter {...mockProps} />
  )

  // get chips
  const chips = screen.getAllByTestId('filter-item-chip')
  expect(chips.length).toEqual(3)

  // get delete button
  const deleteBtn = chips[0].querySelector('[data-testid="CancelIcon"]')
  expect(deleteBtn).toBeInTheDocument()

  // use delete
  fireEvent.click(deleteBtn)

  expect(mockApply).toBeCalledTimes(1)
  expect(mockApply).toBeCalledWith(['Keyword 2', 'Keyword 3'])
})
