// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'

import SoftwareMentions from './index'
import {cfgMention} from './config'
import {mentionModal} from '~/components/mention/config'

// MOCKS
import outputForSoftware from './__mocks__/outputForSoftware.json'
import {initialState as softwareState} from '~/components/software/edit/context/editSoftwareContext'
import mockCrossrefItems from '~/utils/__mocks__/crossrefItems.json'

// Mock getMentionsForSoftware
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

// Mock findPublicationByTitle
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockFindPublicationByTitle = jest.fn(props => Promise.resolve([] as any))
const mockAddNewMentionToSoftware = jest.fn(props => Promise.resolve({
  status: 200,
  message: props
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockRemoveMentionForSoftware = jest.fn(props => Promise.resolve([] as any))
jest.mock('./apiRelatedOutput', () => ({
  findPublicationByTitle: jest.fn(props => mockFindPublicationByTitle(props)),
  addNewMentionToSoftware: jest.fn(props => mockAddNewMentionToSoftware(props)),
  removeMentionForSoftware: jest.fn(props => mockRemoveMentionForSoftware(props))
}))

// MOCK software mention context
const mockSoftwareMentionContext={
  loading: true,
  reference_papers: [],
  citations: [],
  output: [],
  counts:{
    reference_papers: 0,
    citations: 0,
    output: 0,
  },
  tab:'reference_papers',
  setTab:jest.fn(),
  setOutputCnt:jest.fn(),
  setCitationCnt:jest.fn(),
  setReferencePapersCnt:jest.fn()
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseSoftwareMentionContext = jest.fn(props=>mockSoftwareMentionContext)
jest.mock('~/components/software/edit/mentions/SoftwareMentionContext',()=>({
  useSoftwareMentionContext: jest.fn(props=>mockUseSoftwareMentionContext(props))
}))

describe('frontend/components/software/edit/mentions/outputindex.tsx', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loader when loading=true',()=>{
    mockSoftwareMentionContext.loading=true
    mockUseSoftwareMentionContext.mockReturnValueOnce(mockSoftwareMentionContext)

    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )

    screen.getByRole('progressbar')
  })

  it('renders no related output items', async () => {
    // required software id
    softwareState.id = 'test-software-id'
    // mock no items
    mockSoftwareMentionContext.loading=false
    mockSoftwareMentionContext.output=[]
    mockUseSoftwareMentionContext.mockReturnValueOnce(mockSoftwareMentionContext)
    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )

    screen.getByText('No related output to show')
  })

  it('renders mocked mention items', async () => {
    // required software id
    softwareState.id = 'test-software-id'
    // mock items
    mockSoftwareMentionContext.loading = false
    mockSoftwareMentionContext.output = outputForSoftware as any
    mockUseSoftwareMentionContext.mockReturnValueOnce(mockSoftwareMentionContext)
    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )

    const mentions = screen.getAllByTestId('mention-item-base')
    expect(mentions.length).toEqual(outputForSoftware.length)
  })

  it('search mention by DOI', async () => {
    const validDOI = '10.5281/zenodo.3401363'
    // required software id
    softwareState.id = 'test-software-id'
    mockSoftwareMentionContext.loading = false
    mockSoftwareMentionContext.output = []
    mockUseSoftwareMentionContext.mockReturnValueOnce(mockSoftwareMentionContext)
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
    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // find by DOI
    const find = screen.getByRole('combobox', {
      name: cfgMention.findMention.label
    })
    // populate DOI value
    fireEvent.change(find, {target: {value: validDOI}})

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

  it('search mention by text', async() => {
    const searchFor = 'My lovely mention'
    // required software id
    softwareState.id = 'test-software-id'
    mockSoftwareMentionContext.loading = false
    mockSoftwareMentionContext.output = []
    mockUseSoftwareMentionContext.mockReturnValueOnce(mockSoftwareMentionContext)

    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // find mention
    const find = screen.getByRole('combobox', {
      name: cfgMention.findMention.label
    })
    // populate search value
    fireEvent.change(find, {target: {value: searchFor}})

    await waitFor(() => {
      // call RSD api to find mention by DOI
      expect(mockFindPublicationByTitle).toHaveBeenCalledTimes(1)
      expect(mockFindPublicationByTitle).toHaveBeenCalledWith({
        'id': softwareState.id,
        searchFor,
        'token': mockSession.token
      })
    })
  })

  it('add custom mention', async() => {
    // required software id
    softwareState.id = 'test-software-id'
    mockSoftwareMentionContext.loading = false
    mockSoftwareMentionContext.output = []
    mockUseSoftwareMentionContext.mockReturnValueOnce(mockSoftwareMentionContext)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // hit add button
    const addBtn = screen.getByRole('button', {
      name:'Create'
    })
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
      expect(mockAddNewMentionToSoftware).toHaveBeenCalledTimes(1)
      expect(mockAddNewMentionToSoftware).toHaveBeenCalledWith({
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
        'software': softwareState.id,
        'token': mockSession.token,
      })
    })
  })

  it('delete mention item', async() => {
    // required software id
    softwareState.id = 'test-software-id'
    mockSoftwareMentionContext.loading = false
    mockSoftwareMentionContext.output = outputForSoftware as any
    mockUseSoftwareMentionContext.mockReturnValueOnce(mockSoftwareMentionContext)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // find and use delete button
    const deleteBtns = screen.getAllByTestId('DeleteIcon')
    expect(deleteBtns.length).toEqual(outputForSoftware.length)
    fireEvent.click(deleteBtns[0])

    // find and use cofirm button
    const confirm = await screen.findByRole('button', {
      name: 'Remove'
    })
    fireEvent.click(confirm)

    await waitFor(() => {
      expect(mockRemoveMentionForSoftware).toHaveBeenCalledTimes(1)
      expect(mockRemoveMentionForSoftware).toHaveBeenCalledWith({
        'mention': outputForSoftware[0].id,
        'software': softwareState.id,
        'token': mockSession.token,
      })
    })
  })
})

