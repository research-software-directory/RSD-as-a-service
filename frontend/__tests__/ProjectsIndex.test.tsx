// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {mockResolvedValue} from '../utils/jest/mockFetch'
import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

import projectsOverview from './__fixtures__/projectsOverview.json'

import ProjectsIndexPage, {getServerSideProps} from '../pages/projects/index'
import {prepareData} from '../utils/getProjects'
import {RawProject} from '../types/Project'
import {RsdUser} from '../auth'


describe('pages/projects/index.tsx', () => {
  beforeEach(() => {
    mockResolvedValue(projectsOverview, {
      status: 206,
      headers: {
        // mock getting Content-Range from the header
        get: () => '0-11/200'
      },
      statusText: 'OK',
    })
  })

  it('getServerSideProps returns mocked values in the props', async () => {
    const resp = await getServerSideProps({req: {cookies: {}}})
    // prepare raw data in the same way as getServerSideProps does it
    const projects = prepareData(projectsOverview as RawProject[])
    expect(resp).toEqual({
      props:{
        // count is extracted from response header
        count:200,
        // default query param values
        page:0,
        rows:12,
        // mocked data
        projects
      }
    })
  })

  it('renders heading with the title Projects', async() => {
    render(WrappedComponentWithProps(
      ProjectsIndexPage, {
        props: {
          count:200,
          page:0,
          rows:12,
          projects:projectsOverview,
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
      name: 'Projects'
    })
    expect(heading).toBeInTheDocument()
  })

  it('renders project as card (based on title)', async() => {
    render(WrappedComponentWithProps(
      ProjectsIndexPage, {
        props: {
          count:3,
          page:0,
          rows:12,
          projects:projectsOverview,
        },
        // user session
        session:{
          status: 'missing',
          token: 'test-token',
          user: {name:'Test user'} as RsdUser
        }
      }
    ))

    const title = projectsOverview[0].title
    const card = await screen.findByText(title)
    expect(card).toBeInTheDocument()
  })
})
