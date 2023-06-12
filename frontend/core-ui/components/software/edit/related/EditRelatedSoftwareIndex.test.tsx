// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'
import {initialState as softwareState} from '~/components/software/edit/editSoftwareContext'

import RelatedSoftwareItems from './index'

// MOCKS
import mockRelatedSoftware from './__mocks__/relatedSoftwareForSoftware.json'
import mockRelatedProjects from './__mocks__/relatedProjectsForSoftware.json'

// MOCK editRelatedSoftware methods
const mockGetRelatedSoftwareForSoftware = jest.fn(props => Promise.resolve(mockRelatedSoftware))
const mockSearchForRelatedSoftware = jest.fn(props => Promise.resolve([] as any))
const mockAddRelatedSoftware = jest.fn(props => Promise.resolve([] as any))
const mockDeleteRelatedSoftware = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/editRelatedSoftware', () => ({
  getRelatedSoftwareForSoftware: jest.fn(props => mockGetRelatedSoftwareForSoftware(props)),
  searchForRelatedSoftware: jest.fn(props => mockSearchForRelatedSoftware(props)),
  addRelatedSoftware: jest.fn(props => mockAddRelatedSoftware(props)),
  deleteRelatedSoftware: jest.fn(props => mockDeleteRelatedSoftware(props)),
}))

const mockGetRelatedProjectsForSoftware = jest.fn(props => Promise.resolve(mockRelatedProjects))
jest.mock('~/utils/getSoftware', () => ({
  getRelatedProjectsForSoftware: jest.fn(props=>mockGetRelatedProjectsForSoftware(props))
}))

// MOCK addRelatedProject, deleteRelatedProject
const mockAddRelatedProjectForSoftware = jest.fn(props => Promise.resolve([] as any))
const mockDeleteRelatedProjectForSoftware = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/editProject', () => ({
  addRelatedSoftware: jest.fn(props => mockAddRelatedProjectForSoftware(props)),
  deleteRelatedSoftware: jest.fn(props => mockDeleteRelatedProjectForSoftware(props)),
}))

// MOCK searchForRelatedProjectByTitle
const mockSearchForRelatedProjectByTitle = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/getProjects', () => ({
  searchForRelatedProjectByTitle: jest.fn(props => mockSearchForRelatedProjectByTitle(props)),
}))


