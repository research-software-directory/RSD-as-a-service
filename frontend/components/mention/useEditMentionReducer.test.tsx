/* eslint-disable react-hooks/exhaustive-deps */

// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {render} from '@testing-library/react'
import {EditMentionState} from './editMentionReducer'

import EditMentionContext from '~/components/mention/editMentionContext'
import useEditMentionReducer from './useEditMentionReducer'
import {EditMentionActionType} from './editMentionReducer'

// MOCKS
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

beforeEach(() => {
  jest.clearAllMocks()
})

it('calls SET_LOADING action', () => {
  const action = {
    type: EditMentionActionType.SET_LOADING,
    payload: false
  }
  // wrap reducer hook
  function SetLoadingUseMentionReducer() {
    const {setLoading} = useEditMentionReducer()

    useEffect(() => {
      setLoading(false)
    }, [])

    return (
      <h1>{EditMentionActionType.SET_LOADING}</h1>
    )
  }
  // render
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <SetLoadingUseMentionReducer />
    </EditMentionContext.Provider>
  )

  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)
})

it('calls SET_MENTIONS action', () => {
  const action = {
    type: EditMentionActionType.SET_MENTIONS,
    payload: []
  }
  // wrap reducer hook
  function SetMentionsUseMentionReducer() {
    const {setMentions} = useEditMentionReducer()

    useEffect(() => {
      setMentions([])
    }, [])

    return (
      <h1>{EditMentionActionType.SET_MENTIONS}</h1>
    )
  }
  // render function
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <SetMentionsUseMentionReducer />
    </EditMentionContext.Provider>
  )
  // assert
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)

})

it('calls ON_ADD action', () => {
  const action = {
    type: EditMentionActionType.ON_ADD,
    payload: mockItem
  }
  // wrap reducer hook
  function UseMentionReducer() {
    const {onAdd} = useEditMentionReducer()

    useEffect(() => {
      onAdd(mockItem as any)
    }, [])

    return (
      <h1>{EditMentionActionType.ON_ADD}</h1>
    )
  }
  // render function
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <UseMentionReducer />
    </EditMentionContext.Provider>
  )
  // assert
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)

})

it('calls SET_EDIT_MODAL action', () => {
  const action = {
    type: EditMentionActionType.SET_EDIT_MODAL,
    payload: {open:true}
  }
  // wrap reducer hook
  function UseMentionReducer() {
    const {onNewItem} = useEditMentionReducer()

    useEffect(() => {
      onNewItem()
    }, [])

    return (
      <h1>{EditMentionActionType.SET_EDIT_MODAL}</h1>
    )
  }
  // render function
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <UseMentionReducer />
    </EditMentionContext.Provider>
  )
  // assert
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)

})

it('calls ON_SUBMIT action', () => {
  const action = {
    type: EditMentionActionType.ON_SUBMIT,
    payload: mockItem
  }
  // wrap reducer hook
  function UseMentionReducer() {
    const {onSubmit} = useEditMentionReducer()

    useEffect(() => {
      onSubmit(mockItem as any)
    }, [])

    return (
      <h1>{EditMentionActionType.ON_SUBMIT}</h1>
    )
  }
  // render function
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <UseMentionReducer />
    </EditMentionContext.Provider>
  )
  // assert
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)

})

it('calls ON_UPDATE action', () => {
  const action = {
    type: EditMentionActionType.ON_UPDATE,
    payload: mockItem
  }
  // wrap reducer hook
  function UseMentionReducer() {
    const {onUpdate} = useEditMentionReducer()

    useEffect(() => {
      onUpdate(mockItem as any)
    }, [])

    return (
      <h1>{EditMentionActionType.ON_UPDATE}</h1>
    )
  }
  // render function
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <UseMentionReducer />
    </EditMentionContext.Provider>
  )
  // assert
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)

})

it('calls ON_DELETE action', () => {
  const action = {
    type: EditMentionActionType.ON_DELETE,
    payload: mockItem
  }
  // wrap reducer hook
  function UseMentionReducer() {
    const {onDelete} = useEditMentionReducer()

    useEffect(() => {
      onDelete(mockItem as any)
    }, [])

    return (
      <h1>{EditMentionActionType.ON_DELETE}</h1>
    )
  }
  // render function
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <UseMentionReducer />
    </EditMentionContext.Provider>
  )
  // assert
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)

})

it('calls SET_CONFIRM_MODAL action', () => {
  const action = {
    type: EditMentionActionType.SET_CONFIRM_MODAL,
    payload: {
      open:true,
      item:mockItem
    }
  }
  // wrap reducer hook
  function UseMentionReducer() {
    const {confirmDelete} = useEditMentionReducer()

    useEffect(() => {
      confirmDelete(mockItem as any)
    }, [])

    return (
      <h1>{EditMentionActionType.SET_CONFIRM_MODAL}</h1>
    )
  }
  // render function
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <UseMentionReducer />
    </EditMentionContext.Provider>
  )
  // assert
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)

})

it('calls SET_CONFIRM_MODAL to close modal', () => {
  const action = {
    type: EditMentionActionType.SET_CONFIRM_MODAL,
    payload: {
      open:false
    }
  }
  // wrap reducer hook
  function UseMentionReducer() {
    const {confirmDelete} = useEditMentionReducer()

    useEffect(() => {
      confirmDelete()
    }, [])

    return (
      <h1>{EditMentionActionType.SET_CONFIRM_MODAL}</h1>
    )
  }
  // render function
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <UseMentionReducer />
    </EditMentionContext.Provider>
  )
  // assert
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)

})

it('calls SET_EDIT_MODAL to open modal', () => {
  const action = {
    type: EditMentionActionType.SET_EDIT_MODAL,
    payload: {
      open: true,
      item: mockItem
    }
  }
  // wrap reducer hook
  function UseMentionReducer() {
    const {setEditModal} = useEditMentionReducer()

    useEffect(() => {
      setEditModal(mockItem as any)
    }, [])

    return (
      <h1>{EditMentionActionType.SET_EDIT_MODAL}</h1>
    )
  }
  // render function
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <UseMentionReducer />
    </EditMentionContext.Provider>
  )
  // assert
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)

})

it('calls SET_EDIT_MODAL to close modal', () => {
  const action = {
    type: EditMentionActionType.SET_EDIT_MODAL,
    payload: {
      open:false
    }
  }
  // wrap reducer hook
  function UseMentionReducer() {
    const {setEditModal} = useEditMentionReducer()

    useEffect(() => {
      setEditModal()
    }, [])

    return (
      <h1>{EditMentionActionType.SET_EDIT_MODAL}</h1>
    )
  }
  // render function
  render(
    <EditMentionContext.Provider
      value={{state:mockState,dispatch:mockDispatch}}
    >
      <UseMentionReducer />
    </EditMentionContext.Provider>
  )
  // assert
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch).toHaveBeenCalledWith(action)

})
