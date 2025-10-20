// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent, waitFor, waitForElementToBeRemoved, act} from '@testing-library/react'
import FindKeyword, {Keyword} from './FindKeyword'

/**
 * NOTE!
 * The async tests generate react act() warnings. The tests do work as intended.
 * It is unclear why the act() warnings are shown. Further investigation is needed.
 * The warning comes from debouncing fn using times
 */

// default is non-resolved promise - for first test
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSearch = jest.fn((props) => new Promise<Keyword[]>((res, rej) => {}))
const mockAdd = jest.fn()
const mockCreate = jest.fn()

const props = {
  config: {
    freeSolo: true,
    minLength: 3,
    label: 'Test label',
    help: 'Test help',
    reset: true,
    variant: 'standard' as any
  },
  searchForKeyword: mockSearch,
  onAdd:mockAdd,
  onCreate:mockCreate
}

afterEach(() => {
  jest.runOnlyPendingTimers()
  // jest.useRealTimers()
})

// this test needs to be first to return mocked non-resolving promise
it('calls seach Fn and renders the loader', async () => {
  // prepare
  jest.useFakeTimers()
  // const setTimeout = jest.spyOn(global, 'setTimeout')
  // setTimeout.mockClear()
  const searchFor = 'test'

  // render component
  render(<FindKeyword {...props} />)

  // input test value
  const searchInput = screen.getByRole('combobox')
  fireEvent.change(searchInput, {target: {value: searchFor}})

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    jest.runAllTimers()
  })

  await waitFor(() => {
    // validate that searchFn is called twice (first on load then on search)
    expect(mockSearch).toHaveBeenCalledTimes(2)
    // last called with seachFor term
    expect(mockSearch).toHaveBeenCalledWith({searchFor})
    // check if loader is present
    const loader = screen.getByTestId('circular-loader')
    expect(loader).toBeInTheDocument()
  })
})

it('renders component with label, help and input with role comobox', () => {
  // render component
  render(<FindKeyword {...props} />)
  // find elements
  const testLabel = screen.getByText(props.config.label)
  const testHelp = screen.getByText(props.config.help)
  const serchInput = screen.getByRole('combobox')
  expect(testLabel).toBeInTheDocument()
  expect(testHelp).toBeInTheDocument()
  expect(serchInput).toBeInTheDocument()
})


it('offer Add option when search has no results', async() => {
  // prepare
  jest.useFakeTimers()
  // resolve with no options twice (on load and on search)
  mockSearch
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([])
  // render component
  render(<FindKeyword {...props} />)

  // input test value
  const searchInput = screen.getByRole('combobox')
  const searchFor = 'test'
  fireEvent.change(searchInput, {target: {value: searchFor}})

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    jest.runAllTimers()
  })

  // then wait for loader to be removed
  await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))
  // wait for listbox and add option
  await waitFor(() => {
    const options = screen.getByRole('listbox')
    expect(options).toBeInTheDocument()
    const addOption = screen.getByText(`Add "${searchFor}"`)
    expect(addOption).toBeInTheDocument()
  })
})

it('DOES NOT offer Add option when search return result that match', async () => {
  // prepare
  jest.useFakeTimers()
  const searchFor = 'test'
  const searchCnt = 123
  // resolve with no options
  mockSearch
    // intial call on load
    .mockResolvedValueOnce([])
    // search call
    .mockResolvedValueOnce([{
      id: '123123',
      keyword: searchFor,
      cnt: searchCnt
    }])

  // render component
  render(<FindKeyword {...props} />)

  // input test value
  const searchInput = screen.getByRole('combobox')
  fireEvent.change(searchInput, {target: {value: searchFor}})

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    jest.runAllTimers()
  })

  // then wait for loader to be removed
  await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))
  // wait for listbox and add option
  await waitFor(() => {
    // find options
    const options = screen.getByRole('listbox')
    expect(options).toBeInTheDocument()
    // find api return option wit count
    const option = screen.getByText(`${searchFor} (${searchCnt})`)
    expect(option).toBeInTheDocument()
    // Add option should not be present
    const addOption = screen.queryByText(`Add "${searchFor}"`)
    expect(addOption).toBeNull()
  })
})

it('calls onCreate method with string value to add new option', async() => {
  // prepare
  jest.useFakeTimers()
  // resolve with no options
  mockSearch
    // intial call on load
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([])
  // render component
  render(<FindKeyword {...props} />)

  // input test value
  const searchInput = screen.getByRole('combobox')
  const searchFor = 'test'
  fireEvent.change(searchInput, {target: {value: searchFor}})

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    jest.runAllTimers()
  })

  // then wait for loader to be removed
  await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))
  // wait for listbox and add option

  const addOption = await screen.queryByText(`Add "${searchFor}"`)
  expect(addOption).toBeInTheDocument()
  if (addOption) {
    fireEvent.click(addOption)
    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockCreate).toHaveBeenCalledWith(searchFor)
  }
})

it('calls onAdd method to add option to selection', async() => {
  // prepare
  jest.useFakeTimers()
  // resolve
  const searchFor = 'test'
  const searchCnt = 123
  const mockOption = {
    id: '123123',
    keyword: searchFor,
    cnt: searchCnt
  }
  // resolve with no options
  mockSearch
    // intial call on load
    .mockResolvedValueOnce([])
    // search call
    .mockResolvedValueOnce([mockOption])
  // render component
  render(<FindKeyword {...props} />)

  // input test value
  const searchInput = screen.getByRole('combobox')
  fireEvent.change(searchInput, {target: {value: searchFor}})

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    jest.runAllTimers()
  })

  // then wait for loader to be removed
  await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))
  // wait for listbox and add option

  const addOption = await screen.queryByText(`${searchFor} (${searchCnt})`)
  expect(addOption).toBeInTheDocument()

  if (addOption) {
    fireEvent.click(addOption)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledWith(mockOption)
  }
})

