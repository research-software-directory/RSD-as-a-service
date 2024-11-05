// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useEffect, useReducer} from 'react'

import {Action, EditProjectActionType, editProjectReducer} from './editProjectReducer'

export type ProjectInfo = {
  id: string,
  slug: string,
  title: string
}

export type EditProjectState = {
  // step: EditProjectStep | undefined,
  pageIndex: number,
  project: ProjectInfo,
  // loading: boolean
}

export const initialState: EditProjectState = {
  // loading first page/step by default
  // step: editProjectSteps[0],
  pageIndex: 0,
  project: {
    id: '',
    slug: '',
    title:''
  },
  // loading:true
}

export type EditProjectContextProps = {
  state: EditProjectState,
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

  useEffect(() => {
    // The project context is used on dynamic edit project page.
    // Basic project information is loaded server side on each change
    // of dynamic page. NOTE! useReducer state runs in a different context
    // AND takes only initial props.state. In order to ensure latest state
    // loaded on server side is passed into the context we need to update
    // the context state using dispatch/reducer functions.
    if (props?.state && props.state.pageIndex) {
      if (props.state.pageIndex !== state.pageIndex) {
        // debugger
        dispatch({
          type: EditProjectActionType.UPDATE_STATE,
          payload: props.state
        })
      }
    }
  },[props?.state, state.pageIndex])

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
