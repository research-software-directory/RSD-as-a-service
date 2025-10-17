// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {MarkdownPage} from '../useMarkdownPages'
import config from './config'

import EditMarkdownPages from './EditMarkdownPages'

// MOCKS
// we need to mock this feature - not supported in jsdom
jest.mock('~/utils/useOnUnsavedChange')

const mockProps = {
  links:[]
}
const mockLinks = [
  {id:'test-id-1',slug:'test-slug-1',title:'Test title 1',position:1,is_published:true},
  {id:'test-id-2',slug:'test-slug-2',title:'Test title 2',position:2,is_published:false},
]

// MOCK useMarkdownPage request
const mockPage:MarkdownPage = {
  id: 'test-id-1',
  slug: 'test-slug-1',
  title: 'Test title 1',
  description: 'This is test description',
  is_published: true,
  position: 1
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockMarkdownPage = jest.fn((props) => Promise.resolve({
  page: mockPage
}))
jest.mock('~/components/admin/pages/useMarkdownPages', () => {
  return {
    ...jest.requireActual('~/components/admin/pages/useMarkdownPages'),
    getMarkdownPage: jest.fn((props)=>mockMarkdownPage(props))
  }
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeletePage = jest.fn((props) => Promise.resolve({
  status: 200,
  statusText: 'OK'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUpdatePositions = jest.fn((props) => Promise.resolve({
  status: 200,
  message: 'OK'
}))
jest.mock('../saveMarkdownPage', () => ({
  deleteMarkdownPage: jest.fn((props)=>mockDeletePage(props)),
  updatePagePositions: jest.fn((props)=>mockUpdatePositions(props))
}))

// NOTE! The editing is protected at the level of page
// These components are not protected
describe('frontend/components/admin/pages/edit/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders no custom markdown pages message', async() => {
    render(
      <WithAppContext options={{session:mockSession}}>
        <EditMarkdownPages {...mockProps} />
      </WithAppContext>
    )
    // no page message shown
    const noPagesMsg = screen.getByText('Public markdown pages are not defined.')
    expect(noPagesMsg).toBeInTheDocument()
  })

  it('renders nav items of custom markdown pages', async() => {
    mockProps.links = mockLinks as any
    render(
      <WithAppContext options={{session:mockSession}}>
        <EditMarkdownPages {...mockProps} />
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // nav items shown
    const navItems = screen.getAllByTestId('sortable-nav-item')
    expect(navItems.length).toEqual(mockLinks.length)

    // first item loaded
    const editForm = screen.getByTestId('edit-markdown-form')
    expect(editForm).toBeInTheDocument()
  })

  it('renders selected markdown page for edit', async() => {
    mockProps.links = mockLinks as any
    // mock page response
    mockMarkdownPage.mockResolvedValueOnce({page: mockPage})
    render(
      <WithAppContext options={{session:mockSession}}>
        <EditMarkdownPages {...mockProps} />
      </WithAppContext>
    )
    // nav items shown
    const navItems = screen.getAllByTestId('sortable-nav-item')
    expect(navItems.length).toEqual(mockLinks.length)

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // edit form loaded
    const editForm = screen.getByTestId('edit-markdown-form')
    expect(editForm).toBeInTheDocument()

    // check title value
    const title = screen.getByRole('textbox', {
      name: config.title.label
    })
    expect(title).toHaveValue(mockPage.title)
  })

  it('can delete markdown page', async() => {
    mockProps.links = mockLinks as any
    // mock page response
    mockMarkdownPage.mockResolvedValueOnce({page: mockPage})
    //
    render(
      <WithAppContext options={{session:mockSession}}>
        <EditMarkdownPages {...mockProps} />
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // edit form loaded
    const editForm = screen.getByTestId('edit-markdown-form')
    expect(editForm).toBeInTheDocument()

    // select delete
    const deleteBtn = screen.getByRole('button', {
      name:'Remove'
    })
    expect(deleteBtn).toBeEnabled()

    // click delete
    fireEvent.click(deleteBtn)

    // confirm modal should appear
    const deleteModal = screen.getByTestId('confirm-delete-modal')
    // get confirm button
    const confirmBtn = within(deleteModal).getByRole('button', {
      name:'Remove'
    })
    // click on confirm remove
    fireEvent.click(confirmBtn)
    await waitFor(() => {
      // validate delete page api called
      expect(mockDeletePage).toHaveBeenCalledTimes(1)
      expect(mockDeletePage).toHaveBeenCalledWith({
        'slug': mockPage.slug,
        'token': mockSession.token,
      })
      // validate update positions api called
      expect(mockUpdatePositions).toHaveBeenCalledTimes(1)
      expect(mockUpdatePositions).toHaveBeenCalledWith({
        'items':[
          {
            'id': 'test-id-2',
            'position': 1,
            'title': 'Test title 2',
            'slug': 'test-slug-2',
            'is_published': false
          },
        ],
        'token': mockSession.token,
      })
    })
  })
})
