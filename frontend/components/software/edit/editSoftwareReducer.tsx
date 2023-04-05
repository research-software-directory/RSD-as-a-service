// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {EditSoftwareState, initialState} from './editSoftwareContext'

export type EditSoftwareAction = {
  type: EditSoftwareActionType,
  payload: any
}

export enum EditSoftwareActionType {
  SET_SOFTWARE_TITLE = 'SET_SOFTWARE_TITLE',
  SET_SOFTWARE_SLUG = 'SET_SOFTWARE_SLUG',
  SET_SOFTWARE_INFO = 'SET_SOFTWARE_INFO',
  SET_SOFTWARE_DOI = 'SET_SOFTWARE_DOI',
  SET_EDIT_PAGE_INDEX = 'SET_EDIT_PAGE_INDEX',
  SET_LOADING = 'SET_LOADING',
  UPDATE_STATE = 'UPDATE_STATE',
}

export function editSoftwareReducer(state: EditSoftwareState = initialState, action: EditSoftwareAction) {
  // console.group('editSoftwareReducer')
  // console.log('state...', state)
  // console.log('action...', action)
  // console.groupEnd()
  switch (action.type) {
    case EditSoftwareActionType.SET_EDIT_PAGE_INDEX:
      return {
        ...state,
        pageIndex: action.payload
      }
    case EditSoftwareActionType.SET_SOFTWARE_INFO:
      return {
        ...state,
        software: {
          ...state.software,
          ...action.payload
        }
      }
    case EditSoftwareActionType.SET_SOFTWARE_TITLE:
      return {
        ...state,
        software: {
          ...state.software,
          brand_name: action.payload
        }
      }
    case EditSoftwareActionType.SET_SOFTWARE_SLUG:
      return {
        ...state,
        software: {
          ...state.software,
          slug: action.payload
        }
      }
    case EditSoftwareActionType.SET_SOFTWARE_DOI:
      return {
        ...state,
        software: {
          ...state.software,
          concept_doi: action.payload
        }
      }
    case EditSoftwareActionType.UPDATE_STATE:
      return {
        ...state,
        ...action.payload
      }
    default:
      logger(`editSoftwareReducer UNKNOWN ACTION TYPE ${action.type}`, 'warn')
      return state
  }
}
