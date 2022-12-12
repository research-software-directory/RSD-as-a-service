// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {
  editMentionReducer,
  EditMentionActionType,
  EditMentionState
} from './editMentionReducer'

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

const mockItem = {
  'authors': 'test authors here',
  'doi': null,
  'id': 'test-id-1',
  'image_url': null,
  'mention_type': 'bookSection',
  'note': 'This is test note',
  'page': '100-200',
  'publication_year': 2020,
  'publisher': 'test publisher here',
  'source': 'manual',
  'title': 'Featured item title',
  'url': 'https://test.com/page1',
}


it('Action SET_MENTIONS', () => {
  const items = [
    mockItem
  ]
  const action = {
    type: EditMentionActionType.SET_MENTIONS,
    payload: items
  }

  const state = editMentionReducer(mockState, action)

  expect(state.mentions).toEqual(items)
})

it('Action ON_ADD', () => {
  const action = {
    type: EditMentionActionType.ON_ADD,
    payload: undefined
  }

  const state = editMentionReducer(mockState, action)

  expect(state.processing).toEqual(true)
})

it('Action ADD_ITEM', () => {
  // const item = {test:'Test item 1'}
  const action = {
    type: EditMentionActionType.ADD_ITEM,
    payload: mockItem
  }

  const state = editMentionReducer(mockState, action)

  expect(state.mentions).toEqual([mockItem])
  expect(state.processing).toEqual(false)
})

it('Action ON_SUBMIT', () => {

  const action = {
    type: EditMentionActionType.ON_SUBMIT,
    payload: undefined
  }

  const state = editMentionReducer(mockState, action)
  // set processing flag
  expect(state.processing).toEqual(true)
  // close edit modal
  expect(state.editModal.open).toEqual(false)
})

it('Action UPDATE_ITEM', () => {
  mockState.mentions = [
    mockItem as any
  ]

  const updatedItem = {
    ...mockItem,
    title:'updated test title'
  }

  const action = {
    type: EditMentionActionType.UPDATE_ITEM,
    payload: updatedItem
  }

  const state = editMentionReducer(mockState, action)
  // set processing flag
  expect(state.processing).toEqual(false)
  // close edit modal
  expect(state.mentions).toEqual([updatedItem])
})

it('Action REPLACE_ITEM', () => {
  mockState.mentions = [
    mockItem as any
  ]

  const updatedItem = {
    ...mockItem,
    title:'updated test title'
  }

  const action = {
    type: EditMentionActionType.REPLACE_ITEM,
    payload: {
      newItem: updatedItem,
      oldItem: mockItem
    }
  }

  const state = editMentionReducer(mockState, action)
  // set processing flag
  expect(state.processing).toEqual(false)
  // close edit modal
  expect(state.mentions).toEqual([updatedItem])
})

it('Action DELETE_ITEM', () => {
  mockState.mentions = [
    mockItem as any
  ]

  const action = {
    type: EditMentionActionType.DELETE_ITEM,
    payload: mockItem
  }

  const state = editMentionReducer(mockState, action)
  // set processing flag
  expect(state.processing).toEqual(false)
  // close edit modal
  expect(state.mentions).toEqual([])
})

it('Action SET_CONFIRM_MODAL', () => {

  const action = {
    type: EditMentionActionType.SET_CONFIRM_MODAL,
    payload: {open:true}
  }

  const state = editMentionReducer(mockState, action)
  // set processing flag
  expect(state.confirmModal.open).toEqual(true)
})

it('Action SET_EDIT_MODAL', () => {

  const action = {
    type: EditMentionActionType.SET_EDIT_MODAL,
    payload: {open:true}
  }

  const state = editMentionReducer(mockState, action)
  // set processing flag
  expect(state.editModal.open).toEqual(true)
})

it('Action SET_LOADING', () => {

  const action = {
    type: EditMentionActionType.SET_LOADING,
    payload: true
  }

  const state = editMentionReducer(mockState, action)
  // set processing flag
  expect(state.loading).toEqual(true)
})
