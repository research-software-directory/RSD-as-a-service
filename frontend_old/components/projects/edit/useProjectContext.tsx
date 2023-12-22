// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useContext} from 'react'

import editProjectContext, {ProjectInfo} from './editProjectContext'
import {EditProjectActionType} from './editProjectReducer'

export default function useProjectContext() {
  const {state, dispatch} = useContext(editProjectContext)

  const setProjectInfo = useCallback((project: ProjectInfo)=>{
    dispatch({
      type: EditProjectActionType.SET_PROJECT_INFO,
      payload: project
    })
  },[dispatch])

  const setEditPage = useCallback((pageIndex: number)=>{
    dispatch({
      type: EditProjectActionType.SET_EDIT_PAGE_INDEX,
      payload: pageIndex
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
    ...state,
    setProjectInfo,
    setProjectTitle,
    setProjectSlug,
    setEditPage
  }
}
