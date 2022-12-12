// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import SoftwareFilter from './index'

// MOCK
import mockKeywords from './__mocks__/softwareFilterKeywords.json'

const mockFindSoftwareWithKeyword = jest.fn(props => Promise.resolve([] as any))
jest.mock('./keywordForSoftware', () => ({
  findSoftwareWithKeyword: jest.fn(props => mockFindSoftwareWithKeyword(props))
}))

const mockOnApply=jest.fn()
const mockProps = {
  items: [],
  onApply: mockOnApply
} as any

describe('frontend/components/software/filter/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('can open filter with message no filter active', () => {
    // no active filters
    mockProps.items = []

    render(
      <SoftwareFilter {...mockProps} />
    )

    // open popup
    const filterBtn = screen.getByRole('button')
    fireEvent.click(filterBtn)

    // validate popover
    const popover = screen.getByRole('presentation')
    // has no filter active message
    const noFilterMsg = within(popover).getByText('No filter active')
  })

  it('can apply keyword filter', async() => {
    // no active filters
    mockProps.items = []
    // return mocked keywords
    mockFindSoftwareWithKeyword.mockResolvedValueOnce(mockKeywords)

    render(
      <SoftwareFilter {...mockProps} />
    )

    const filterBtn = screen.getByRole('button')
    fireEvent.click(filterBtn)

    const popover = screen.getByRole('presentation')

    // we have 1 combo
    const keywordSearch = within(popover).getByRole('combobox')
    // use mouse down to open options
    fireEvent.mouseDown(keywordSearch)

    // keyword options
    const options = await screen.findAllByRole('option')
    expect(options.length).toEqual(mockKeywords.length)
    // select first keyword option
    fireEvent.click(options[0])

    // we have one keyword selected
    const chips = screen.getAllByTestId('filter-item-chip')
    expect(chips.length).toEqual(1)

    // validate apply called after selection
    expect(mockOnApply).toBeCalledTimes(1)
    expect(mockOnApply).toBeCalledWith([
      mockKeywords[0].keyword]
    )
  })

  it('can remove keyword filter', async() => {
    // no active filters
    const keywords = ['Big data','Keyword 2']
    mockProps.items = keywords
    // return mocked keywords
    mockFindSoftwareWithKeyword.mockResolvedValueOnce(mockKeywords)

    render(
      <SoftwareFilter {...mockProps} />
    )

    const filterBtn = screen.getByRole('button')
    fireEvent.click(filterBtn)

    // get keyword selected
    const allChips = await screen.findAllByTestId('filter-item-chip')
    expect(allChips.length).toEqual(keywords.length)

    // remove first chip
    const delBtn = within(allChips[0]).getByTestId('CancelIcon')
    fireEvent.click(delBtn)

    // validate chip is removed
    const remainedChips = await screen.findAllByTestId('filter-item-chip')
    expect(remainedChips.length).toEqual(allChips.length - 1)

    // validate apply called
    expect(mockOnApply).toBeCalledTimes(1)
    expect(mockOnApply).toBeCalledWith([
      keywords[1]
    ])
  })
})

