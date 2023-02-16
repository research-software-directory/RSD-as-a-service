// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'

import SoftwareMentions from './index'
import {cfgMention} from './config'
import {mentionModal} from '~/components/mention/config'

// MOCKS
import mentionForSoftware from './__mocks__/mentionForSoftware.json'
import {initialState as softwareState} from '~/components/software/edit/editSoftwareContext'
import mockCrossrefItems from '~/utils/__mocks__/crossrefItems.json'

// Mock getMentionsForSoftware
const mockGetMentionsForSoftware = jest.fn(props => Promise.resolve([] as any))
const mockGetMentionByDoiFromRsd = jest.fn((props) => Promise.resolve([] as any))

jest.mock('~/utils/editMentions', () => ({
  ...jest.requireActual('~/utils/editMentions'),
  getMentionsForSoftware: jest.fn(props => mockGetMentionsForSoftware(props)),
  getMentionByDoiFromRsd: jest.fn(props=>mockGetMentionByDoiFromRsd(props))
}))

const mockGetMentionByDoi = jest.fn((props) => Promise.resolve([] as any))
jest.mock('~/utils/getDOI', () => ({
  getMentionByDoi: jest.fn(props=>mockGetMentionByDoi(props))
}))

// Mock findPublicationByTitle
const mockFindPublicationByTitle = jest.fn(props => Promise.resolve([] as any))
const mockAddNewMentionToSoftware = jest.fn(props => Promise.resolve({
  status: 200,
  message: props
}))
const mockAddToMentionForSoftware = jest.fn(props => Promise.resolve([] as any))
const mockRemoveMentionForSoftware = jest.fn(props => Promise.resolve([] as any))
jest.mock('./mentionForSoftwareApi', () => ({
  findPublicationByTitle: jest.fn(props => mockFindPublicationByTitle(props)),
  addNewMentionToSoftware: jest.fn(props => mockAddNewMentionToSoftware(props)),
  addToMentionForSoftware: jest.fn(props => mockAddToMentionForSoftware(props)),
  removeMentionForSoftware: jest.fn(props => mockRemoveMentionForSoftware(props))
}))

describe('frontend/components/software/edit/maintainers/index.tsx', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders no mention items', async () => {
    // required software id
    softwareState.software.id = 'test-software-id'
    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )
    // wait for loader
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const noMentionMsg = screen.getByText('No mentions to show')
  })

  it('renders mocked mention items', async () => {
    // required software id
    softwareState.software.id = 'test-software-id'
    // mock response
    mockGetMentionsForSoftware.mockResolvedValueOnce(mentionForSoftware)
    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )
    // wait for loader
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const mentions = screen.getAllByTestId('mention-item-base')
    expect(mentions.length).toEqual(mentionForSoftware.length)

  })

  it('search mention by DOI', async () => {
    const validDOI = '10.5281/zenodo.3401363'
    // required software id
    softwareState.software.id = 'test-software-id'
    // mock no mentions at start
    mockGetMentionsForSoftware.mockResolvedValueOnce([])
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
    // wait for loader
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // find by DOI
    const find = screen.getByRole('combobox', {
      name: cfgMention.findMention.label
    })
    // populate DOI value
    fireEvent.change(find, {target: {value: validDOI}})

    await waitFor(() => {
      // call RSD api to find mention by DOI
      expect(mockGetMentionByDoiFromRsd).toBeCalledTimes(1)
      expect(mockGetMentionByDoiFromRsd).toBeCalledWith({
        'doi': validDOI,
        'token': mockSession.token
      })
      // becase we did not found it in RSD we try doi.org
      expect(mockGetMentionByDoi).toBeCalledTimes(1)
      expect(mockGetMentionByDoi).toBeCalledWith(validDOI)
    })
  })

  it('search mention by text', async() => {
    const searchFor = 'My lovely mention'
    // required software id
    softwareState.software.id = 'test-software-id'
    // mock no mentions at start
    mockGetMentionsForSoftware.mockResolvedValueOnce([])

    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )
    // wait for loader
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // find mention
    const find = screen.getByRole('combobox', {
      name: cfgMention.findMention.label
    })
    // populate search value
    fireEvent.change(find, {target: {value: searchFor}})

    await waitFor(() => {
      // call RSD api to find mention by DOI
      expect(mockFindPublicationByTitle).toBeCalledTimes(1)
      expect(mockFindPublicationByTitle).toBeCalledWith({
       'software': softwareState.software.id,
       searchFor,
       'token': mockSession.token
      })
    })
  })

  it('add custom mention', async() => {
    // required software id
    softwareState.software.id = 'test-software-id'
    // mock no mentions at start
    mockGetMentionsForSoftware.mockResolvedValueOnce([])

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )
    // wait for loader
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // hit add button
    const addBtn = screen.getByRole('button', {
      name:'add'
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
    const select = within(selectGroup).getByRole('button')
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
      expect(mockAddNewMentionToSoftware).toBeCalledTimes(1)
      expect(mockAddNewMentionToSoftware).toBeCalledWith({
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
       'software': softwareState.software.id,
       'token': mockSession.token,
      })
    })
  })

  it('delete mention item', async() => {
    // required software id
    softwareState.software.id = 'test-software-id'
    // mock no mentions at start
    mockGetMentionsForSoftware.mockResolvedValueOnce(mentionForSoftware)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareMentions />
        </WithSoftwareContext>
      </WithAppContext>
    )
    // wait for loader
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // find and use delete button
    const deleteBtns = screen.getAllByTestId('DeleteIcon')
    expect(deleteBtns.length).toEqual(mentionForSoftware.length)
    fireEvent.click(deleteBtns[0])

    // find and use cofirm button
    const confirm = await screen.findByRole('button', {
      name: 'Remove'
    })
    fireEvent.click(confirm)

    await waitFor(() => {
      expect(mockRemoveMentionForSoftware).toBeCalledTimes(1)
      expect(mockRemoveMentionForSoftware).toBeCalledWith({
        'mention': mentionForSoftware[0].id,
        'software': softwareState.software.id,
        'token': mockSession.token,
      })
    })
  })
})

