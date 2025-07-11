// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import Home from '../app/page'

import {defaultRsdSettings} from '~/config/rsdSettingsReducer'
import {WithAppContext} from '~/utils/jest/WithAppContext'
import {getTopNews} from '~/components/news/apiNews'
import {getRsdSettings} from '~/config/getSettingsServerSide'
import {getHomepageCounts} from '~/components/home/getHomepageCounts'

// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
// NOTE! if default is defined you cannot overwrite it here
jest.mock('~/auth/api/useLoginProviders')
// use DEFAULT MOCK for organisation list used by Helmholtz homepage
// NOTE! if default is defined in __mock__ folder you cannot overwrite it here
jest.mock('~/components/home/helmholtz/useOrganisations')

// MOCK getHomepageCounts
jest.mock('~/components/home/getHomepageCounts')
const mockHomepageCounts = getHomepageCounts as jest.Mock
// MOCK getTopNews
jest.mock('~/components/news/apiNews')
// getTopNews with correct type
const mockTopNews = getTopNews as jest.Mock
// MOCK getRsdSettings
jest.mock('~/config/getSettingsServerSide')
const mockRsdSettings = getRsdSettings as jest.Mock

const props = {
  host: {
    name: 'rsd'
  },
  counts: {
    software_cnt: 1111,
    open_software_cnt: null,
    project_cnt: 2222,
    organisation_cnt: 3333,
    contributor_cnt: 103,
    software_mention_cnt: 104,
  }
}

describe('app/page.tsx', () => {
  it('renders default RSD Home page when host=rsd', async () => {
    // mock responses
    mockTopNews.mockResolvedValue([])
    mockRsdSettings.mockResolvedValue(defaultRsdSettings)

    // we need to resolve async component before wrapping it?!?
    // this might not work when in all situations
    const ResolvedHome = await Home()

    // render
    render(
      <WithAppContext>
        {ResolvedHome}
      </WithAppContext>
    )

    const page = screen.getByTestId('rsd-home-page')
    expect(page).toBeInTheDocument()
    // screen.debug()
  })

  it('renders default RSD Home page when host=""', async() => {
    defaultRsdSettings.host.name=''
    // mock responses
    mockTopNews.mockResolvedValue([])
    mockRsdSettings.mockResolvedValue(defaultRsdSettings)

    // we need to resolve async component before wrapping it?!?
    // this might not work when in all situations
    const ResolvedHome = await Home()

    // render
    render(
      <WithAppContext>
        {ResolvedHome}
      </WithAppContext>
    )
    const page = screen.getByTestId('rsd-home-page')
    expect(page).toBeInTheDocument()
  })

  it('renders default RSD Home page when no host prop', async() => {
    // mock responses
    mockTopNews.mockResolvedValue([])
    mockRsdSettings.mockResolvedValue({})

    // we need to resolve async component before wrapping it?!?
    // this might not work when in all situations
    const ResolvedHome = await Home()

    // render
    render(
      <WithAppContext>
        {ResolvedHome}
      </WithAppContext>
    )

    const page = screen.getByTestId('rsd-home-page')
    expect(page).toBeInTheDocument()
  })

  it('renders counts on RSD Home page', async() => {
    // mock responses
    mockTopNews.mockResolvedValue([])
    mockRsdSettings.mockResolvedValue(defaultRsdSettings)
    mockHomepageCounts.mockResolvedValue(props.counts)

    // we need to resolve async component before wrapping it?!?
    // this might not work when in all situations
    const ResolvedHome = await Home()

    // render
    render(
      <WithAppContext>
        {ResolvedHome}
      </WithAppContext>
    )

    // software_cnt
    const software = screen.getByText(`${props.counts.software_cnt} Software`)
    expect(software).toBeInTheDocument()
    // project_cnt
    const project = screen.getByText(`${props.counts.project_cnt} Projects`)
    expect(project).toBeInTheDocument()
    // organisation_cnt
    const organisation = screen.getByText(`${props.counts.organisation_cnt} Organisations`)
    expect(organisation).toBeInTheDocument()
  })

  it('renders Helmholtz Home page when host=helmholtz', async() => {
    defaultRsdSettings.host.name='helmholtz'
    // mock responses
    mockTopNews.mockResolvedValue([])
    mockRsdSettings.mockResolvedValue(defaultRsdSettings)
    // mockHomepageCounts.mockResolvedValue(props.counts)

    // we need to resolve async component before wrapping it?!?
    // this might not work when in all situations
    const ResolvedHome = await Home()

    // render
    render(
      <WithAppContext>
        {ResolvedHome}
      </WithAppContext>
    )
    const page = screen.getByTestId('rsd-helmholtz-home')
    expect(page).toBeInTheDocument()
  })

  it('renders Helmholtz Home page when host=HELMHoltz', async() => {
    defaultRsdSettings.host.name='HELMholtz'
    // mock responses
    mockTopNews.mockResolvedValue([])
    mockRsdSettings.mockResolvedValue(defaultRsdSettings)
    // mockHomepageCounts.mockResolvedValue(props.counts)

    // we need to resolve async component before wrapping it?!?
    // this might not work when in all situations
    const ResolvedHome = await Home()

    // render
    render(
      <WithAppContext>
        {ResolvedHome}
      </WithAppContext>
    )
    const page = screen.getByTestId('rsd-helmholtz-home')
    expect(page).toBeInTheDocument()
  })
})
