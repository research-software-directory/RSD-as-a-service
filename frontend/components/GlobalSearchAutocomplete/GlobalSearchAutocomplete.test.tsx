// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Jesse Gonzalez (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'
import {defaultRsdSettings, RsdModuleName} from '~/config/rsdSettingsReducer'

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

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock window.open
delete (window as any).open
window.open = jest.fn()

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

it('shows navigation option on focus based on modules defined', async () => {
  mockUseHasRemotes.mockReturnValue({hasRemotes:false})
  // filter out only active modules
  const expectedMenuOptions = Object.keys(defaultRsdSettings.modules).filter((key)=>defaultRsdSettings.modules[key as RsdModuleName].active)
  // render component with session
  render(WrappedComponentWithProps(GlobalSearchAutocomplete))
  // find input
  const globalSearch = screen.getByTestId('global-search')
  // set focus
  fireEvent.focus(globalSearch)

  // should show 3 navigation options
  const listItems = screen.getAllByTestId('global-search-list-item')
  expect(listItems.length).toEqual(expectedMenuOptions?.length)
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

// ========================================
// Smart Enter Key Navigation Tests
// ========================================

describe('Smart Enter key navigation', () => {
  it('starts with no item selected when dropdown opens', async () => {
    mockGetGlobalSearch.mockResolvedValueOnce(apiResponse)
    mockUseHasRemotes.mockReturnValue({hasRemotes:false})

    render(WrappedComponentWithProps(GlobalSearchAutocomplete))
    const globalSearch = screen.getByTestId('global-search')

    // Type to trigger dropdown
    fireEvent.change(globalSearch, {target: {value: 'test'}})

    // Wait for results
    const items = await screen.findAllByTestId('global-search-list-item')

    // No item should have bg-base-200 (selected) class
    items.forEach(item => {
      expect(item).not.toHaveClass('bg-base-200')
    })
  })

  it('selects first item when ArrowDown pressed', async () => {
    mockGetGlobalSearch.mockResolvedValueOnce(apiResponse)
    mockUseHasRemotes.mockReturnValue({hasRemotes:false})

    render(WrappedComponentWithProps(GlobalSearchAutocomplete))
    const globalSearch = screen.getByTestId('global-search')

    // Type to trigger dropdown
    fireEvent.change(globalSearch, {target: {value: 'test'}})

    // Wait for results
    const items = await screen.findAllByTestId('global-search-list-item')

    // Press ArrowDown
    fireEvent.keyDown(globalSearch, {key: 'ArrowDown'})

    // First item should be selected
    expect(items[0]).toHaveClass('bg-base-200')
  })

  it('removes selection when ArrowUp pressed from first item', async () => {
    mockGetGlobalSearch.mockResolvedValueOnce(apiResponse)
    mockUseHasRemotes.mockReturnValue({hasRemotes:false})

    render(WrappedComponentWithProps(GlobalSearchAutocomplete))
    const globalSearch = screen.getByTestId('global-search')

    // Type to trigger dropdown
    fireEvent.change(globalSearch, {target: {value: 'test'}})

    // Wait for results
    const items = await screen.findAllByTestId('global-search-list-item')

    // Select first item
    fireEvent.keyDown(globalSearch, {key: 'ArrowDown'})
    expect(items[0]).toHaveClass('bg-base-200')

    // Press ArrowUp to deselect
    fireEvent.keyDown(globalSearch, {key: 'ArrowUp'})

    // No item should be selected
    items.forEach(item => {
      expect(item).not.toHaveClass('bg-base-200')
    })
  })

  it('navigates to search page when Enter pressed without selection (multiple results)', async () => {
    mockGetGlobalSearch.mockResolvedValueOnce(apiResponse)
    mockUseHasRemotes.mockReturnValue({hasRemotes:false})

    render(WrappedComponentWithProps(GlobalSearchAutocomplete))
    const globalSearch = screen.getByTestId('global-search')

    const searchTerm = 'test query'
    // Type to trigger dropdown
    fireEvent.change(globalSearch, {target: {value: searchTerm}})

    // Wait for results
    await screen.findAllByTestId('global-search-list-item')

    // Press Enter without selecting anything
    fireEvent.keyDown(globalSearch, {key: 'Enter'})

    // Should navigate to search page
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`/search?q=${encodeURIComponent(searchTerm)}`)
    })
  })

  it('navigates to search page when Enter pressed with no results', async () => {
    mockGetGlobalSearch.mockResolvedValueOnce([])
    mockUseHasRemotes.mockReturnValue({hasRemotes:false})

    render(WrappedComponentWithProps(GlobalSearchAutocomplete))
    const globalSearch = screen.getByTestId('global-search')

    const searchTerm = 'nothing found'
    // Type to trigger dropdown
    fireEvent.change(globalSearch, {target: {value: searchTerm}})

    // Wait for "No results..." message
    await screen.findByText('No results...')

    // Press Enter
    fireEvent.keyDown(globalSearch, {key: 'Enter'})

    // Should navigate to search page
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`/search?q=${encodeURIComponent(searchTerm)}`)
    })
  })

  it('navigates directly to item when only 1 result and Enter pressed', async () => {
    // Use item without domain so router.push is called instead of window.open
    const singleResult = [apiResponse[4]] // This item has domain: null
    mockGetGlobalSearch.mockResolvedValueOnce(singleResult)
    mockUseHasRemotes.mockReturnValue({hasRemotes:false})

    render(WrappedComponentWithProps(GlobalSearchAutocomplete))
    const globalSearch = screen.getByTestId('global-search')

    // Type to trigger dropdown
    fireEvent.change(globalSearch, {target: {value: 'single'}})

    // Wait for single result
    await screen.findAllByTestId('global-search-list-item')

    // Press Enter without selecting
    fireEvent.keyDown(globalSearch, {key: 'Enter'})

    // Should navigate directly to the item
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`/${singleResult[0].source}/${singleResult[0].slug}`)
    })
  })

  it('navigates to selected item when Enter pressed after ArrowDown', async () => {
    // Use items without domain so router.push is called instead of window.open
    const localResults = apiResponse.filter(item => item.domain === null)
    mockGetGlobalSearch.mockResolvedValueOnce(localResults)
    mockUseHasRemotes.mockReturnValue({hasRemotes:false})

    render(WrappedComponentWithProps(GlobalSearchAutocomplete))
    const globalSearch = screen.getByTestId('global-search')

    // Type to trigger dropdown
    fireEvent.change(globalSearch, {target: {value: 'test'}})

    // Wait for results
    await screen.findAllByTestId('global-search-list-item')

    // Select first item with ArrowDown
    fireEvent.keyDown(globalSearch, {key: 'ArrowDown'})

    // Press Enter
    fireEvent.keyDown(globalSearch, {key: 'Enter'})

    // Should navigate to first item
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`/${localResults[0].source}/${localResults[0].slug}`)
    })
  })

  it('selects item on mouse hover and navigates on Enter', async () => {
    // Use items without domain so router.push is called instead of window.open
    const localResults = apiResponse.filter(item => item.domain === null)
    mockGetGlobalSearch.mockResolvedValueOnce(localResults)
    mockUseHasRemotes.mockReturnValue({hasRemotes:false})

    render(WrappedComponentWithProps(GlobalSearchAutocomplete))
    const globalSearch = screen.getByTestId('global-search')

    // Type to trigger dropdown
    fireEvent.change(globalSearch, {target: {value: 'test'}})

    // Wait for results
    const items = await screen.findAllByTestId('global-search-list-item')

    // Hover over second item
    fireEvent.mouseEnter(items[1])

    // Second item should be selected
    expect(items[1]).toHaveClass('bg-base-200')

    // Press Enter
    fireEvent.keyDown(globalSearch, {key: 'Enter'})

    // Should navigate to second item
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`/${localResults[1].source}/${localResults[1].slug}`)
    })
  })

  it('resets selection when user types after selecting with arrow', async () => {
    mockGetGlobalSearch.mockResolvedValueOnce(apiResponse)
    mockUseHasRemotes.mockReturnValue({hasRemotes:false})

    render(WrappedComponentWithProps(GlobalSearchAutocomplete))
    const globalSearch = screen.getByTestId('global-search')

    // Type to trigger dropdown
    fireEvent.change(globalSearch, {target: {value: 'test'}})

    // Wait for results
    const items = await screen.findAllByTestId('global-search-list-item')

    // Select first item
    fireEvent.keyDown(globalSearch, {key: 'ArrowDown'})
    expect(items[0]).toHaveClass('bg-base-200')

    // Type more characters
    mockGetGlobalSearch.mockResolvedValueOnce(apiResponse)
    fireEvent.change(globalSearch, {target: {value: 'test more'}})

    // Wait for new results
    const newItems = await screen.findAllByTestId('global-search-list-item')

    // Selection should be reset
    newItems.forEach(item => {
      expect(item).not.toHaveClass('bg-base-200')
    })
  })

  it('opens external links in new tab when item has domain', async () => {
    const externalResult = [{
      ...apiResponse[0],
      domain: 'https://external-rsd.org'
    }]
    mockGetGlobalSearch.mockResolvedValueOnce(externalResult)
    mockUseHasRemotes.mockReturnValue({hasRemotes:true})

    // Mock window.open
    const mockWindowOpen = jest.fn()
    global.window.open = mockWindowOpen

    render(WrappedComponentWithProps(GlobalSearchAutocomplete))
    const globalSearch = screen.getByTestId('global-search')

    // Type to trigger dropdown
    fireEvent.change(globalSearch, {target: {value: 'external'}})

    // Wait for results
    await screen.findAllByTestId('global-search-list-item')

    // Select first item
    fireEvent.keyDown(globalSearch, {key: 'ArrowDown'})

    // Press Enter
    fireEvent.keyDown(globalSearch, {key: 'Enter'})

    // Should open in new tab
    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(externalResult[0].domain),
        '_blank'
      )
    })

    // Should NOT call router.push
    expect(mockPush).not.toHaveBeenCalled()
  })
})
