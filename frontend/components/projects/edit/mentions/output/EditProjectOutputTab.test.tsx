// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'

import ProjectOutput from './index'
import editProjectState from '~/components/projects/edit/__mocks__/editProjectState'
import mockCrossrefItems from '~/utils/__mocks__/crossrefItems.json'
import {cfgOutput as config} from './config'
import {mentionModal} from '~/components/mention/config'

// MOCKS
import outputForProject from './__mocks__/outputForProject.json'
// MOCK getOutputForProject
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetOutputForProject = jest.fn((props) => Promise.resolve(outputForProject))
jest.mock('~/components/projects/apiProjects', () => ({
  getMentionsForProject: jest.fn((props)=>mockGetOutputForProject(props))
}))
// MOCK getMentionByDoiFromRsd
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetMentionByDoiFromRsd = jest.fn((props) => Promise.resolve([] as any))
jest.mock('~/components/mention/apiEditMentions', () => ({
  ...jest.requireActual('~/components/mention/apiEditMentions'),
  getMentionByDoiFromRsd: jest.fn(props=>mockGetMentionByDoiFromRsd(props))
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetMentionByDoi = jest.fn((props) => Promise.resolve([] as any))
jest.mock('~/utils/getDOI', () => ({
  getMentionByDoi: jest.fn(props=>mockGetMentionByDoi(props))
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockFindPublicationByTitle = jest.fn((props) => Promise.resolve(outputForProject))
const mockAddNewOutputToProject = jest.fn(props => Promise.resolve({
  status: 200,
  message: props
}))
const mockRemoveOutputForProject = jest.fn(props=>Promise.resolve(props))
jest.mock('./outputForProjectApi', () => ({
  findPublicationByTitle: jest.fn(props => mockFindPublicationByTitle(props)),
  addNewOutputToProject: jest.fn(props => mockAddNewOutputToProject(props)),
  removeOutputForProject: jest.fn(props => mockRemoveOutputForProject(props))
}))

// MOCK software mention context
const mockProjectMentionContext={
  loading: true,
  output: [],
  citation: [],
  impact: [],
  counts:{
    impact: 0,
    citations: 0,
    output: 0,
  },
  tab:'output',
  setTab:jest.fn(),
  setOutputCnt:jest.fn(),
  setCitationCnt:jest.fn(),
  setImpactCnt:jest.fn()
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseProjectMentionContext = jest.fn(props=>mockProjectMentionContext)
jest.mock('~/components/projects/edit/mentions/ProjectMentionContext',()=>({
  useProjectMentionContext: jest.fn(props=>mockUseProjectMentionContext(props))
}))


describe('frontend/components/projects/edit/mentions/output/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loader when loading=true',()=>{
    // mock context data
    mockProjectMentionContext.loading = true
    mockUseProjectMentionContext.mockReturnValueOnce(mockProjectMentionContext)

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOutput />
        </WithProjectContext>
      </WithAppContext>
    )

    screen.getByRole('progressbar')
  })

  it('renders component with mocked output items', async() => {
    // mock context data
    mockProjectMentionContext.loading = false
    mockProjectMentionContext.output = outputForProject as any
    mockUseProjectMentionContext.mockReturnValueOnce(mockProjectMentionContext)

    // render component
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOutput />
        </WithProjectContext>
      </WithAppContext>
    )

    // validate items on page
    const items = screen.getAllByTestId('mention-item-base')
    expect(items.length).toEqual(outputForProject.length)
  })

  it('shows no items message', async() => {
    // mock context data
    mockProjectMentionContext.loading = false
    mockProjectMentionContext.output = []
    mockUseProjectMentionContext.mockReturnValueOnce(mockProjectMentionContext)

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOutput />
        </WithProjectContext>
      </WithAppContext>
    )

    const noItems = screen.getByText('No output items to show')
    expect(noItems).toBeInTheDocument()
  })

  it('search mention by DOI', async () => {
    // mock context data
    mockProjectMentionContext.loading = false
    mockProjectMentionContext.output = []
    mockUseProjectMentionContext.mockReturnValueOnce(mockProjectMentionContext)

    const validDOI = '10.5281/zenodo.3401363'
    // resolve DOI not found in RSD
    mockGetMentionByDoiFromRsd.mockResolvedValueOnce({
      status: 200,
      message: []
    })
    // resolve DOI found via doi.org
    mockGetMentionByDoi.mockResolvedValueOnce({
      status: 200,
      message: mockCrossrefItems[0]
    })
    render(
      <WithAppContext options={{session:mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOutput />
        </WithProjectContext>
      </WithAppContext>
    )

    // find by DOI
    const find = screen.getByRole('combobox', {
      name: config.findMention.label
    })
    // populate DOI value
    fireEvent.change(find,{target:{value:validDOI}})

    await waitFor(() => {
      // call RSD api to find mention by DOI
      expect(mockGetMentionByDoiFromRsd).toHaveBeenCalledTimes(1)
      expect(mockGetMentionByDoiFromRsd).toHaveBeenCalledWith({
        'doi': validDOI,
        'token': mockSession.token
      })
      // becase we did not found it in RSD we try doi.org
      expect(mockGetMentionByDoi).toHaveBeenCalledTimes(1)
      expect(mockGetMentionByDoi).toHaveBeenCalledWith(validDOI)
    })
  })

  it('search mention by text', async () => {
    // mock context data
    mockProjectMentionContext.loading = false
    mockProjectMentionContext.output = []
    mockUseProjectMentionContext.mockReturnValueOnce(mockProjectMentionContext)

    const searchFor = 'My lovely mention'
    // resolve existing mentions to []
    mockGetOutputForProject.mockResolvedValueOnce([])
    // resolve search with mockedItems
    // mockFindPublicationByTitle.mockResolvedValueOnce(mockImpactForProject[0])
    render(
      <WithAppContext options={{session:mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOutput />
        </WithProjectContext>
      </WithAppContext>
    )

    // find mention
    const find = screen.getByRole('combobox', {
      name: config.findMention.label
    })
    // populate search value
    fireEvent.change(find, {target: {value: searchFor}})

    await waitFor(() => {
      // call RSD api to find mention by DOI
      expect(mockFindPublicationByTitle).toHaveBeenCalledTimes(1)
      expect(mockFindPublicationByTitle).toHaveBeenCalledWith({
        'id': editProjectState.id,
        searchFor,
        'token': mockSession.token
      })
    })
  })

  it('add custom mention', async() => {
    // mock context data
    mockProjectMentionContext.loading = false
    mockProjectMentionContext.output = []
    mockUseProjectMentionContext.mockReturnValueOnce(mockProjectMentionContext)

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOutput />
        </WithProjectContext>
      </WithAppContext>
    )

    const addBtn = screen.getByRole('button', {
      name:'Create'
    })
    expect(addBtn).toBeInTheDocument()

    fireEvent.click(addBtn)

    // wait for modal to appear
    const modal = await screen.findByRole('dialog')

    // create title
    const title = within(modal).getByRole('textbox', {
      name: mentionModal.title.label
    })
    fireEvent.change(title,{target:{value:'Test value'}})

    // select wrapper/group
    const selectGroup = screen.getByTestId('controlled-select')
    expect(selectGroup).toBeInTheDocument()

    // select button - for expanding
    const select = within(selectGroup).getByRole('combobox')
    fireEvent.mouseDown(select)
    // validate all options present
    const options = screen.getAllByRole('option')
    // select second option
    fireEvent.click(options[1])

    // provide url to mention
    const url = screen.getByRole('textbox', {
      name: mentionModal.url.label
    })
    fireEvent.change(url,{target:{value:'https://google.com/link1'}})

    // has Save button
    const save = screen.getByRole('button', {
      name: 'Save'
    })

    // save should be enabled
    await waitFor(() => {
      expect(save).toBeEnabled()
    })

    // click on save
    fireEvent.click(save)

    await waitFor(() => {
      expect(mockAddNewOutputToProject).toHaveBeenCalledTimes(1)
      expect(mockAddNewOutputToProject).toHaveBeenCalledWith({
        'item': {
          'authors': null,
          'doi': null,
          'id': null,
          'image_url': null,
          'journal': null,
          'mention_type': 'book',
          'note': null,
          'page': null,
          'publication_year': null,
          'publisher': null,
          'source': 'RSD',
          'title': 'Test value',
          'url': 'https://google.com/link1',
        },
        'project': editProjectState.id,
        'token': mockSession.token,
      })
    })
  })

  it('delete mention item', async () => {
    // mock context data
    mockProjectMentionContext.loading = false
    mockProjectMentionContext.output = outputForProject as any
    mockUseProjectMentionContext.mockReturnValueOnce(mockProjectMentionContext)

    // resolve search with mockedItems
    // mockFindPublicationByTitle.mockResolvedValueOnce(mockImpactForProject[0])
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOutput />
        </WithProjectContext>
      </WithAppContext>
    )

    // find and use delete button
    const deleteBtns = screen.getAllByTestId('DeleteIcon')
    expect(deleteBtns.length).toEqual(outputForProject.length)

    fireEvent.click(deleteBtns[0])

    // find and use cofirm button
    const confirm = await screen.findByRole('button', {
      name: 'Remove'
    })

    fireEvent.click(confirm)
    // screen.debug(items)

    await waitFor(() => {
      expect(mockRemoveOutputForProject).toHaveBeenCalledTimes(1)
      expect(mockRemoveOutputForProject).toHaveBeenCalledWith({
        'mention': outputForProject[0].id,
        'project': editProjectState.id,
        'token': mockSession.token,
      })
    })
  })

})
