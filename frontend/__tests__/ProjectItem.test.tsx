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
  technologies:['Tech 1', 'Tech 2'],
  topics: ['Topic 1', 'Topic 2'],
  links: [],
  output: apiMentions as MentionForProject[],
  impact: apiMentions as MentionForProject[],
  team: apiContributors,
  relatedProjects: apiRelatedProjects,
  relatedTools: apiRelatedSoftware
}

describe('pages/projects/index.tsx', () => {
  // beforeEach(() => {
  //   mockResolvedValueOnce(mockedResponse, {
  //     status: 200,
  //     headers: {
  //       // mock getting Content-Range from the header
  //       get: () => '0-11/200'
  //     },
  //     statusText: 'OK',
  //   })
  // })
  // it('getServerSideProps returns mocked values in the props', async () => {
  //   const resp = await getServerSideProps({req: {cookies: {}}})
  //   // prepare raw data in the same way as getServerSideProps does it
  //   const projects = prepareData(projectsOverview as RawProject[])
  //   expect(resp).toEqual({
  //     props:{
  //       // mocked data
  //       project: projects[0]
  //     }
  //   })
  // })

  it('renders Project title', async() => {
    render(WrappedComponentWithProps(
      ProjectItemPage,
      mockedProps
    ))
    const heading = await screen.findByRole('heading',{
      name: mockedProps.project.title
    })
    expect(heading).toBeInTheDocument()
  })
})
