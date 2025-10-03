// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {createContext, useReducer} from 'react'
import logger from '~/utils/logger'

export type ProjectInfo = {
  id: string,
  slug: string,
  title: string
}

export const initialState: ProjectInfo = {
  id: '',
  slug: '',
  title:''
}

export type EditProjectContextProps = {
  state: ProjectInfo,
  dispatch: (action:Action) => void
}


const EditProjectContext = createContext<EditProjectContextProps>({
  state: initialState,
  dispatch: ()=>{}
})

export function EditProjectProvider(props: any) {
  const [state, dispatch] = useReducer(editProjectReducer, props?.state ?? initialState)

  // console.group('EditProjectProvider')
  // console.log('props...', props)
  // console.log('state...', state)
  // console.groupEnd()

  return (
    <EditProjectContext.Provider
      value={{state,dispatch}} // NOSONAR - this object should be refreshed on every render
      {...props}
    />
  )
}

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

export function editProjectReducer(state: ProjectInfo, action: Action) {
  // console.group('editProjectReducer')
  // console.log('state...', state)
  // console.log('action...', action)
  // console.groupEnd()
  switch (action.type) {
    case EditProjectActionType.SET_PROJECT_INFO:
    case EditProjectActionType.UPDATE_STATE: {
      return {
        ...state,
        ...action.payload
      }
    }
    case EditProjectActionType.SET_PROJECT_SLUG:
      return {
        ...state,
        slug: action.payload
      }
    case EditProjectActionType.SET_PROJECT_TITLE:
      return {
        ...state,
        title: action.payload
      }
    default:
      logger(`editProjectReducer UNKNOWN ACTION TYPE ${action.type}`, 'warn')
      return state
  }
}

export default EditProjectContext
