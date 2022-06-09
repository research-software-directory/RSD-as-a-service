// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {mockResolvedValueOnce} from '../utils/jest/mockFetch'
import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

import projectsOverview from './__fixtures__/projectsOverview.json'
import apiMentions from './__fixtures__/apiMentions.json'
import apiRelatedProjects from './__fixtures__/apiRelatedProjects.json'
import apiContributors from './__fixtures__/apiContributors.json'
import apiRelatedSoftware from './__fixtures__/apiRelatedSoftware.json'

import ProjectItemPage, {getServerSideProps, ProjectPageProps} from '../pages/projects/[slug]/index'
import {prepareData} from '../utils/getProjects'
import {RawProject} from '../types/Project'
import {MentionForProject} from '../types/Mention'

// take first record from mocked overview
const mockedResponse = [projectsOverview[0]]
// prepared projects
const mockedProjects = prepareData(projectsOverview as RawProject[])

const mockedProps:ProjectPageProps = {
  project: mockedProjects[0],
  slug: 'test-slug',
  isMaintainer: false,
  organisations:[],
  researchDomains:[],
  keywords: [],
  links: [],
  output: apiMentions as MentionForProject[],
  impact: apiMentions as MentionForProject[],
  team: apiContributors,
  relatedProjects: apiRelatedProjects,
  relatedTools: apiRelatedSoftware
}

describe('pages/projects/[slug]/index', () => {
  it('renders Project title', async() => {
    render(WrappedComponentWithProps(
      ProjectItemPage,
      {props: mockedProps}
    ))
    const heading = await screen.findByRole('heading',{
      name: mockedProps.project.title
    })
    expect(heading).toBeInTheDocument()
  })
})
