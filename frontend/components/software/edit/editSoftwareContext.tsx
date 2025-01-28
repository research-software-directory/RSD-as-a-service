// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useEffect, useReducer} from 'react'

import {EditSoftwareAction, EditSoftwareActionType, editSoftwareReducer} from './editSoftwareReducer'

export type SoftwareInfo = {
  id: string,
  slug: string,
  brand_name: string,
  concept_doi: string | null,
}

export type EditSoftwareState = {
  // page: EditSoftwarePageProps
  pageIndex: number,
  software: SoftwareInfo
}

export const initialState = {
  // page: editSoftwarePage[0],
  pageIndex: 0,
  software: {
    id: '',
    slug: '',
    brand_name:'',
    concept_doi: '',
  }
}

export type EditSoftwareContextProps = {
  state: EditSoftwareState,
  dispatch: (action:EditSoftwareAction) => void
}

const EditSoftwareContext = createContext<EditSoftwareContextProps>({
  state: initialState,
  dispatch: ()=>{}
})

export function EditSoftwareProvider(props: any) {
  const [state, dispatch] = useReducer(editSoftwareReducer, props?.state ?? initialState)

  // console.group('EditSoftwareProvider')
  // console.log('props...', props)
  // console.log('state...', state)
  // console.groupEnd()

  useEffect(() => {
    // The software context is used on dynamic edit software page.
    // Basic software information is loaded server side on each change
    // of dynamic page. NOTE! useReducer state runs in a different context
    // AND takes only initial props.state value. In order to ensure newest state
    // loaded server side is passed into context we need to update the context state
    // using dispatch/reducer functions.
    if (props?.state && props.state.pageIndex) {
      if (props.state.pageIndex !== state?.pageIndex) {
        // debugger
        dispatch({
          type: EditSoftwareActionType.UPDATE_STATE,
          payload: props.state
        })
      }
    }
  },[props?.state, state?.pageIndex])

  return (
    <EditSoftwareContext.Provider value={{
      state,
      dispatch
    }}
    {...props}
    />
  )
}


// const EditSoftwareContext = createContext(undefined)
export default EditSoftwareContext
