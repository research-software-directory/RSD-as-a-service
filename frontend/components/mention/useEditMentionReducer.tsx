// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'
import {EditMentionActionType} from './editMentionReducer'
import EditMentionContext from './editMentionContext'
import {MentionItemProps} from '~/types/Mention'

export default function useEditMentionReducer() {
  const {state, dispatch} = useContext(EditMentionContext)

  function setLoading(loading: boolean) {
    dispatch({
      type: EditMentionActionType.SET_LOADING,
      payload: loading
    })
  }

  function setMentions(mentions: MentionItemProps[]) {
    dispatch({
      type: EditMentionActionType.SET_MENTIONS,
      payload: mentions
    })
  }

  function onAdd(item: MentionItemProps) {
    dispatch({
      type: EditMentionActionType.ON_ADD,
      payload: item
    })
  }

  function onNewItem() {
    dispatch({
      type: EditMentionActionType.SET_EDIT_MODAL,
      payload: {
        open:true
      }
    })
  }

  function onSubmit(item:MentionItemProps) {
    dispatch({
      type: EditMentionActionType.ON_SUBMIT,
      payload: item
    })
  }

  function onUpdate(item:MentionItemProps) {
    dispatch({
      type: EditMentionActionType.ON_UPDATE,
      payload: item
    })
  }

  function onDelete(item:MentionItemProps) {
    dispatch({
      type: EditMentionActionType.ON_DELETE,
      payload: item
    })
  }

  function confirmDelete(item?: MentionItemProps) {
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
  }

  function setEditModal(item?: MentionItemProps) {
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
  }

  // console.group('useOutputContext')
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
