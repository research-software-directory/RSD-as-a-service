// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {ProjectListItem} from '~/types/Project'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {deleteImage} from '~/utils/editImage'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {deleteProjectById, getProjectItems, GetProjectListParams} from './apiAdminProjects'

// always use this order for admin list: not published first and smaller update date (not updated recently)
const orderBy = 'is_published,updated_at,title'

export default function useAdminProjects(){
  const {token} = useSession()
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find project by title or slug')
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [loading, setLoading] = useState(true)

  const getProjects = useCallback(async({searchFor,page,rows,token}:GetProjectListParams)=>{
    const resp = await getProjectItems({
      searchFor,page,rows,orderBy,token
    })
    // set record count
    setCount(resp?.count ?? 0)
    // set software items
    setProjects(resp.data)
    // set loaded done
    setLoading(false)
    // debugger
  // exclude setCount to avoid endless loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchFor,page,rows,token])

  const deleteProject = useCallback(async(project:ProjectListItem)=>{
    if (token){
      const resp = await deleteProjectById({
        id:project.id,
        token
      })
      // debugger
      if (resp.status!==200){
        showErrorMessage(`Failed to remove project item. ${resp.message}`)
      } else {
        // reload software to first page
        getProjects({
          searchFor,
          orderBy,
          page,
          rows,
          token
        })
        // try to remove image
        if (project.image_id){
          deleteImage({
            id:project.image_id,
            token
          })
        }
      }
      showSuccessMessage(`${project.title} deleted from RSD`)
    }else{
      showErrorMessage('Failed to remove project. You need to login first')
    }
  // ignore showErrorMessage dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchFor,page,rows,token])

  useEffect(()=>{
    if (token){
      getProjects({searchFor,page,rows,token})
    }
  },[searchFor,page,rows,token,getProjects])

  return {
    page,
    projects,
    loading,
    deleteProject
  }
}
