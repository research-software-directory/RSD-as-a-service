// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'

import RelatedItems from './index'

// MOCKS
import editProjectState from '../__mocks__/editProjectState'
import mockRelatedProjects from './__mocks__/relatedProjectsForProject.json'

// MOCK getRelatedProjectsForProject, getRelatedSoftwareForProject
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetRelatedProjectsForProject = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSearchForRelatedProjectByTitle = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/components/projects/apiProjects', () => ({
  getRelatedProjectsForProject: jest.fn(props => mockGetRelatedProjectsForProject(props)),
  searchForRelatedProjectByTitle: jest.fn(props => mockSearchForRelatedProjectByTitle(props)),
}))

// MOCK addRelatedProject, deleteRelatedProject
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockAddRelatedProject = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteRelatedProject = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockAddRelatedSoftware = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteRelatedSoftware = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/components/projects/edit/apiEditProject', () => ({
  addRelatedProject: jest.fn(props => mockAddRelatedProject(props)),
  deleteRelatedProject: jest.fn(props => mockDeleteRelatedProject(props)),
  addRelatedSoftware: jest.fn(props => mockAddRelatedSoftware(props)),
  deleteRelatedSoftware: jest.fn(props => mockDeleteRelatedSoftware(props)),
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSearchForRelatedSoftware = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/components/software/edit/related-software/apiRelatedSoftware', () => ({
  searchForRelatedSoftware: jest.fn(props=>mockSearchForRelatedSoftware(props))
}))

describe('frontend/components/projects/edit/related-projects/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders related project items', async() => {
    // return mocked values
    mockGetRelatedProjectsForProject.mockResolvedValueOnce(mockRelatedProjects)
    // mockGetRelatedSoftwareForProject.mockResolvedValueOnce(mockRelatedSoftware)

    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <RelatedItems />
        </WithProjectContext>
      </WithAppContext>
    )

    // validate related projects
    const relatedProjects = await screen.findAllByTestId('related-project-item')
    expect(relatedProjects.length).toEqual(mockRelatedProjects.length)

  })

  it('can add related project to project', async() => {
    const searchFor = 'Search for project'
    const relatedProjectsFound = [
      {id:'test-id-1', slug:'test-slug-1', title: 'Test title 1', subtitle: 'Test subtitle 1', status: 'approved'},
      {id:'test-id-2',slug:'test-slug-2',title:'Test title 2',subtitle:'Test subtitle 2',status:'approved'}
    ]
    // return mocked values
    mockGetRelatedProjectsForProject.mockResolvedValueOnce([])
    mockSearchForRelatedProjectByTitle.mockResolvedValueOnce(relatedProjectsFound)
    mockAddRelatedProject.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })

    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <RelatedItems />
        </WithProjectContext>
      </WithAppContext>
    )

    // search for related project
    const findRelated = screen.getByTestId('find-related-project')
    const search = within(findRelated).getByRole('combobox')
    fireEvent.change(search, {target: {value: searchFor}})

    // validate mocked options returned
    const options = await screen.findAllByTestId('related-project-option')
    expect(options.length).toEqual(relatedProjectsFound.length)

    // add first item
    fireEvent.click(options[0])

    // validate api calls
    expect(mockAddRelatedProject).toHaveBeenCalledTimes(1)
    expect(mockAddRelatedProject).toHaveBeenCalledWith({
      'origin': editProjectState.id,
      'relation': relatedProjectsFound[0].id,
      'status': 'approved',
      'token': mockSession.token,
    })

    // validate 1 item added to list
    const relatedProjects = await screen.findAllByTestId('related-project-item')
    expect(relatedProjects.length).toEqual(1)
  })

  it('can remove related project for project', async() => {
    // return mocked values
    mockGetRelatedProjectsForProject.mockResolvedValueOnce(mockRelatedProjects)
    mockDeleteRelatedProject
      .mockResolvedValueOnce({
        status: 200,
        message:'OK'
      }).mockResolvedValueOnce({
        status: 200,
        message:'OK'
      })
    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <RelatedItems />
        </WithProjectContext>
      </WithAppContext>
    )

    // get list
    const relatedProjects = await screen.findAllByTestId('related-project-item')
    // get delete btn of first item
    const delBtn = within(relatedProjects[0]).getByRole('button', {
      name: 'delete'
    })
    // delete item
    fireEvent.click(delBtn)

    await waitFor(() => {
      // delete (possible) 2 entries/references
      expect(mockDeleteRelatedProject).toHaveBeenCalledTimes(2)
      expect(mockDeleteRelatedProject).toHaveBeenCalledWith({
        'origin': mockRelatedProjects[0].origin,
        'relation': mockRelatedProjects[0].relation,
        'token': mockSession.token,
      })
      expect(mockDeleteRelatedProject).toHaveBeenCalledWith({
        'origin': mockRelatedProjects[0].relation,
        'relation': mockRelatedProjects[0].origin,
        'token': mockSession.token,
      })
      // validate remaining items
      const remainedProjects = screen.getAllByTestId('related-project-item')
      expect(remainedProjects.length).toEqual(mockRelatedProjects.length - 1)
    })
  })

})
