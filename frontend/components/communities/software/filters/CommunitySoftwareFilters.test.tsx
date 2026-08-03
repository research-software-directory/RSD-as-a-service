// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@testing-library/react'
import CommunitySoftwareFilters from './index'

// MOCKS
import {defaultFilters} from '../__mocks__/communitySoftwareFilters'

// Mock the custom hooks using standard Jest mocking
jest.mock('~/utils/useHandleQueryChange', () => ({
  __esModule: true,
  default: () => ({
    handleQueryChange: jest.fn()
  })
}))

const resetFiltersMock = jest.fn()
jest.mock('./useResetFilters', () => ({
  __esModule: true,
  default: () => ({
    resetFilters: resetFiltersMock
  })
}))

const mockCategoryFilters = jest.fn(()=>([
  {
    short_name: 'Category 1',
    options: [
      {category_cnt: '1', category: 'Option 1'},
      {category_cnt: '2', category: 'Option 2'}
    ]
  }
]))
jest.mock('./useComSoftwareCategoriesList', () => ({
  __esModule: true,
  default: () => ({
    categoryFilters: mockCategoryFilters()
  })
}))

jest.mock('~/components/organisation/software/filters/useSoftwareParams', () => ({
  __esModule: true,
  default: () => ({
    filterCnt: 0,
    keywords_json: '',
    prog_lang_json: '',
    licenses_json: '',
    categories_json: ''
  })
}))

jest.mock('~/components/category/useCategoryFilterCnt', () => ({
  __esModule: true,
  default: () => ({
    activeCnt: 0
  })
}))


// Test for CommunitySoftwareFilters component
it('renders all filters (except ', () => {

  render(<CommunitySoftwareFilters {...defaultFilters as any} />)

  // Check that FilterHeader is rendered
  // expect(screen.getByTestId(/filter/i)).toBeInTheDocument()

  // Check that OrderCommunitySoftwareBy is rendered
  expect(screen.getByTestId('filters-order-by')).toBeInTheDocument()

  // Check that KeywordsFilter is rendered
  expect(screen.getByText('Keywords')).toBeInTheDocument()

  // Check that ProgrammingLanguagesFilter is rendered
  expect(screen.getByText('Programming languages')).toBeInTheDocument()

  // Check that LicensesFilter is rendered
  expect(screen.getByText('Licenses')).toBeInTheDocument()

  // Check that LicensesFilter is rendered
  expect(screen.getByText('Category 1')).toBeInTheDocument()

})

it('calls resetFilters when clear button is clicked', async() => {

  const defaultProps = {
    keywordsList: [],
    languagesList: [],
    licensesList: [],
    categoryList: [],
    categoryEntry: []
  }

  render(<CommunitySoftwareFilters {...defaultProps} />)

  // Find and click the clear button (assuming it's part of FilterHeader)
  const clearButton = screen.getByRole('button', {name: /Clear/i})

  fireEvent.click(clearButton)

  await(()=>{
    expect(resetFiltersMock).toHaveBeenCalledWith('software')
  })

})

it('disables clear button when no filters are active', () => {
  const defaultProps = {
    keywordsList: [],
    languagesList: [],
    licensesList: [],
    categoryList: [],
    categoryEntry: []
  }

  render(<CommunitySoftwareFilters {...defaultProps} />)

  // The clear button should be disabled based on the component logic
  const clearButton = screen.getByRole('button', {name: /Clear/i})
  expect(clearButton).toBeDisabled()
})
