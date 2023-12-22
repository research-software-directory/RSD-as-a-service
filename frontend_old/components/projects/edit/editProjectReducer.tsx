// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {EditProjectState} from './editProjectContext'

export enum EditProjectActionType {
  SET_PROJECT_TITLE = 'SET_PROJECT_TITLE',
  SET_PROJECT_SLUG = 'SET_PROJECT_SLUG',
  SET_PROJECT_INFO = 'SET_PROJECT_INFO',
  UPDATE_STATE = 'UPDATE_STATE',
  SET_EDIT_PAGE_INDEX = 'SET_EDIT_PAGE_INDEX',
  SET_LOADING = 'SET_LOADING'
}

export type Action = {
  type: EditProjectActionType,
  payload: any
}

export function editProjectReducer(state: EditProjectState, action: Action) {
  // console.group('editProjectReducer')
  // console.log('state...', state)
  // console.log('action...', action)
  // console.groupEnd()
  switch (action.type) {
    case EditProjectActionType.SET_EDIT_PAGE_INDEX:
      return {
        ...state,
        pageIndex: action.payload
      }
    case EditProjectActionType.SET_PROJECT_INFO:
      return {
        ...state,
        project: {
          ...state.project,
          ...action.payload
        }
      }
    case EditProjectActionType.SET_PROJECT_SLUG:
      return {
        ...state,
        project: {
          ...state.project,
          slug: action.payload
        }
      }
    case EditProjectActionType.SET_PROJECT_TITLE:
      return {
        ...state,
        project: {
          ...state.project,
          title: action.payload
        }
      }
    case EditProjectActionType.UPDATE_STATE: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      logger(`editProjectReducer UNKNOWN ACTION TYPE ${action.type}`, 'warn')
      return state
  }
}
