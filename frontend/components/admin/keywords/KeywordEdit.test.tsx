// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'

import KeywordEdit from './KeywordEdit'

// MOCKS
import mockKeywordData from './__mocks__/keyword_cnt.json'
const mockPatchKeyword = jest.fn()
jest.mock('./apiKeywords', () => ({
  patchKeyword:(props:any)=>mockPatchKeyword(props)
}))


beforeEach(() => {
  jest.resetAllMocks()
})

it('shows data to edit', () => {

  render(
    <KeywordEdit
      id={mockKeywordData[0].id}
      keyword={mockKeywordData[0].keyword}
      token='TEST-TOKEN'
    />
  )

  const input = screen.getByRole<HTMLInputElement>('textbox')
  expect(input.value).toEqual(mockKeywordData[0].keyword)
})

it('Escape resets to original value', async() => {

  render(
    <KeywordEdit
      id={mockKeywordData[0].id}
      keyword={mockKeywordData[0].keyword}
      token='TEST-TOKEN'
    />
  )

  const input = screen.getByRole<HTMLInputElement>('textbox')

  // change value
  fireEvent.change(input, {target: {value: 'Test value'}})
  // validate changed value
  expect(input.value).toEqual('Test value')

  // now use escape to reset
  fireEvent.keyDown(input, {key:'Escape'})
  expect(input.value).toEqual(mockKeywordData[0].keyword)
})

it('On blur updates keyword', async() => {

  render(
    <KeywordEdit
      id={mockKeywordData[0].id}
      keyword={mockKeywordData[0].keyword}
      token='TEST-TOKEN'
    />
  )

  const input = screen.getByRole<HTMLInputElement>('textbox')
  const newValue = 'Test value'
  // change value
  fireEvent.change(input, {target: {value: newValue}})
  // validate changed value
  expect(input.value).toEqual(newValue)

  // now use escape to reset
  fireEvent.blur(input)

  expect(mockPatchKeyword).toHaveBeenCalledTimes(1)

  const expected = {
    'id': mockKeywordData[0].id,
    'token': 'TEST-TOKEN',
    'value': newValue,
  }
  expect(mockPatchKeyword).toHaveBeenCalledWith(expected)

})


