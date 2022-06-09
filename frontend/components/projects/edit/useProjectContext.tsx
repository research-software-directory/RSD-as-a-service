// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'

import editProjectContext, {ProjectInfo} from './editProjectContext'
import {EditProjectActionType} from './editProjectReducer'
import {EditProjectStep} from './editProjectSteps'

export default function useProjectContext() {
  const {state,dispatch} = useContext(editProjectContext)

  function setProjectInfo(project: ProjectInfo) {
    dispatch({
      type: EditProjectActionType.SET_PROJECT_INFO,
      payload: project
    })
  }

  function setEditStep(step: EditProjectStep) {
    dispatch({
      type: EditProjectActionType.SET_EDIT_STEP,
      payload: step
    })
  }

  function setLoading(loading: boolean) {
    dispatch({
      type: EditProjectActionType.SET_LOADING,
      payload: loading
    })
  }

  return {
    step: state.step,
    project: state.project,
    loading: state.loading,
    setProjectInfo,
    setEditStep,
    setLoading
  }
}
