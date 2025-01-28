// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'
import {WithAppContext,mockSession} from '~/utils/jest/WithAppContext'

import EditMentionContext from '~/components/mention/editMentionContext'
import MentionEditFeatured from './MentionEditFeatured'
import {EditMentionState} from './editMentionReducer'
import {MentionItemProps} from '~/types/Mention'

const mockDispatch = jest.fn()
const mockState:EditMentionState = {
  settings: {
    editModalTitle: 'Test modal title',
    confirmDeleteModalTitle: 'Test delete modal title',
    noItemsComponent:()=><h1>No items component</h1>
  },
  loading: true,
  processing: false,
  mentions: [],
  editModal: {
    open:false
  },
  confirmModal: {
    open:false
  }
}

const mockItem:MentionItemProps = {
  id: 'test-id-1',
  doi: null,
  url: 'https://test.com/page1',
  title: 'Featured item title',
  authors: 'test authors here',
  publisher: 'test publisher here',
  publication_year: 2020,
  page: '100-200',
  journal: null,
  // url to external image
  image_url: 'https://test-image.com/page1',
  mention_type: 'bookSection',
  source: 'manual',
  note: 'This is test note'
}

beforeEach(() => {
  jest.clearAllMocks()
})

it('renders component with image and (only) delete btn', () => {
  render(
    <WithAppContext>
      <EditMentionContext.Provider
        value={{state:mockState,dispatch:mockDispatch}}
      >
        <MentionEditFeatured item={mockItem} />
      </EditMentionContext.Provider>
    </WithAppContext>
  )

  // renders image as background component
  const image = screen.getByTestId('image-as-background')
  expect(image).toBeInTheDocument()

  // renders title
  const title = screen.getByText(mockItem.title as string)
  expect(title).toBeInTheDocument()

  // renders delete button
  const deleteBtn = screen.getByTestId('delete-mention-btn')
  expect(deleteBtn).toBeInTheDocument()

  // do not renders edit button by default
  const editBtn = screen.queryByTestId('edit-mention-btn')
  expect(editBtn).not.toBeInTheDocument()
})

it('dispatch confirmDelete on delete click', () => {
  const expectedDispatch = {
    'type': 'SET_CONFIRM_MODAL',
    'payload':{
      'item': {
        'authors': 'test authors here',
        'doi': null,
        'id': 'test-id-1',
        'image_url': 'https://test-image.com/page1',
        'journal': null,
        'mention_type': 'bookSection',
        'note': 'This is test note',
        'page': '100-200',
        'publication_year': 2020,
        'publisher': 'test publisher here',
        'source': 'manual',
        'title': 'Featured item title',
        'url': 'https://test.com/page1',
      },
      'open': true,
    }
  }

  render(
    <WithAppContext>
      <EditMentionContext.Provider
        value={{state:mockState,dispatch:mockDispatch}}
      >
        <MentionEditFeatured item={mockItem} />
      </EditMentionContext.Provider>
    </WithAppContext>
  )

  // renders delete button
  const deleteBtn = screen.getByTestId('delete-mention-btn')
  expect(deleteBtn).toBeInTheDocument()
  // click on delete
  fireEvent.click(deleteBtn)
  // validate dispatch call
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(expectedDispatch)
})

it('edit action for rsd_admin when no doi', () => {
  // prepare data
  mockItem.doi = null
  if (mockSession.user) {
    mockSession.user.role = 'rsd_admin'
  }

  const expectedAction = {
    'type': 'SET_EDIT_MODAL',
    'payload':{
      'item':{
        'authors': 'test authors here',
        'doi': null,
        'id': 'test-id-1',
        'image_url': 'https://test-image.com/page1',
        'journal': null,
        'mention_type': 'bookSection',
        'note': 'This is test note',
        'page': '100-200',
        'publication_year': 2020,
        'publisher': 'test publisher here',
        'source': 'manual',
        'title': 'Featured item title',
        'url': 'https://test.com/page1',
      },
      'open': true,
    },
  }

  // render components
  render(
    <WithAppContext options={{session:mockSession}}>
      <EditMentionContext.Provider
        value={{state:mockState,dispatch:mockDispatch}}
      >
        <MentionEditFeatured item={mockItem} />
      </EditMentionContext.Provider>
    </WithAppContext>
  )

  // do not renders edit button by default
  const editBtn = screen.queryByTestId('edit-mention-btn')
  expect(editBtn).toBeInTheDocument()

  // click edit button
  fireEvent.click(editBtn as any)

  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(expectedAction)

})
