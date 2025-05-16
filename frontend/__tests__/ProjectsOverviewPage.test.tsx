// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, within} from '@testing-library/react'
import {WithAppContext, defaultUserSettings} from '~/utils/jest/WithAppContext'

import ProjectOverviewPage from '../pages/projects/index'
import mockData from './__mocks__/projectsOverview.json'

// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
jest.mock('~/auth/api/useLoginProviders')

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
      <WithAppContext options={{user:defaultUserSettings}}>
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
      <WithAppContext options={{user:defaultUserSettings}}>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    // get reference to filter panel
    const panel = screen.getByTestId('filters-panel')
    // find order by testid
    // within(panel).getByTestId('filters-order-by')
    // within(panel).getByTestId('filters-project-status')
    // should have 5 filters
    const filters = within(panel).getAllByRole('combobox')
    expect(filters.length).toEqual(5)
    // screen.debug(filters)
  })

  it('renders searchbox with placeholder Find project', async () => {
    render(
      <WithAppContext options={{user:defaultUserSettings}}>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    screen.getByPlaceholderText('Find project')
  })

  it('renders layout options (toggle button group)', async () => {
    render(
      <WithAppContext options={{user:defaultUserSettings}}>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    screen.getByTestId('card-layout-options')
  })

  it('renders (12) grid cards (even for masonry layout type)', async () => {
    defaultUserSettings.rsd_page_layout='masonry'
    render(
      <WithAppContext options={{user:defaultUserSettings}}>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    const cards = screen.getAllByTestId('project-grid-card')
    expect(cards.length).toEqual(mockProps.projects.length)
  })

  it('renders (12) list items', async () => {
    defaultUserSettings.rsd_page_layout='list'
    render(
      <WithAppContext options={{user:defaultUserSettings}}>
        <ProjectOverviewPage {...mockProps} />
      </WithAppContext>
    )
    const cards = screen.getAllByTestId('project-list-item')
    expect(cards.length).toEqual(mockProps.projects.length)
  })

})
