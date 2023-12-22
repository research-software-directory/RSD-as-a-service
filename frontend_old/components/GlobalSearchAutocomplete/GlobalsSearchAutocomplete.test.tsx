// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@testing-library/react'
import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import GlobalSearchAutocomplete from '.'

import apiResponse from './__mocks__/globalSearchApiResponse.json'

beforeEach(() => {
  jest.resetAllMocks()
})

it('renders component with testid global-search', () => {
  // render component with session
  render(WrappedComponentWithProps(GlobalSearchAutocomplete))
  // find global search input
  const globalSearch = screen.getByTestId('global-search')
  expect(globalSearch).toBeInTheDocument()
})

it('shows 3 navigation option on focus', async () => {
  // render component with session
  render(WrappedComponentWithProps(GlobalSearchAutocomplete))
  // find input
  const globalSearch = screen.getByTestId('global-search')
  // set focus
  fireEvent.focus(globalSearch)

  // should show 3 navigation options
  const listItems = screen.getAllByTestId('global-search-list-item')
  expect(listItems.length).toEqual(3)
})

it('calls search api on input', async () => {
  const expectedUrl = '/api/v1/rpc/global_search?search_text=ilike.*Search text*&limit=30'
  const expectPayload = {
    'headers': {
      'Content-Type': 'application/json'
    },
    'method': 'GET'
  }
  mockResolvedValueOnce(apiResponse)

  // render component with session
  render(WrappedComponentWithProps(GlobalSearchAutocomplete))
  // find input
  const globalSearch = screen.getByTestId('global-search')
  // enter value
  fireEvent.change(globalSearch, {target: {value: 'Search text'}})
  // wait for list to return
  const items = await screen.findAllByTestId('global-search-list-item')
  // expect(items.length).toEqual(apiResponse.length)
  // confirm api call
  expect(global.fetch).toBeCalledTimes(1)
  expect(global.fetch).toBeCalledWith(expectedUrl,expectPayload)
})

it('shows api response in the list', async () => {
  // return mocked api response
  mockResolvedValueOnce(apiResponse)

  // render component with session
  render(WrappedComponentWithProps(GlobalSearchAutocomplete))
  // find input
  const globalSearch = screen.getByTestId('global-search')
  // enter value
  fireEvent.change(globalSearch, {target: {value: 'Search text'}})
  // wait for list to return
  const items = await screen.findAllByTestId('global-search-list-item')
  expect(items.length).toEqual(apiResponse.length)
})

it('shows no response message', async () => {
  // return mocked api response
  mockResolvedValueOnce([])
  // render component with session
  render(WrappedComponentWithProps(GlobalSearchAutocomplete))
  // find input
  const globalSearch = screen.getByTestId('global-search')
  // enter value
  fireEvent.change(globalSearch, {target: {value: 'Nothing to find'}})
  // wait for No results to appear
  const noResults = await screen.findByText('No results...')
  expect(noResults).toBeInTheDocument()
})
