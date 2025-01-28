// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@testing-library/react'
import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'

import GlobalSearchAutocomplete from '.'

// MOCKS
import apiResponse from './__mocks__/globalSearchApiResponse.json'
const mockGetGlobalSearch = jest.fn()
jest.mock('./apiGlobalSearch',()=>{
  return {
    getGlobalSearch: (props:any)=>mockGetGlobalSearch(props)
  }
})
const mockUseHasRemotes = jest.fn()
jest.mock('./useHasRemotes',()=>{
  // console.log('useHasRemotes...MOCK')
  return {
    useHasRemotes: ()=>mockUseHasRemotes()
  }
})

beforeEach(() => {
  jest.resetAllMocks()
})

it('renders component with testid global-search', async() => {
  mockUseHasRemotes.mockReturnValue({hasRemotes:false})
  // render component with session
  render(WrappedComponentWithProps(GlobalSearchAutocomplete))
  // find global search input
  const globalSearch = screen.getByTestId('global-search')
  expect(globalSearch).toBeInTheDocument()
})

it('shows 3 navigation option on focus', async () => {
  mockUseHasRemotes.mockReturnValue({hasRemotes:false})
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
  const expectedSearch = 'Search text'
  mockUseHasRemotes.mockReturnValue({hasRemotes:false})
  mockGetGlobalSearch.mockResolvedValue(apiResponse)

  // render component with session
  render(WrappedComponentWithProps(GlobalSearchAutocomplete))
  // find input
  const globalSearch = screen.getByTestId('global-search')
  // enter value
  fireEvent.change(globalSearch, {target: {value: expectedSearch}})
  // wait for list to return
  await screen.findAllByTestId('global-search-list-item')
  // expect(items.length).toEqual(apiResponse.length)
  // confirm api call
  expect(mockGetGlobalSearch).toHaveBeenCalledTimes(1)
  expect(mockGetGlobalSearch).toHaveBeenCalledWith(expectedSearch)
})

it('shows api response in the list', async () => {
  // return mocked api response
  mockGetGlobalSearch.mockResolvedValue(apiResponse)
  mockUseHasRemotes.mockReturnValue({hasRemotes:false})

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
  mockGetGlobalSearch.mockResolvedValueOnce([])
  mockUseHasRemotes.mockReturnValue({hasRemotes:false})
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

it('shows rsd_host value when hasRemotes=true', async () => {
  // return mocked api response
  mockGetGlobalSearch.mockResolvedValueOnce([apiResponse[0]])
  mockUseHasRemotes.mockReturnValue({hasRemotes:true})
  // render component with session
  render(WrappedComponentWithProps(GlobalSearchAutocomplete))
  // find input
  const globalSearch = screen.getByTestId('global-search')
  // enter value
  fireEvent.change(globalSearch, {target: {value: 'ICD_GEMs.jl'}})
  // wait for No results to appear
  const items = await screen.findAllByTestId('global-search-list-item')
  expect(items.length).toEqual(1)
  // find host value
  await screen.findByText('@research-software-directory.org')
})

it('shows Unpublished value', async () => {
  // return mocked api response
  mockGetGlobalSearch.mockResolvedValueOnce([apiResponse[1]])
  mockUseHasRemotes.mockReturnValue({hasRemotes:false})
  // render component with session
  render(WrappedComponentWithProps(GlobalSearchAutocomplete))
  // find input
  const globalSearch = screen.getByTestId('global-search')
  // enter value
  fireEvent.change(globalSearch, {target: {value: 'iEnvironment'}})
  // wait for No results to appear
  const items = await screen.findAllByTestId('global-search-list-item')
  expect(items.length).toEqual(1)
  // find host value
  await screen.findByText('Unpublished')
})
