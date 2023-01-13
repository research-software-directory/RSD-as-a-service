// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen,within} from '@testing-library/react'

import SoftwareFilter, {SoftwareFilterProps} from './index'

// MOCK
import mockKeywords from './__mocks__/softwareFilterKeywords.json'
import mockLanguages from './__mocks__/softwareProgLang.json'

const mockSearchForKeyword = jest.fn(props => Promise.resolve([] as any))
const mockSearchForProgrammingLanguage = jest.fn(props => Promise.resolve([] as any))
jest.mock('./softwareFilterApi', () => ({
  searchForKeyword: jest.fn(props => mockSearchForKeyword(props)),
  searchForProgrammingLanguage: jest.fn(props => mockSearchForProgrammingLanguage(props)),
}))

const mockOnApply=jest.fn()
const mockProps:SoftwareFilterProps = {
  keywords: [],
  prog_lang: [],
  onApply: mockOnApply
} as any

describe('frontend/components/software/filter/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('can open filter with message no filter active', () => {
    // no active filters
    mockProps.keywords = []
    mockProps.prog_lang = []

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

  it('can apply software filters', async() => {
    // no active filters
    mockProps.keywords = []
    mockProps.prog_lang = []
    // return mocked keywords
    mockSearchForKeyword.mockResolvedValueOnce(mockKeywords)
    // return mocked programming languages
    mockSearchForProgrammingLanguage.mockResolvedValueOnce(mockLanguages)

    render(
      <SoftwareFilter {...mockProps} />
    )

    const filterBtn = screen.getByRole('button')
    fireEvent.click(filterBtn)

    const popover = screen.getByRole('presentation')

    // we have 2 search/combos
    const combos = within(popover).getAllByRole('combobox')
    expect(combos.length).toEqual(2)

    // first is keyword
    const keywordSearch = combos[0]
    // second is programming language
    const progLangSearch = combos[1]

    // use mouse down to open options
    fireEvent.mouseDown(keywordSearch)

    // keyword options
    const optionsK = await screen.findAllByRole('option')
    expect(optionsK.length).toEqual(mockKeywords.length)
    // select first keyword option
    fireEvent.click(optionsK[0])


    // we have one keyword selected
    const chips = screen.getAllByTestId('filter-item-chip')
    expect(chips.length).toEqual(1)

    // validate apply called after selection
    expect(mockOnApply).toBeCalledTimes(1)
    expect(mockOnApply).toBeCalledWith({
      keywords: [mockKeywords[0].keyword],
      prog_lang: []
    })


    // select first keyword option
    fireEvent.mouseDown(progLangSearch)

    // screen.debug(progLangSearch)
    // programming languages
    const optionsL = await screen.findAllByRole('option')
    expect(optionsL.length).toEqual(mockLanguages.length)
    // select first prog lang option
    fireEvent.click(optionsL[0])

    // we have one keyword selected
    const allChips = screen.getAllByTestId('filter-item-chip')
    expect(allChips.length).toEqual(2)

    // validate apply called after selection
    expect(mockOnApply).toBeCalledTimes(2)
    expect(mockOnApply).toBeCalledWith({
      keywords: [mockKeywords[0].keyword],
      prog_lang: [mockLanguages[0].prog_lang]
    })
  })

  it('can remove keyword filter', async() => {
    // no active filters
    const keywords = ['Big data','Keyword 2']
    mockProps.keywords = keywords
    mockProps.prog_lang = []
    // return mocked keywords
    mockSearchForKeyword.mockResolvedValueOnce(mockKeywords)

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
    expect(mockOnApply).toBeCalledWith({
      keywords: [keywords[1]],
      prog_lang: []
    })
  })

  it('can remove programming language filter', async() => {
    // no active filters
    const prog_lang = ['Lang 1','Lang 2']
    mockProps.keywords = []
    mockProps.prog_lang = prog_lang
    // return mocked keywords
    mockSearchForKeyword.mockResolvedValueOnce(mockKeywords)

    render(
      <SoftwareFilter {...mockProps} />
    )

    const filterBtn = screen.getByRole('button')
    fireEvent.click(filterBtn)

    // get keyword selected
    const allChips = await screen.findAllByTestId('filter-item-chip')
    expect(allChips.length).toEqual(prog_lang.length)

    // remove first chip
    const delBtn = within(allChips[0]).getByTestId('CancelIcon')
    fireEvent.click(delBtn)

    // validate chip is removed
    const remainedChips = await screen.findAllByTestId('filter-item-chip')
    expect(remainedChips.length).toEqual(allChips.length - 1)

    // validate apply called
    expect(mockOnApply).toBeCalledTimes(1)
    expect(mockOnApply).toBeCalledWith({
      keywords: [],
      prog_lang: [prog_lang[1]]
    })
  })
})

