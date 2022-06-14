// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'

import editSoftwareContext, {SoftwareInfo,EditSoftwareActionType} from './editSoftwareContext'
import {EditSoftwarePageStep} from './editSoftwareSteps'

export default function useProjectContext() {
  const {pageState,dispatchPageState} = useContext(editSoftwareContext)

  function setSoftwareInfo(software: SoftwareInfo) {
    dispatchPageState({
      type: EditSoftwareActionType.SET_SOFTWARE_INFO,
      payload: software
    })
  }

  function setEditStep(step: EditSoftwarePageStep) {
    dispatchPageState({
      type: EditSoftwareActionType.SET_EDIT_STEP,
      payload: step
    })
  }

  function setLoading(loading: boolean) {
    dispatchPageState({
      type: EditSoftwareActionType.SET_LOADING,
      payload: loading
    })
  }

  return {
    step: pageState.step,
    software: pageState.software,
    loading: pageState.loading,
    setSoftwareInfo,
    setEditStep,
    setLoading
  }
}
