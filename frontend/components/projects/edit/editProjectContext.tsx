// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useReducer} from 'react'
import {Action} from './editProjectReducer'

import {EditProjectStep, editProjectSteps} from './editProjectSteps'
import {editProjectReducer} from './editProjectReducer'

export type ProjectInfo = {
  id: string,
  slug: string,
  title: string
}

export type EditProjectState = {
  step: EditProjectStep | undefined,
  project: ProjectInfo,
  loading: boolean
}

export const initialState: EditProjectState = {
  // loading first page/step by default
  step: editProjectSteps[0],
  project: {
    id: '',
    slug: '',
    title:''
  },
  loading:true
}

export type EditProjectContextProps = {
  state: EditProjectState,
  dispatch: (action:Action) => void
}


const EditProjectContext = createContext<EditProjectContextProps>({
  state: initialState,
  dispatch: (action)=>{}
})

export function EditProjectProvider(props: any) {
  const [state, dispatch] = useReducer(editProjectReducer, props?.state ?? initialState)

  return (
    <EditProjectContext.Provider value={{
        state,
        dispatch
      }}
      {...props}
    />
  )
}

export default EditProjectContext
