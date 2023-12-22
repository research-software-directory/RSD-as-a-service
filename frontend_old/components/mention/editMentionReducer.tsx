// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {MentionItemProps} from '~/types/Mention'
import logger from '~/utils/logger'
import {sortOnDateProp} from '~/utils/sortFn'
import {EditMentionSettings, EditModalProps} from './editMentionContext'

export enum EditMentionActionType{
  SET_MENTIONS='SET_MENTIONS',
  ON_ADD='ON_ADD',
  ON_SUBMIT='ON_SUBMIT',
  ON_UPDATE='ON_UPDATE',
  ON_DELETE='ON_DELETE',
  ADD_ITEM='ADD_ITEM',
  UPDATE_ITEM ='UPDATE_ITEM',
  DELETE_ITEM='DELETE_ITEM',
  REPLACE_ITEM='REPLACE_ITEM',
  SETTINGS='SETTINGS',
  SET_CONFIRM_MODAL='SET_CONFIRM_MODAL',
  SET_EDIT_MODAL='SET_EDIT_MODAL',
  SET_LOADING='SET_LOADING',
  SET_PROCESSING = 'SET_PROCESSING',
  // actions used to show messages
  // ussing middleware not represented in state
  ON_ERROR = 'ON_ERROR',
  ON_SUCCESS ='ON_SUCCESS'
}

export type EditMentionAction = {
  type: EditMentionActionType,
  payload: any
}

export type EditMentionState = {
  settings: EditMentionSettings
  loading: boolean,
  processing: boolean,
  mentions: MentionItemProps[]
  editModal: EditModalProps
  confirmModal: EditModalProps
}

export function editMentionReducer(state: EditMentionState, action: EditMentionAction) {
  // console.group('editMentionReducer')
  // console.log('action...', action)
  // console.log('stateBefore...', state)
  // console.groupEnd()
  switch (action.type) {
    case EditMentionActionType.SET_MENTIONS:
      return {
        ...state,
        mentions: action.payload as MentionItemProps[],
        // set loading to false
        loading: false,
      }
    case EditMentionActionType.ON_ADD:
    case EditMentionActionType.ON_UPDATE:
    case EditMentionActionType.ON_DELETE:
      return {
        ...state,
        // set processing state
        processing:true
      }
    case EditMentionActionType.ADD_ITEM:
      // add new item to mention collection
      return {
        ...state,
        // set processing state
        processing: false,
        mentions: [
          ...state.mentions,
          action.payload as MentionItemProps
        ]
      }
    case EditMentionActionType.ON_SUBMIT:
      return {
        ...state,
        // set processing state
        processing: true,
        // close modal
        editModal: {
          open:false
        }
      }
    case EditMentionActionType.UPDATE_ITEM:
      // replace existing item with payload
      const mention = action.payload
      const updatedList = state.mentions
        .map(item => {
          if (item.id === mention.id) {
            return mention
          }
          return item
        })
        .sort((a, b) => {
          // sort mentions on date, newest at the top
          return sortOnDateProp(a,b,'publication_year','desc')
        })
      return {
        ...state,
        // set processing state
        processing: false,
        mentions: updatedList as MentionItemProps[]
      }
    case EditMentionActionType.REPLACE_ITEM:
      // replace existing item with payload
      const {newItem, oldItem} = action.payload
      const replacedList = state.mentions
        .map(item => {
          if (item.id === oldItem.id) {
            return newItem
          }
          return item
        })
        .sort((a, b) => {
          // sort mentions on date, newest at the top
          return sortOnDateProp(a,b,'publication_year','desc')
        })
      return {
        ...state,
        // set processing state
        processing: false,
        mentions: replacedList as MentionItemProps[]
      }
    case EditMentionActionType.DELETE_ITEM:
      // remove item to delete from impact state
      const id = action.payload.id
      const newList = state.mentions
        .filter(item => item.id !== id)
        .sort((a, b) => {
          // sort mentions on date, newest at the top
          return sortOnDateProp(a,b,'publication_year','desc')
        })
      return {
        ...state,
        mentions: newList
      }
    case EditMentionActionType.SETTINGS:
      return {
        ...state,
        settings: action.payload
      }
    case EditMentionActionType.SET_CONFIRM_MODAL:
      return {
        ...state,
        confirmModal: action.payload
      }
    case EditMentionActionType.SET_EDIT_MODAL:
      return {
        ...state,
        editModal: action.payload
      }
    case EditMentionActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    case EditMentionActionType.SET_PROCESSING:
      return {
        ...state,
        processing: action.payload
      }
    case EditMentionActionType.ON_ERROR:
    case EditMentionActionType.ON_SUCCESS:
      // just reset processing and loading states
      return {
        ...state,
        processing: false,
        loading: false
      }
    default:
      logger(`editMentionReducer UNKNOWN ACTION TYPE ${action.type}`, 'warn')
      return state
  }
}
