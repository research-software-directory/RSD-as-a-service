// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useCallback, useContext} from 'react'

import editProjectContext, {EditProjectActionType, ProjectInfo} from './editProjectContext'

export default function useProjectContext() {
  const {state, dispatch} = useContext(editProjectContext)

  const setProjectInfo = useCallback((project: ProjectInfo)=>{
    dispatch({
      type: EditProjectActionType.SET_PROJECT_INFO,
      payload: project
    })
  },[dispatch])

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
    project: state,
    setProjectInfo,
    setProjectTitle,
    setProjectSlug
  }
}
