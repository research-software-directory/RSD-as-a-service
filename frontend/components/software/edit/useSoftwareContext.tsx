// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'

import editSoftwareContext, {SoftwareInfo} from './editSoftwareContext'
import {EditSoftwareActionType} from './editSoftwareReducer'
import {EditSoftwarePageProps} from './editSoftwareSteps'

export default function useSoftwareContext() {
  const {state,dispatch} = useContext(editSoftwareContext)

  function setSoftwareInfo(software: SoftwareInfo) {
    dispatch({
      type: EditSoftwareActionType.SET_SOFTWARE_INFO,
      payload: software
    })
  }

  function setEditStep(step: EditSoftwarePageProps) {
    dispatch({
      type: EditSoftwareActionType.SET_EDIT_STEP,
      payload: step
    })
  }

  function setLoading(loading: boolean) {
    dispatch({
      type: EditSoftwareActionType.SET_LOADING,
      payload: loading
    })
  }

  function setFormState({isDirty,isValid}:{isDirty:boolean,isValid:boolean}) {
    dispatch({
      type: EditSoftwareActionType.UPDATE_STATE,
      payload: {
        isDirty,
        isValid,
      }
    })
  }

  return {
    ...state,
    setSoftwareInfo,
    setEditStep,
    setLoading,
    setFormState
  }
}
