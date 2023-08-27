// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

import projectItem from './__mocks__/projectItem.json'
import apiParticipatingOrganisations from './__mocks__/apiParticipatingOrganisations.json'
import apiResearchDomains from './__mocks__/apiResearchDomains.json'
import apiKeywords from './__mocks__/apiKeywordsByProject.json'
import apiLinks from './__mocks__/apiProjectLinks.json'
import apiMentions from './__mocks__/apiMentions.json'
import apiRelatedProjects from './__mocks__/apiRelatedProjects.json'
import apiContributors from './__mocks__/apiContributors.json'
import apiRelatedSoftware from './__mocks__/apiRelatedSoftware.json'

import ProjectItemPage, {ProjectPageProps} from '../pages/projects/[slug]/index'
import {RelatedProject} from '../types/Project'
import {MentionItemProps} from '../types/Mention'
import {ProjectOrganisationProps} from '~/types/Organisation'

// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
jest.mock('~/auth/api/useLoginProviders')

const mockedProps: ProjectPageProps = {
  slug: 'test-slug',
  project: projectItem,
  isMaintainer: false,
  organisations: apiParticipatingOrganisations as ProjectOrganisationProps[],
  researchDomains: apiResearchDomains,
  keywords: apiKeywords,
  links: apiLinks,
  output: apiMentions as MentionItemProps[],
  impact: apiMentions as MentionItemProps[],
  team: apiContributors,
  relatedProjects: apiRelatedProjects as RelatedProject[],
  relatedSoftware: apiRelatedSoftware as any
}

describe('pages/projects/[slug]/index.tsx', () => {
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
  it('renders edit button when isMaintainer=true', () => {
    // set isMaintainer to true
    mockedProps.isMaintainer=true
    render(WrappedComponentWithProps(
      ProjectItemPage,
      {props: mockedProps}
    ))
    const editBtn = screen.getByTestId('edit-button')
    expect(editBtn).toBeInTheDocument()
    // screen.debug(editBtn)
  })
})
