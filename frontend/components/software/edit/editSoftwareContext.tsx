// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useReducer} from 'react'

import {editSoftwarePage, EditSoftwarePageProps} from './editSoftwarePages'
import {EditSoftwareAction, editSoftwareReducer} from './editSoftwareReducer'

export type SoftwareInfo = {
  id: string,
  slug: string,
  brand_name: string,
  concept_doi: string | null,
}

export type EditSoftwareState = {
  page: EditSoftwarePageProps
  software: SoftwareInfo
}

export const initialState = {
  page: editSoftwarePage[0],
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
