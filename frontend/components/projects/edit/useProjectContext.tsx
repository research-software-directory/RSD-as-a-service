// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useContext} from 'react'

import editProjectContext, {ProjectInfo} from './editProjectContext'
import {EditProjectActionType} from './editProjectReducer'
import {EditProjectStep} from './editProjectSteps'

export default function useProjectContext() {
  const {state, dispatch} = useContext(editProjectContext)

  const setProjectInfo = useCallback((project: ProjectInfo)=>{
    dispatch({
      type: EditProjectActionType.SET_PROJECT_INFO,
      payload: project
    })
  },[dispatch])

  const setEditStep = useCallback((step: EditProjectStep)=>{
    dispatch({
      type: EditProjectActionType.SET_EDIT_STEP,
      payload: step
    })
  },[dispatch])

  const setLoading = useCallback((loading: boolean)=>{
    dispatch({
      type: EditProjectActionType.SET_LOADING,
      payload: loading
    })
  }, [dispatch])

  const setProjectSlug = useCallback((slug: string) => {
    dispatch({
      type: EditProjectActionType.SET_PROJECT_SLUG,
      payload: slug
    })
  }, [dispatch])

  const setProjectTitle = useCallback((title: string) => {
    dispatch({
      type: EditProjectActionType.SET_PROJECT_TITLE,
      payload: title
    })
  },[dispatch])

  return {
    step: state.step,
    project: state.project,
    loading: state.loading,
    setProjectInfo,
    setProjectTitle,
    setProjectSlug,
    setEditStep,
    setLoading,
  }
}
