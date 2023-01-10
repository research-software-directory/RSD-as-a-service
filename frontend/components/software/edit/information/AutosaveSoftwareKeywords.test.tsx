// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, within, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AutosaveSoftwareKeywords, {SoftwareKeywordsProps} from './AutosaveSoftwareKeywords'

// MOCKS
import softwareKeywords from './__mocks__/softwareKeywords.json'

// MOCK searchForKeyword
import keywords from '~/components/keyword/__mocks__/keywords.json'
const mockSearchForSoftwareKeyword = jest.fn(props => Promise.resolve(keywords))
jest.mock('./searchForSoftwareKeyword', () => ({
  searchForSoftwareKeyword: jest.fn(props => mockSearchForSoftwareKeyword(props)),
}))

// MOCK addKeywordsToSoftware, createOrGetKeyword, deleteKeywordFromSoftware, silentKeywordDelete
const mockAddKeywordsToSoftware = jest.fn(props => Promise.resolve('OK' as any))
const mockCreateOrGetKeyword = jest.fn(props => Promise.resolve([] as any))
const mockDeleteKeywordFromSoftware = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
const mockSilentKeywordDelete = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
jest.mock('~/utils/editKeywords', () => ({
  addKeywordsToSoftware: jest.fn(props => mockAddKeywordsToSoftware(props)),
  createOrGetKeyword: jest.fn(props => mockCreateOrGetKeyword(props)),
  deleteKeywordFromSoftware: jest.fn(props => mockDeleteKeywordFromSoftware(props)),
  silentKeywordDelete: jest.fn(props=>mockSilentKeywordDelete(props))
}))

// MOCK getKeywordsFromDoi
const mockGetKeywordsFromDoi = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/getInfoFromDatacite', () => ({
  getKeywordsFromDoi: jest.fn(props=>mockGetKeywordsFromDoi(props))
}))

const mockProps:SoftwareKeywordsProps = {
  software_id: 'test-software-id',
  items: softwareKeywords,
}

beforeEach(() => {
  jest.clearAllMocks()
})

it('renders mocked software keywords', () => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveSoftwareKeywords {...mockProps} />
    </WithAppContext>
  )

  // validate first item text present
  const firtsKeyword = screen.getByText(mockProps.items[0].keyword)
  expect(firtsKeyword).toBeInTheDocument()

  // validate all keywords present by array length
  const keywords = screen.getAllByTestId('keyword-chip')
  expect(keywords.length).toEqual(mockProps.items.length)
})

it('can add keyword from option list', async() => {
  // use on from the list
  const searchFor = keywords[2].keyword
  mockProps.items = []

  // mock OK response
  mockAddKeywordsToSoftware.mockResolvedValueOnce({
    status: 200,
    message: 'OK'
  })

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveSoftwareKeywords {...mockProps} />
    </WithAppContext>
  )

  // initially we call search with ""
  expect(mockSearchForSoftwareKeyword).toBeCalledTimes(1)
  expect(mockSearchForSoftwareKeyword).toBeCalledWith({
    searchFor:''
  })

  const searchInput = screen.getByRole('combobox')
  // click on input combo
  fireEvent.click(searchInput)

  // start typing
  fireEvent.change(searchInput, {target: {value: searchFor}})
  expect(searchInput).toHaveValue(searchFor)

  // get all options
  const options = await screen.findAllByRole('option')
  expect(options.length).toEqual(keywords.length)

  // add first option from the list
  fireEvent.click(options[0])

  await waitFor(() => {
    expect(mockAddKeywordsToSoftware).toBeCalledTimes(1)
    expect(mockAddKeywordsToSoftware).toBeCalledWith({
      'data': {
        'keyword': keywords[0].id,
        'software': mockProps.software_id,
      },
      'token': mockSession.token,
    })
  })
  // wait for keyword chip to be loaded
  const chips = await screen.findAllByTestId('keyword-chip')
  // confirm first keyword is added
  const firstKeyword = screen.getByText(keywords[0].keyword)
  expect(firstKeyword).toBeInTheDocument()
})

