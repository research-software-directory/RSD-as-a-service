// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

import projectsOverview from './__fixtures__/projectsOverview.json'
import apiParticipatingOrganisations from './__fixtures__/apiParticipatingOrganisations.json'
import apiResearchDomains from './__fixtures__/apiResearchDomains.json'
import apiKeywords from './__fixtures__/apiKeywordsByProject.json'
import apiLinks from './__fixtures__/apiProjectLinks.json'
import apiMentions from './__fixtures__/apiMentions.json'
import apiRelatedProjects from './__fixtures__/apiRelatedProjects.json'
import apiContributors from './__fixtures__/apiContributors.json'
import apiRelatedSoftware from './__fixtures__/apiRelatedSoftware.json'

import ProjectItemPage, {ProjectPageProps} from '../pages/projects/[slug]/index'
import {prepareData} from '../utils/getProjects'
import {RawProject, RelatedProject} from '../types/Project'
import {MentionItemProps} from '../types/Mention'
import {SoftwareListItem} from '~/types/SoftwareTypes'
import {ProjectOrganisationProps} from '~/types/Organisation'

/**
 * We need to mock remark-breaks for now as it is breaking Jest setup
 */
jest.mock('remark-breaks', jest.fn((...props) => {
  // console.log('remark-breaks...', props)
  return props
}))

// take first record from mocked overview
const mockedResponse = [projectsOverview[0]]
// prepared projects
const mockedProjects = prepareData(projectsOverview as RawProject[])

const mockedProps: ProjectPageProps = {
  slug: 'test-slug',
  project: mockedProjects[0],
  isMaintainer: false,
  organisations: apiParticipatingOrganisations as ProjectOrganisationProps[],
  researchDomains: apiResearchDomains,
  keywords: apiKeywords,
  links: apiLinks,
  output: apiMentions as MentionItemProps[],
  impact: apiMentions as MentionItemProps[],
  team: apiContributors,
  relatedProjects: apiRelatedProjects as RelatedProject[],
  relatedSoftware: apiRelatedSoftware as SoftwareListItem[]
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
