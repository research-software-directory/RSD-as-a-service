// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {createContext, useReducer} from 'react'

import logger from '~/utils/logger'

export type SoftwareInfo = {
  id: string,
  slug: string,
  brand_name: string,
  concept_doi: string | null,
}

export const initialState = {
  id: '',
  slug: '',
  brand_name:'',
  concept_doi: '',
}

export type EditSoftwareContextProps = {
  state: SoftwareInfo,
  dispatch: (action:EditSoftwareAction) => void
}

const EditSoftwareContext = createContext<EditSoftwareContextProps>({
  state: initialState,
  dispatch: ()=>{}
})

export function EditSoftwareProvider(props: any) {
  const [state, dispatch] = useReducer(editSoftwareReducer, props?.state ?? initialState)

  // console.group('EditSoftwareProvider')
  // console.log('state...', state)
  // console.groupEnd()

  return (
    <EditSoftwareContext.Provider
      value={{state,dispatch}} // NOSONAR - this object should be refreshed on every render
      {...props}
    />
  )
}

export type EditSoftwareAction = {
  type: EditSoftwareActionType,
  payload: any
}

export enum EditSoftwareActionType {
  SET_SOFTWARE_TITLE = 'SET_SOFTWARE_TITLE',
  SET_SOFTWARE_SLUG = 'SET_SOFTWARE_SLUG',
  SET_SOFTWARE_INFO = 'SET_SOFTWARE_INFO',
  SET_SOFTWARE_DOI = 'SET_SOFTWARE_DOI',
  // SET_EDIT_PAGE_INDEX = 'SET_EDIT_PAGE_INDEX',
  SET_LOADING = 'SET_LOADING',
  UPDATE_STATE = 'UPDATE_STATE',
}

export function editSoftwareReducer(state: SoftwareInfo = initialState, action: EditSoftwareAction) {
  // console.group('editSoftwareReducer')
  // console.log('state...', state)
  // console.log('action...', action)
  // console.groupEnd()
  switch (action.type) {
    case EditSoftwareActionType.SET_SOFTWARE_INFO:
    case EditSoftwareActionType.UPDATE_STATE:
      return {
        ...state,
        ...action.payload
      }
    case EditSoftwareActionType.SET_SOFTWARE_TITLE:
      return {
        ...state,
        brand_name: action.payload
      }
    case EditSoftwareActionType.SET_SOFTWARE_SLUG:
      return {
        ...state,
        slug: action.payload
      }
    case EditSoftwareActionType.SET_SOFTWARE_DOI:
      return {
        ...state,
        concept_doi: action.payload
      }
    default:
      logger(`editSoftwareReducer UNKNOWN ACTION TYPE ${action.type}`, 'warn')
      return state
  }
}


export default EditSoftwareContext
