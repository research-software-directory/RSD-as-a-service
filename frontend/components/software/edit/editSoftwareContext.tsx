// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useReducer} from 'react'

import {editSoftwarePage, EditSoftwarePageProps} from './editSoftwareSteps'
import {EditSoftwareAction, editSoftwareReducer} from './editSoftwareReducer'

export type SoftwareInfo = {
  id: string | null,
  slug: string | null,
  brand_name: string | null,
  concept_doi: string | null,
}

export type EditSoftwareState = {
  step: EditSoftwarePageProps
  software: SoftwareInfo
  isDirty: boolean
  isValid: boolean
  loading: boolean
}

export const initialState = {
  step: editSoftwarePage[0],
  software: {
    id: '',
    slug: '',
    brand_name:'',
    concept_doi: '',
  },
  isDirty: false,
  isValid: true,
  loading: true
}

export type EditSoftwareContextProps = {
  state: EditSoftwareState,
  dispatch: (action:EditSoftwareAction) => void
}

const EditSoftwareContext = createContext<EditSoftwareContextProps>({
  state: initialState,
  dispatch: (action)=>{}
})

export function EditSoftwareProvider(props: any) {
  const [state, dispatch] = useReducer(editSoftwareReducer, props?.state ?? initialState)

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
