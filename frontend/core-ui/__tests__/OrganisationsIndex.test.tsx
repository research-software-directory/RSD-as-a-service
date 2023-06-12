// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {mockResolvedValue} from '../utils/jest/mockFetch'
import organisationsOverview from './__mocks__/organisationsOverview.json'
import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

import OrganisationIndexPage,{getServerSideProps} from '../pages/organisations/index'
import {RsdUser} from '../auth'


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
        page:0,
        rows:12,
        // mocked data
        organisations: organisationsOverview,
        search: null
      }
    })
  })

  it('renders heading with the title Organisations', async() => {
    render(WrappedComponentWithProps(
      OrganisationIndexPage, {
        props: {
          count:200,
          page:0,
          rows:12,
          organisations:organisationsOverview,
        },
        // user session
        session:{
          status: 'missing',
          token: 'test-token',
          user: {name:'Test user'} as RsdUser
        }
      }
    ))
    const heading = await screen.findByRole('heading',{
      name: 'Organisations'
    })
    expect(heading).toBeInTheDocument()
  })

  it('renders organisation name as card header h2', async() => {
    render(WrappedComponentWithProps(
      OrganisationIndexPage, {
        props:{
          count:3,
          page:0,
          rows:12,
          organisations: organisationsOverview,
        },
        // user session
        session:{
          status: 'missing',
          token: 'test-token',
          user: {name:'Test user'} as RsdUser
        }
      }
    ))

    const name = organisationsOverview[0].name
    const card = await screen.findByText(name)
    expect(card).toBeInTheDocument()
  })
})
