// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent, waitFor, act, waitForElementToBeRemoved} from '@testing-library/react'
import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import FindMention, {FindMentionProps} from './FindMention'

// default is non-resolved promise - for first test
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSearchFn = jest.fn((props) => new Promise<MentionItemProps[]>((res, rej) => {}))
const mockAdd = jest.fn()
const mockCreate = jest.fn()
// mock mention
const mockMentionItem = {
  id: '1',
  doi: 'doi-test',
  url: 'url-test',
  title: 'test-title',
  authors: 'test-authors',
  publisher: 'test-publisher',
  publication_year: 2020,
  page: null,
  // url to external image
  image_url: null,
  // is_featured?: boolean
  mention_type: 'book' as MentionTypeKeys,
  source: 'crossref',
  note: null,
  journal: null
}

const props:FindMentionProps = {
  config: {
    freeSolo: true,
    minLength: 3,
    label: 'Test label',
    help: 'Test help',
    reset: true
  },
  searchFn: mockSearchFn,
  onAdd: mockAdd,
  onCreate: mockCreate
}

jest.useFakeTimers()

afterEach(() => {
  jest.runOnlyPendingTimers()
  // jest.useRealTimers()
})

it('has working cancel button when freeSolo', async () => {
  props.config.freeSolo=true
  const searchFor = 'test string'
  // render component
  render(<FindMention {...props} />)
  // input test value
  const searchInput = screen.getByRole('combobox')
  fireEvent.change(searchInput, {target: {value: searchFor}})

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    jest.runOnlyPendingTimers()
  })

  const cancelBtn = screen.getByRole('button', {hidden:true})
  expect(cancelBtn).toBeInTheDocument()
  expect(cancelBtn.getAttribute('title')).toEqual('Cancel')

  // shows loader. NOTE! we do not return promise by default
  const loader = screen.getByTestId('circular-loader')
  expect(loader).toBeInTheDocument()

  // press cancel button
  fireEvent.click(cancelBtn)
  // confim that loader is gone
  expect(loader).not.toBeInTheDocument()
})

it('shows custom notFound message when freeSolo=true AND onCreate=undefined', async () => {
  const notFound = 'Tested not found message'
  props.config = {
    ...props.config,
    freeSolo: true,
    noOptions: {
      notFound,
      empty: 'Not tested',
      minLength: 'Not tested'
    }
  }
  props.onCreate = undefined

  // resolve with no options
  mockSearchFn.mockResolvedValueOnce([])

  // render component
  render(<FindMention {...props} />)

  // input test value
  const searchInput = screen.getByRole('combobox')
  const searchFor = 'test'
  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    fireEvent.change(searchInput, {target: {value: searchFor}})
    jest.runOnlyPendingTimers()
  })

  // then wait for loader to be removed
  await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))

  // wait for listbox and notFound message
  await waitFor(() => {
    const options = screen.getByRole('listbox')
    expect(options).toBeInTheDocument()
    const notFoundMsg = screen.getByText(notFound)
    expect(notFoundMsg).toBeInTheDocument()
  })
})

it('does not show Add option when onCreate=undefined', async () => {
  // resolve with no options
  mockSearchFn.mockResolvedValueOnce([mockMentionItem,mockMentionItem])
  // SET RESET TO FALSE
  props.config.reset = false
  // remove onCreate fn
  props.onCreate = undefined
  // render component
  render(<FindMention {...props} />)
  // input test value
  const searchInput = screen.getByRole('combobox')
  const searchFor = 'test'

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    fireEvent.change(searchInput, {target: {value: searchFor}})
    jest.runOnlyPendingTimers()
  })

  // then wait for loader to be removed
  await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))

  // select only option in dropdown
  const options = screen.getAllByRole('option')
  expect(options.length).toEqual(2)
  // click first options
  fireEvent.click(options[0])
  expect(mockAdd).toHaveBeenCalledTimes(1)
  expect(mockAdd).toHaveBeenCalledWith(mockMentionItem)
})

// NOT ALLOWED WITH MENTIONS but we test
it('shows Add option when onCreate defined', async () => {
  // resolve with no options
  mockSearchFn.mockResolvedValueOnce([mockMentionItem,mockMentionItem])
  // SET RESET TO FALSE
  props.config.reset = false
  // remove onCreate fn
  props.onCreate = mockCreate
  // render component
  render(<FindMention {...props} />)
  // input test value
  const searchInput = screen.getByRole('combobox')
  const searchFor = 'test'

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    fireEvent.change(searchInput, {target: {value: searchFor}})
    jest.runOnlyPendingTimers()
  })

  // then wait for loader to be removed
  await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))

  // select only options in dropdown
  const options = screen.getAllByRole('option')
  expect(options.length).toEqual(3)

  // find Add test
  const add = screen.getByText(`Add "${searchFor}"`)
  expect(add).toBeInTheDocument()

  // select first option
  const firstOption = options[0]
  fireEvent.click(firstOption)
  expect(mockCreate).toHaveBeenCalledTimes(1)
  expect(mockCreate).toHaveBeenCalledWith(searchFor)
})

it('leaves input value after selection when reset=false', async () => {
  // resolve with no options
  mockSearchFn.mockResolvedValueOnce([mockMentionItem,mockMentionItem])
  // SET RESET TO FALSE
  props.config.reset = false
  // remove onCreate fn
  props.onCreate = undefined
  // render component
  render(<FindMention {...props} />)
  // input test value
  const searchInput = screen.getByRole('combobox')
  const searchFor = 'test'

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    fireEvent.change(searchInput, {target: {value: searchFor}})
    jest.runOnlyPendingTimers()
  })

  // then wait for loader to be removed
  // required for rest of the test to pass
  await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))

  // select only option in dropdown
  const options = screen.getAllByRole('option')
  expect(options.length).toEqual(2)

  // click on the option
  fireEvent.click(options[0])

  // expect input to be preset
  expect(searchInput).toHaveValue(mockMentionItem.title)
})

it('removes input after selection when reset=true', async () => {
  // resolve with no options
  mockSearchFn.mockResolvedValueOnce([mockMentionItem, mockMentionItem])
  // SET RESET TO FALSE
  props.config.reset = true
  // remove onCreate fn
  props.onCreate = undefined
  // render component
  render(<FindMention {...props} />)
  // input test value
  const searchInput = screen.getByRole('combobox')
  const searchFor = 'test'

  // need to advance all timers for debounce etc...
  // Note! it needs to be wrapped in act
  act(() => {
    fireEvent.change(searchInput, {target: {value: searchFor}})
    jest.runOnlyPendingTimers()
  })

  // then wait for loader to be removed
  // requied for rest of the test to pass
  await waitForElementToBeRemoved(() => screen.getByTestId('circular-loader'))

  const options = screen.getAllByRole('option')
  expect(options.length).toEqual(2)
  // select option
  fireEvent.click(options[0])
  // exper input to be reset
  expect(searchInput).toHaveValue('')
})
