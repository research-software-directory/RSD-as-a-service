// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useContext} from 'react'

import editSoftwareContext, {SoftwareInfo} from './editSoftwareContext'
import {EditSoftwareActionType} from './editSoftwareReducer'
import {EditSoftwarePageProps} from './editSoftwareSteps'

export default function useSoftwareContext() {
  const {state,dispatch} = useContext(editSoftwareContext)

  const setSoftwareInfo = useCallback((software: SoftwareInfo)=>{
    dispatch({
      type: EditSoftwareActionType.SET_SOFTWARE_INFO,
      payload: software
    })
  },[dispatch])

  const setEditStep = useCallback((step: EditSoftwarePageProps)=>{
    dispatch({
      type: EditSoftwareActionType.SET_EDIT_STEP,
      payload: step
    })
  },[dispatch])

  const setLoading = useCallback((loading: boolean)=>{
    dispatch({
      type: EditSoftwareActionType.SET_LOADING,
      payload: loading
    })
  },[dispatch])

  const setFormState = useCallback(({isDirty,isValid}:{isDirty:boolean,isValid:boolean})=>{
    dispatch({
      type: EditSoftwareActionType.UPDATE_STATE,
      payload: {
        isDirty,
        isValid,
      }
    })
  }, [dispatch])

  const setSoftwareSlug = useCallback((slug: string)=>{
    dispatch({
      type: EditSoftwareActionType.SET_SOFTWARE_SLUG,
      payload: slug
    })
  }, [dispatch])

  const setSoftwareTitle = useCallback((title: string)=>{
    dispatch({
      type: EditSoftwareActionType.SET_SOFTWARE_TITLE,
      payload: title
    })
  },[dispatch])

  return {
    ...state,
    setSoftwareInfo,
    setEditStep,
    setLoading,
    setFormState,
    setSoftwareSlug,
    setSoftwareTitle
  }
}