describe('frontend/components/software/edit/related/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders related software and project items', async () => {
    // required prop
    softwareState.software.id = 'test-software-id'

    // mock api responses
    mockGetRelatedSoftwareForSoftware.mockResolvedValueOnce(mockRelatedSoftware)
    mockGetRelatedProjectsForSoftware.mockResolvedValueOnce(mockRelatedProjects)

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <RelatedSoftwareItems />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // validate related software
    const relatedSoftware = await screen.findAllByTestId('related-software-item')
    expect(relatedSoftware.length).toEqual(mockRelatedSoftware.length)

    // validate related projects
    const relatedProjects = await screen.findAllByTestId('related-project-item')
    expect(relatedProjects.length).toEqual(mockRelatedProjects.length)
  })

  it('can add related software to software', async() => {
    // required prop
    softwareState.software.id = 'test-software-id'

    const searchFor = 'Search for software'
    const relatedSoftwareFound = [
      {id:'test-id-1',slug:'test-slug-1',brand_name:'Test title 1',short_statement:'Test subtitle 1',status: 'approved'},
      {id:'test-id-2',slug:'test-slug-2',brand_name:'Test title 2',short_statement:'Test subtitle 2',status:'approved'}
    ]

    // mock api responses
    mockGetRelatedSoftwareForSoftware.mockResolvedValueOnce([])
    mockGetRelatedProjectsForSoftware.mockResolvedValueOnce([])
    // mock search response
    mockSearchForRelatedSoftware.mockResolvedValueOnce(relatedSoftwareFound)
    // mock add response
    mockAddRelatedSoftware.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <RelatedSoftwareItems />
        </WithSoftwareContext>
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
    expect(mockAddRelatedSoftware).toBeCalledTimes(1)
    expect(mockAddRelatedSoftware).toBeCalledWith({
      'origin': softwareState.software.id,
      'relation': relatedSoftwareFound[0].id,
      'token': mockSession.token,
    })

    // validate 1 item added to list
    const relatedSoftware = await screen.findAllByTestId('related-software-item')
    expect(relatedSoftware.length).toEqual(1)
  })

  it('can REMOVE related software for software', async () => {
    // required prop
    softwareState.software.id = 'test-software-id'

    // mock api responses
    mockGetRelatedSoftwareForSoftware.mockResolvedValueOnce(mockRelatedSoftware)
    mockGetRelatedProjectsForSoftware.mockResolvedValueOnce([])
    // mock delete response as OK
    mockDeleteRelatedSoftware.mockResolvedValueOnce({
      status: 200,
      message:'OK'
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <RelatedSoftwareItems />
        </WithSoftwareContext>
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
      expect(mockDeleteRelatedSoftware).toBeCalledTimes(1)
      expect(mockDeleteRelatedSoftware).toBeCalledWith({
        'origin': softwareState.software.id,
        'relation': mockRelatedSoftware[0].id,
        'token': mockSession.token,
      })
      // validate remaining items
      const remainedSoftware = screen.getAllByTestId('related-software-item')
      expect(remainedSoftware.length).toEqual(mockRelatedSoftware.length - 1)
    })
  })

  it('can add related project to software', async () => {
    // required prop
    softwareState.software.id = 'test-software-id'
    const searchFor = 'Search for project'
    const relatedProjectsFound = [
      {id:'test-id-1', slug:'test-slug-1', title: 'Test title 1', subtitle: 'Test subtitle 1', status: 'approved'},
      {id:'test-id-2',slug:'test-slug-2',title:'Test title 2',subtitle:'Test subtitle 2',status:'approved'}
    ]

    // mock api responses
    mockGetRelatedSoftwareForSoftware.mockResolvedValueOnce([])
    mockGetRelatedProjectsForSoftware.mockResolvedValueOnce([])

    mockSearchForRelatedProjectByTitle.mockResolvedValueOnce(relatedProjectsFound)
    mockAddRelatedProjectForSoftware.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <RelatedSoftwareItems />
        </WithSoftwareContext>
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
    expect(mockAddRelatedProjectForSoftware).toBeCalledTimes(1)
    expect(mockAddRelatedProjectForSoftware).toBeCalledWith({
      'software': softwareState.software.id,
      'project': relatedProjectsFound[0].id,
      'status': 'approved',
      'token': mockSession.token,
    })
  })

  it('can REMOVE related project for software', async () => {
    // required prop
    softwareState.software.id = 'test-software-id'

    // mock api responses
    mockGetRelatedSoftwareForSoftware.mockResolvedValueOnce([])
    mockGetRelatedProjectsForSoftware.mockResolvedValueOnce(mockRelatedProjects)
    // mock delete response as OK
    mockDeleteRelatedProjectForSoftware.mockResolvedValueOnce({
      status: 200,
      message:'OK'
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <RelatedSoftwareItems />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // get list
    const relatedSoftware = await screen.findAllByTestId('related-project-item')
    // get delete btn of first item
    const delBtn = within(relatedSoftware[0]).getByRole('button', {
      name: 'delete'
    })
    // delete item
    fireEvent.click(delBtn)

    await waitFor(() => {
      expect(mockDeleteRelatedProjectForSoftware).toBeCalledTimes(1)
      expect(mockDeleteRelatedProjectForSoftware).toBeCalledWith({
        'software': softwareState.software.id,
        'project': mockRelatedProjects[0].id,
        'token': mockSession.token,
      })
      // validate remaining items
      const remainedSoftware = screen.getAllByTestId('related-project-item')
      expect(remainedSoftware.length).toEqual(mockRelatedProjects.length - 1)
    })
  })
})
