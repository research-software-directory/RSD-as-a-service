// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen,within} from '@testing-library/react'

import ProjectFilter from './index'

import mockKeywords from './__mocks__/projectFilterKeywords.json'
import mockResearchDomains from './__mocks__/projectFilterResearchDomain.json'

const mockOnApply = jest.fn()

// MOCK projectFilterApi
const mockSearchForKeyword = jest.fn(props => Promise.resolve([]as any))
const mockSearchForResearchDomain = jest.fn(props => Promise.resolve([]as any))
const mockGetResearchDomainInfo = jest.fn(props => Promise.resolve([]as any))
jest.mock('./projectFilterApi', () => ({
  searchForResearchDomain: jest.fn(props => mockSearchForResearchDomain(props)),
  getResearchDomainInfo: jest.fn(props => mockGetResearchDomainInfo(props)),
  searchForKeyword: jest.fn(props => mockSearchForKeyword(props)),
}))

const mockProps = {
  keywords: [] as any,
  domains: [] as any,
  onApply: mockOnApply
}

describe('components/projects/filter/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('can select project filters', async() => {
    // return mocked keywords
    mockSearchForKeyword.mockResolvedValueOnce(mockKeywords)
    // return mocked domains
    mockSearchForResearchDomain.mockResolvedValueOnce(mockResearchDomains)

    render(
      <ProjectFilter {...mockProps} />
    )

    const filterBtn = screen.getByRole('button')
    fireEvent.click(filterBtn)

    const popover = screen.getByRole('presentation')

    // we have 2 search/combos
    const combos = within(popover).getAllByRole('combobox')
    expect(combos.length).toEqual(2)

    // first is keyword
    const keywordSearch = combos[0]
    // second is domain
    const domainSearch = combos[1]

    // use mouse down to open options
    fireEvent.mouseDown(keywordSearch)
    // keyword options
    const optionsK = await screen.findAllByRole('option')
    expect(optionsK.length).toBeGreaterThan(0)
    // select first keyword option
    fireEvent.click(optionsK[0])

    // we have one keyword selected
    const chips = screen.getAllByTestId('filter-item-chip')
    expect(chips.length).toEqual(1)

    // validate apply called after selection
    expect(mockOnApply).toBeCalledTimes(1)
    expect(mockOnApply).toBeCalledWith({
      domains: [],
      keywords: [mockKeywords[0].keyword],
    })

    // use mouse down to open domain options
    fireEvent.mouseDown(domainSearch)
    // keyword options
    const optionsD = await screen.findAllByRole('option')
    expect(optionsD.length).toBeGreaterThan(0)
    // select first domain option
    fireEvent.click(optionsD[0])

    // we have one keyword selected
    const allChips = screen.getAllByTestId('filter-item-chip')
    expect(allChips.length).toEqual(2)

    // validate apply called after selection
    expect(mockOnApply).toBeCalledTimes(2)
    expect(mockOnApply).toBeCalledWith({
      domains: [mockResearchDomains[0].key],
      keywords: [mockKeywords[0].keyword],
    })
  })

  it('can remove filter items', async() => {
    // return mocked keywords
    mockSearchForKeyword.mockResolvedValueOnce(mockKeywords)
    // return mocked domains
    mockSearchForResearchDomain.mockResolvedValueOnce(mockResearchDomains)
    // return research domain info based on key
    mockGetResearchDomainInfo.mockResolvedValueOnce([mockResearchDomains[0]])

    mockProps.keywords = [mockKeywords[0].keyword, mockKeywords[1].keyword]
    mockProps.domains = [mockResearchDomains[0]]

    render(
      <ProjectFilter {...mockProps} />
    )

    // open filter popover
    const filterBtn = screen.getByRole('button')
    fireEvent.click(filterBtn)

    // we have one keyword selected
    const allChips = await screen.findAllByTestId('filter-item-chip')
    expect(allChips.length).toEqual(3)

    // remove first chip
    const delBtn = within(allChips[0]).getByTestId('CancelIcon')
    fireEvent.click(delBtn)

    // validate chip is removed
    const remainedChips = await screen.findAllByTestId('filter-item-chip')
    expect(remainedChips.length).toEqual(allChips.length - 1)

    // validate apply called
    expect(mockOnApply).toBeCalledTimes(1)
    expect(mockOnApply).toBeCalledWith({
      domains: [mockResearchDomains[0].key],
      keywords: [mockKeywords[1].keyword],
    })
  })

  it('can CLEAR filter', async() => {
    // return mocked keywords
    mockSearchForKeyword.mockResolvedValueOnce(mockKeywords)
    // return mocked domains
    mockSearchForResearchDomain.mockResolvedValueOnce(mockResearchDomains)
    // return research domain info based on key
    mockGetResearchDomainInfo.mockResolvedValueOnce([mockResearchDomains[0]])

    mockProps.keywords = [mockKeywords[0].keyword, mockKeywords[1].keyword]
    mockProps.domains = [mockResearchDomains[0]]

    render(
      <ProjectFilter {...mockProps} />
    )

    // open filter popover
    const filterBtn = screen.getByRole('button')
    fireEvent.click(filterBtn)

    // click on Clear button
    const clearBtn = screen.getByRole('button', {
      name: 'Clear'
    })
    fireEvent.click(clearBtn)

    // validate apply called
    expect(mockOnApply).toBeCalledTimes(1)
    expect(mockOnApply).toBeCalledWith({
      domains: [],
      keywords: [],
    })
  })

})
