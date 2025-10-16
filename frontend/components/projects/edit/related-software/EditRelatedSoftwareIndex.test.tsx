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
// import mockRelatedProjects from './__mocks__/relatedProjectsForProject.json'
import mockRelatedSoftware from './__mocks__/relatedSoftwareForProject.json'

// MOCK getRelatedProjectsForProject, getRelatedSoftwareForProject
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetRelatedSoftwareForProject = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSearchForRelatedProjectByTitle = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/components/projects/apiProjects', () => ({
  getRelatedSoftwareForProject: jest.fn(props => mockGetRelatedSoftwareForProject(props)),
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


describe('frontend/components/projects/edit/related-software/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders related software items', async() => {
    // return mocked values
    mockGetRelatedSoftwareForProject.mockResolvedValueOnce(mockRelatedSoftware)

    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <RelatedItems />
        </WithProjectContext>
      </WithAppContext>
    )

    const relatedSoftware = await screen.findAllByTestId('related-software-item')
    expect(relatedSoftware.length).toEqual(mockRelatedSoftware.length)
  })

  it('can add related software to project', async() => {
    const searchFor = 'Search for software'
    const relatedSoftwareFound = [
      {id:'test-id-1',slug:'test-slug-1',brand_name:'Test title 1',short_statement:'Test subtitle 1',status: 'approved'},
      {id:'test-id-2',slug:'test-slug-2',brand_name:'Test title 2',short_statement:'Test subtitle 2',status:'approved'}
    ]
    // return mocked values
    mockGetRelatedSoftwareForProject.mockResolvedValueOnce([])
    mockSearchForRelatedSoftware.mockResolvedValueOnce(relatedSoftwareFound)
    mockAddRelatedSoftware.mockResolvedValueOnce({
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
    const findRelated = screen.getByTestId('find-related-software')
    const search = within(findRelated).getByRole('combobox')
    fireEvent.change(search, {target: {value: searchFor}})

    // validate mocked options returned
    const options = await screen.findAllByTestId('related-software-option')
    expect(options.length).toEqual(relatedSoftwareFound.length)

    // add first item
    fireEvent.click(options[0])

    // validate api calls
    expect(mockAddRelatedSoftware).toHaveBeenCalledTimes(1)
    expect(mockAddRelatedSoftware).toHaveBeenCalledWith({
      'project': editProjectState.id,
      'software': relatedSoftwareFound[0].id,
      'status': 'approved',
      'token': mockSession.token,
    })

    // validate 1 item added to list
    const relatedSoftware = await screen.findAllByTestId('related-software-item')
    expect(relatedSoftware.length).toEqual(1)
  })

  it('can remove related software', async() => {
    // return mocked values
    mockGetRelatedSoftwareForProject.mockResolvedValueOnce(mockRelatedSoftware)
    mockDeleteRelatedSoftware.mockResolvedValueOnce({
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
    const relatedSoftware = await screen.findAllByTestId('related-software-item')
    // get delete btn of first item
    const delBtn = within(relatedSoftware[0]).getByRole('button', {
      name: 'delete'
    })
    // delete item
    fireEvent.click(delBtn)

    await waitFor(() => {
      expect(mockDeleteRelatedSoftware).toHaveBeenCalledTimes(1)
      expect(mockDeleteRelatedSoftware).toHaveBeenCalledWith({
        'project': editProjectState.id,
        'software': mockRelatedSoftware[0].id,
        'token': mockSession.token,
      })
      // validate remaining items
      const remainedSoftware = screen.getAllByTestId('related-software-item')
      expect(remainedSoftware.length).toEqual(mockRelatedSoftware.length - 1)
    })
  })

})