it('can import keyword from DOI', async() => {
  // no keywords to start
  mockProps.items = []
  mockProps.concept_doi = '10.1017/9781009085809'
  const resolvedKeyword = ['keyword 1']
  const keywordId = 'unique-keyword-id-1'
  // mock getKeywordsFromDoi api
  mockGetKeywordsFromDoi.mockResolvedValueOnce(resolvedKeyword)
  // mock createOrGetKeyword api
  mockCreateOrGetKeyword.mockResolvedValueOnce({
    status: 201,
    message: {
      id: keywordId,
      value: resolvedKeyword[0]
    }
  })
  // mock OK response
  mockAddKeywordsToSoftware.mockResolvedValueOnce({
    status: 200,
    message: 'OK'
  })

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveSoftwareKeywords {...mockProps} />
    </WithAppContext>
  )

  // click on import button
  const importBtn = screen.getByRole('button', {
    name: 'Import keywords'
  })
  fireEvent.click(importBtn)

  // wait for loader in import button to be removed
  await waitForElementToBeRemoved(within(importBtn).getByRole('progressbar'))

  await waitFor(() => {
    // validate import api called
    expect(mockGetKeywordsFromDoi).toBeCalledTimes(1)
    expect(mockGetKeywordsFromDoi).toBeCalledWith(mockProps.concept_doi)

    // validate create keyword api called
    expect(mockCreateOrGetKeyword).toBeCalledTimes(1)
    expect(mockCreateOrGetKeyword).toBeCalledWith({
      'keyword': resolvedKeyword[0],
      'token': mockSession.token,
    })

    // validate addKeywordToSoftware api called
    expect(mockAddKeywordsToSoftware).toBeCalledTimes(1)
    expect(mockAddKeywordsToSoftware).toBeCalledWith({
      data: {
        'keyword': 'unique-keyword-id-1',
        'software': mockProps.software_id,
      },
      'token': mockSession.token,
    })
    // validate keyword listed
    const chips = screen.getAllByTestId('keyword-chip')
    expect(chips.length).toEqual(resolvedKeyword.length)
  })
})

it('can add NEW keyword', async () => {
  // no keywords to start
  mockProps.items = []
  const newKeyword = {
    id: 'new-keyword-id',
    value: 'New keyword to add'
  }
  // mock createOrGetKeyword api
  mockCreateOrGetKeyword.mockResolvedValueOnce({
    status: 201,
    message: {
      id: newKeyword.id,
      value: newKeyword.value
    }
  })
  // mock OK response
  mockAddKeywordsToSoftware.mockResolvedValueOnce({
    status: 200,
    message: 'OK'
  })

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveSoftwareKeywords {...mockProps} />
    </WithAppContext>
  )

  // validate we initialy call search with "" to get initial list
  expect(mockSearchForSoftwareKeyword).toBeCalledTimes(1)
  expect(mockSearchForSoftwareKeyword).toBeCalledWith({
    searchFor: ''
  })

  const searchInput = screen.getByRole('combobox')
  // click on input combo
  fireEvent.click(searchInput)

  // start typing
  fireEvent.change(searchInput, {target: {value: newKeyword.value}})
  expect(searchInput).toHaveValue(newKeyword.value)


  await waitFor(() => {
    // validate search is called with searchFor (second time)
    expect(mockSearchForSoftwareKeyword).toBeCalledWith({
      searchFor:newKeyword.value
    })
  })

  // get add option
  const addOption = await screen.findByRole('option', {
    name: `Add "${newKeyword.value}"`
  })
  // selected new item
  fireEvent.click(addOption)

  await waitFor(() => {
    expect(mockCreateOrGetKeyword).toBeCalledTimes(1)
    expect(mockCreateOrGetKeyword).toBeCalledWith({
      'keyword': newKeyword.value,
      'token': mockSession.token,
    })
  })

  // confirm new keyword added
  const chips = await screen.findAllByTestId('keyword-chip')
  expect(chips.length).toEqual(1)
  expect(chips[0]).toHaveTextContent(newKeyword.value)
})

it('can REMOVE keyword', async() => {
  // start with initial selection
  mockProps.items = softwareKeywords

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveSoftwareKeywords {...mockProps} />
    </WithAppContext>
  )

  // get all keyword chips
  const chips = screen.getAllByTestId('keyword-chip')

  // use first to remove
  const deleteBtn = within(chips[0]).getByTestId('CancelIcon')
  fireEvent.click(deleteBtn)

  await waitFor(() => {
    // validate remove keyword from project
    expect(mockDeleteKeywordFromSoftware).toBeCalledTimes(1)
    expect(mockDeleteKeywordFromSoftware).toBeCalledWith({
      'keyword': softwareKeywords[0].id,
      'software': softwareKeywords[0].software,
      'token': mockSession.token,
    })
    // validate silent keyword delete is called
    expect(mockSilentKeywordDelete).toBeCalledTimes(1)
    expect(mockSilentKeywordDelete).toBeCalledWith({
      'keyword': softwareKeywords[0].keyword,
      'token': mockSession.token,
    })

    // validate chip is removed
    const remainChips = screen.getAllByTestId('keyword-chip')
    // the length is -1
    expect(remainChips.length).toEqual(softwareKeywords.length-1)
  })
})
