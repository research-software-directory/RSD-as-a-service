// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, act, within} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AutosaveProjectKeywords from './AutosaveProjectKeywords'


// MOCKS
import projectKeywords from './__mocks__/projectKeywords.json'

// MOCK searchForKeyword
import keywords from '~/components/keyword/__mocks__/keywords.json'
const mockSearchForProjectKeyword = jest.fn(props=>Promise.resolve(keywords))
jest.mock('./searchForKeyword', () => ({
  searchForProjectKeyword: jest.fn(props=>mockSearchForProjectKeyword(props))
}))

// MOCK addKeywordsToProject
const mockAddKeywordsToProject = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
const mockCreateOrGetKeyword = jest.fn(props => Promise.resolve({
  status: 201,
  message: {
    id: 'test-keyword-id',
    value: props.keyword
  }
}))
const mockDeleteKeywordFromProject = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
const mockSilentKeywordDelete = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
jest.mock('~/utils/editKeywords', () => ({
  addKeywordsToProject: jest.fn(props => mockAddKeywordsToProject(props)),
  createOrGetKeyword: jest.fn(props => mockCreateOrGetKeyword(props)),
  deleteKeywordFromProject: jest.fn(props => mockDeleteKeywordFromProject(props)),
  silentKeywordDelete: jest.fn(props=>mockSilentKeywordDelete(props))
}))

const mockProps = {
  project_id: 'test-project-id',
  items: projectKeywords
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
})

it('renders mocked project keywords', () => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveProjectKeywords {...mockProps} />
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

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveProjectKeywords {...mockProps} />
    </WithAppContext>
  )

  // initially we call search with ""
  expect(mockSearchForProjectKeyword).toBeCalledTimes(1)
  expect(mockSearchForProjectKeyword).toBeCalledWith({
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
    expect(mockAddKeywordsToProject).toBeCalledTimes(1)
    expect(mockAddKeywordsToProject).toBeCalledWith({
       'data': [
         {
           'keyword': keywords[0].id,
           'project': mockProps.project_id,
         },
       ],
       'token': mockSession.token,
    })
  })
  // wait for keyword chip to be loaded
  const chips = await screen.findAllByTestId('keyword-chip')
  // confirm first keyword is added
  const firstKeyword = screen.getByText(keywords[0].keyword)
  expect(firstKeyword).toBeInTheDocument()
})

it('can add NEW keyword', async () => {
  // use on from the list
  const searchFor = 'Non existing keyword'
  mockProps.items = []

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveProjectKeywords {...mockProps} />
    </WithAppContext>
  )

  // initially we call search with ""
  expect(mockSearchForProjectKeyword).toBeCalledTimes(1)
  expect(mockSearchForProjectKeyword).toBeCalledWith({
    searchFor:''
  })

  const searchInput = screen.getByRole('combobox')
  // click on input combo
  fireEvent.click(searchInput)

  // start typing
  fireEvent.change(searchInput, {target: {value: searchFor}})
  expect(searchInput).toHaveValue(searchFor)

  // get add option
  const addOption = await screen.findByRole('option', {
    name: `Add "${searchFor}"`
  })

  // validate search is called with searchFor
  expect(mockSearchForProjectKeyword).toBeCalledWith({
    searchFor
  })

  // selected new item
  fireEvent.click(addOption)

  await waitFor(() => {
    expect(mockCreateOrGetKeyword).toBeCalledTimes(1)
    expect(mockCreateOrGetKeyword).toBeCalledWith({
      'keyword': searchFor,
      'token': mockSession.token,
    })
  })

  // confirm new keyword added
  const chips = await screen.findAllByTestId('keyword-chip')
  expect(chips.length).toEqual(1)
  expect(chips[0]).toHaveTextContent(searchFor)
})

it('can REMOVE keyword', async () => {
  // use on from the list
  mockProps.project_id= 'test-project-id'
  mockProps.items = projectKeywords

  render(
    <WithAppContext options={{session: mockSession}}>
      <AutosaveProjectKeywords {...mockProps} />
    </WithAppContext>
  )

  // get all keyword chips
  const chips = screen.getAllByTestId('keyword-chip')

  // use first to remove
  const deleteBtn = within(chips[0]).getByTestId('CancelIcon')
  fireEvent.click(deleteBtn)

  await waitFor(() => {
    // validate remove keyword from project
    expect(mockDeleteKeywordFromProject).toBeCalledTimes(1)
    expect(mockDeleteKeywordFromProject).toBeCalledWith({
      'keyword': projectKeywords[0].id,
      'project': projectKeywords[0].project,
      'token': mockSession.token,
    })
    // validate silent keyword delete is called
    expect(mockSilentKeywordDelete).toBeCalledTimes(1)
    expect(mockSilentKeywordDelete).toBeCalledWith({
      'keyword': projectKeywords[0].keyword,
      'token': mockSession.token,
    })

    // validate chip is removed
    const remainChips = screen.getAllByTestId('keyword-chip')
    // the length is -1
    expect(remainChips.length).toEqual(projectKeywords.length-1)
  })
})
