// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useCallback, useContext} from 'react'
import {EditMentionActionType} from './editMentionReducer'
import EditMentionContext from './editMentionContext'
import {MentionItemProps} from '~/types/Mention'

export default function useEditMentionReducer() {
  const {state, dispatch} = useContext(EditMentionContext)

  const setLoading = useCallback((loading:boolean)=>{
    dispatch({
      type: EditMentionActionType.SET_LOADING,
      payload: loading
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const setMentions = useCallback((mentions: MentionItemProps[])=>{
    dispatch({
      type: EditMentionActionType.SET_MENTIONS,
      payload: mentions
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const onAdd = useCallback((item: MentionItemProps)=>{
    dispatch({
      type: EditMentionActionType.ON_ADD,
      payload: item
    })
  },[dispatch])

  const onNewItem = useCallback(()=>{
    dispatch({
      type: EditMentionActionType.SET_EDIT_MODAL,
      payload: {
        open:true
      }
    })
  },[dispatch])

  const onSubmit = useCallback((item:MentionItemProps)=>{
    dispatch({
      type: EditMentionActionType.ON_SUBMIT,
      payload: item
    })
  },[dispatch])

  const onUpdate = useCallback((item:MentionItemProps)=>{
    dispatch({
      type: EditMentionActionType.ON_UPDATE,
      payload: item
    })
  },[dispatch])

  const onDelete = useCallback((item:MentionItemProps)=>{
    dispatch({
      type: EditMentionActionType.ON_DELETE,
      payload: item
    })
  },[dispatch])

  const confirmDelete = useCallback((item?: MentionItemProps)=>{
    if (item) {
      // open modal
      dispatch({
        type: EditMentionActionType.SET_CONFIRM_MODAL,
        payload: {
          open:true,
          item
        }
      })
    } else {
      // close modal when no item provided
      dispatch({
        type: EditMentionActionType.SET_CONFIRM_MODAL,
        payload: {
          open:false
        }
      })
    }
  },[dispatch])

  const setEditModal = useCallback((item?: MentionItemProps)=>{
    if (item) {
      // show modal when item provided
      dispatch({
        type: EditMentionActionType.SET_EDIT_MODAL,
        payload: {
          open: true,
          item
        }
      })
    } else {
      // hide
      dispatch({
        type: EditMentionActionType.SET_EDIT_MODAL,
        payload: {
          open: false
        }
      })
    }
  },[dispatch])

  // console.group('useEditMentionReducer')
  // console.log('state...', state)
  // console.groupEnd()

  return {
    setLoading,
    setMentions,
    onNewItem,
    onAdd,
    onSubmit,
    onUpdate,
    onDelete,
    confirmDelete,
    setEditModal,
    ...state
  }
}
