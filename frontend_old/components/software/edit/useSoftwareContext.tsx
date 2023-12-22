// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useContext} from 'react'

import editSoftwareContext, {SoftwareInfo} from './editSoftwareContext'
import {EditSoftwareActionType} from './editSoftwareReducer'

export default function useSoftwareContext() {
  const {state,dispatch} = useContext(editSoftwareContext)

  // console.group('useSoftwareContext')
  // console.log('state...', state)
  // console.groupEnd()

  const setSoftwareInfo = useCallback((software: SoftwareInfo)=>{
    dispatch({
      type: EditSoftwareActionType.SET_SOFTWARE_INFO,
      payload: software
    })
  },[dispatch])

  const setEditPage = useCallback((pageIndex: number)=>{
    dispatch({
      type: EditSoftwareActionType.SET_EDIT_PAGE_INDEX,
      payload: pageIndex
    })
  },[dispatch])

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
  }, [dispatch])

  const setConceptDoi = useCallback((doi: string)=>{
    dispatch({
      type: EditSoftwareActionType.SET_SOFTWARE_DOI,
      payload: doi
    })
  },[dispatch])

  return {
    ...state,
    setSoftwareInfo,
    setEditPage,
    setSoftwareSlug,
    setSoftwareTitle,
    setConceptDoi
  }
}
