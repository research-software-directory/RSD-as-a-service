// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import OrganisationsOverviewPage, {getServerSideProps} from '../pages/organisations/index'
import {mockResolvedValue} from '../utils/jest/mockFetch'

import {WithAppContext} from '~/utils/jest/WithAppContext'
import organisationsOverview from './__mocks__/organisationsOverview.json'

const mockProps = {
  count: 408,
  page: 1,
  rows: 12,
  organisations: organisationsOverview as any
}

describe('pages/organisations/index.tsx', () => {
  beforeEach(() => {
    mockResolvedValue(organisationsOverview, {
      status: 206,
      headers: {
        // mock getting Content-Range from the header
        get: () => '0-11/200'
      },
      statusText: 'OK',
    })
  })

  it('getServerSideProps returns mocked values in the props', async () => {
    const resp = await getServerSideProps({req: {cookies: {}}, query: {}})
    expect(resp).toEqual({
      props:{
        // count is extracted from response header
        count:200,
        // default query param values
        page:1,
        rows:12,
        // mocked data
        organisations: organisationsOverview,
        search: null
      }
    })
  })

  it('renders heading with the title Organisations', async () => {
    render(
      <WithAppContext>
        <OrganisationsOverviewPage {...mockProps} />
      </WithAppContext>
    )

    const heading = await screen.findByRole('heading',{
      name: 'Organisations'
    })
    expect(heading).toBeInTheDocument()
  })

  it('renders (24) grid cards', async () => {
    mockProps.rows = 24
    render(
      <WithAppContext>
        <OrganisationsOverviewPage {...mockProps} />
      </WithAppContext>
    )
    const cards = screen.getAllByTestId('organisation-card-link')
    expect(cards.length).toEqual(mockProps.organisations.length)
  })

  it('renders first organisation name', async() => {
    render(
      <WithAppContext>
        <OrganisationsOverviewPage {...mockProps} />
      </WithAppContext>
    )

    const name = organisationsOverview[0].name
    const card = await screen.findByText(name)
    expect(card).toBeInTheDocument()
  })

})
