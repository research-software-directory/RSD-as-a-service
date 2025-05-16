// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, within} from '@testing-library/react'
import {WithAppContext,defaultUserSettings} from '~/utils/jest/WithAppContext'

import SoftwareOverviewPage from '../pages/software/index'

// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
jest.mock('~/auth/api/useLoginProviders')

// mocked data & props
import mockData from './__mocks__/softwareOverviewData.json'

const mockProps = {
  search:null,
  keywords:null,
  prog_lang: null,
  licenses:null,
  sources: null,
  order: '',
  page: 1,
  rows: 12,
  count: 408,
  keywordsList: mockData.keywordsList,
  languagesList: mockData.languagesList,
  licensesList: mockData.licensesList,
  sourcesList: [],
  hostsList: [],
  software: mockData.software as any,
  highlights: mockData.highlights as any,
  hasRemotes: false,
}

describe('pages/software/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders title All software', () => {
    render(
      <WithAppContext>
        <SoftwareOverviewPage {...mockProps} />
      </WithAppContext>
    )
    const heading = screen.getByRole('heading',{
      name: 'All software'
    })
    expect(heading).toBeInTheDocument()
  })
  it('renders highlights section with all (5) items', () => {
    render(
      <WithAppContext>
        <SoftwareOverviewPage {...mockProps} />
      </WithAppContext>
    )
    screen.getByTestId('highlights-carousel')
    const cards = screen.getAllByTestId('highlights-card')
    expect(cards.length).toEqual(mockData.highlights.length)
  })

  it('renders software filter panel with orderBy and 3 filters (combobox)', () => {
    render(
      <WithAppContext>
        <SoftwareOverviewPage {...mockProps} />
      </WithAppContext>
    )
    // get reference to filter panel
    const panel = screen.getByTestId('filters-panel')
    // find order by testid
    // within(panel).getByTestId('filters-order-by')
    // should have 4 filters
    const filters = within(panel).getAllByRole('combobox')
    expect(filters.length).toEqual(4)
    // screen.debug(filters)
  })

  it('renders searchbox with placeholder Find software', async () => {
    render(
      <WithAppContext>
        <SoftwareOverviewPage {...mockProps} />
      </WithAppContext>
    )
    screen.getByPlaceholderText('Find software')
  })

  it('renders layout options (toggle button group)', async () => {
    defaultUserSettings.rsd_page_layout='masonry'
    render(
      <WithAppContext options={{user:defaultUserSettings}}>
        <SoftwareOverviewPage {...mockProps} />
      </WithAppContext>
    )
    screen.getByTestId('card-layout-options')
  })

  it('renders (12) masonry cards', async () => {
    defaultUserSettings.rsd_page_layout='masonry'
    render(
      <WithAppContext options={{user:defaultUserSettings}}>
        <SoftwareOverviewPage {...mockProps} />
      </WithAppContext>
    )
    const cards = screen.getAllByTestId('software-masonry-card')
    expect(cards.length).toEqual(mockProps.software.length)
  })

  it('renders (12) grid cards', async () => {
    defaultUserSettings.rsd_page_layout='grid'
    render(
      <WithAppContext options={{user:defaultUserSettings}}>
        <SoftwareOverviewPage {...mockProps} />
      </WithAppContext>
    )
    const cards = screen.getAllByTestId('software-grid-card')
    expect(cards.length).toEqual(mockProps.software.length)
  })

  it('renders (12) list items', async () => {
    defaultUserSettings.rsd_page_layout='list'
    render(
      <WithAppContext options={{user:defaultUserSettings}}>
        <SoftwareOverviewPage {...mockProps} />
      </WithAppContext>
    )
    const cards = screen.getAllByTestId('software-list-item')
    expect(cards.length).toEqual(mockProps.software.length)
  })

})
