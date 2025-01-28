// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'

import KeywordTable from './KeywordTable'

import mockKeywordData from './__mocks__/keyword_cnt.json'

const mockProps = {
  loading: true,
  keywords: [],
  searchFor: '',
  deleteKeyword: jest.fn()
}

beforeEach(() => {
  jest.resetAllMocks()
})

it('shows loader when loading=true', () => {

  render(
    <KeywordTable {...mockProps} />
  )
  screen.getByRole('progressbar')
})

it('shows no keyword message', () => {
  mockProps.loading = false
  mockProps.keywords = []

  render(
    <KeywordTable {...mockProps} />
  )

  screen.getByText('Keyword not found')
})

it('shows mocked data with deleteBtn', () => {
  mockProps.loading = false
  mockProps.keywords = mockKeywordData as any

  render(
    <KeywordTable {...mockProps} />
  )

  // get all delete buttons
  const deleteBtn = screen.getAllByRole('button')
  // expect each keyword has one
  expect(deleteBtn.length).toEqual(mockKeywordData.length)
  // screen.debug()
})

it('has links to software and project pages with the correct keyword filter', () => {
  mockProps.loading = false
  mockProps.keywords = mockKeywordData as any

  render(
    <KeywordTable {...mockProps} />
  )

  // get all delete buttons
  const links = screen.getAllByRole('link')
  // expect each keyword has two links
  expect(links.length).toEqual(mockKeywordData.length * 2)

  // expect links to software and project overview with keyword filter
  expect((links[0] as HTMLAnchorElement).href).toEqual('http://localhost/software?keywords=%5B%22Big%20data%22%5D')
  expect((links[1] as HTMLAnchorElement).href).toEqual('http://localhost/projects?keywords=%5B%22Big%20data%22%5D')
})


it('deleteBtn is disabled when keyword is used (count>0)', () => {
  mockProps.loading = false
  mockProps.keywords = mockKeywordData as any

  render(
    <KeywordTable {...mockProps} />
  )

  // get all delete buttons
  const deleteBtn = screen.getAllByRole('button')
  // expect each keyword has one
  expect(deleteBtn[0]).toBeDisabled()
  // screen.debug()
})

it('deleteBtn is enabled when keyword is NOT used', async() => {
  const newMock = [
    {
      ...mockKeywordData[0],
      software_cnt: 0,
      projects_cnt: 0
    }
  ]
  mockProps.loading = false
  mockProps.keywords = newMock as any

  render(
    <KeywordTable {...mockProps} />
  )

  // get all delete buttons
  const deleteBtn = screen.getAllByRole('button')
  // expect each keyword has one
  expect(deleteBtn[0]).toBeEnabled()

  fireEvent.click(deleteBtn[0])
  // validate call
  expect(mockProps.deleteKeyword).toHaveBeenCalledTimes(1)
  expect(mockProps.deleteKeyword).toHaveBeenCalledWith(mockKeywordData[0].id)
  // screen.debug()
})
