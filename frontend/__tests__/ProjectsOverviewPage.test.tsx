// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, within} from '@testing-library/react'
import {WithAppContext} from '~/utils/jest/WithAppContext'

import ProjectOverviewPage from '../pages/projects/index'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'

import mockData from './__mocks__/projectsOverview.json'

const mockProps = {
  search: null,
  order: null,
  keywords: null,
  domains: null,
  organisations: null,
  project_status: null,
  page: 1,
  rows: 12,
  count: 408,
  layout: 'masonry' as LayoutType,
  keywordsList: mockData.keywordsList,
  domainsList: mockData.domainsList,
  organisationsList: mockData.organisationsList,
  projectStatusList: mockData.projectStatusList as any,
  projects: mockData.projects as any
}


describe('pages/projects/index.tsx', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders title All projects', () => {
    render(
      <WithAppContext>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    const heading = screen.getByRole('heading',{
      name: 'All projects'
    })
    expect(heading).toBeInTheDocument()
  })

  it('renders project filter panel with orderBy, project status and 3 other filters (combobox)', () => {
    render(
      <WithAppContext>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    // get reference to filter panel
    const panel = screen.getByTestId('filters-panel')
    // find order by testid
    const order = within(panel).getByTestId('filters-order-by')
    const status = within(panel).getByTestId('filters-project-status')
    // should have 3 filters
    const filters = within(panel).getAllByRole('combobox')
    expect(filters.length).toEqual(3)
    // screen.debug(filters)
  })

  it('renders searchbox with placeholder Find project', async () => {
    render(
      <WithAppContext>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    screen.getByPlaceholderText('Find project')
  })

  it('renders layout options (toggle button group)', async () => {
    mockProps.layout='masonry'
    render(
      <WithAppContext>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    screen.getByTestId('card-layout-options')
  })

  it('renders (12) grid cards (even for masonry layout type)', async () => {
    mockProps.layout='masonry'
    render(
      <WithAppContext>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    const cards = screen.getAllByTestId('project-grid-card')
    expect(cards.length).toEqual(mockProps.projects.length)
  })

  it('renders (12) list items', async () => {
    mockProps.layout='list'
    render(
      <WithAppContext>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    const cards = screen.getAllByTestId('project-list-item')
    expect(cards.length).toEqual(mockProps.projects.length)
  })

})
