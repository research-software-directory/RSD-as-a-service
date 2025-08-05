// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {deleteImage} from '~/utils/editImage'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {deleteSoftwareById, getSoftwareItems, GetSoftwareListParams} from './apiAdminSoftware'

// always use this order for admin list: not published first and smaller update date (not updated recently)
const orderBy = 'is_published,updated_at,brand_name'

export function useAdminSoftware(){
  const {token} = useSession()
  const {showErrorMessage, showSuccessMessage} = useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find software by name, slug, keyword')
  const [software, setSoftware] = useState<SoftwareOverviewItemProps[]>([])
  const [loading, setLoading] = useState(true)

  const getSoftware = useCallback(async({searchFor,page,rows,token}:GetSoftwareListParams)=>{
    const resp = await getSoftwareItems({
      searchFor,page,rows,orderBy,token
    })
    // set record count
    setCount(resp?.count ?? 0)
    // set software items
    setSoftware(resp.data)
    // set loaded done
    setLoading(false)
    // debugger
  // exclude setCount to avoid endless loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchFor,page,rows,token])

  const deleteSoftware = useCallback(async(software:SoftwareOverviewItemProps)=>{
    if (token){
      const resp = await deleteSoftwareById({
        id:software.id,
        token
      })
      // debugger
      if (resp.status!==200){
        showErrorMessage(`Failed to remove software item. ${resp.message}`)
      } else {
        // reload software to first page
        getSoftware({
          searchFor,
          orderBy,
          page,
          rows,
          token
        })
        // try to remove image
        if (software.image_id){
          deleteImage({
            id:software.image_id,
            token
          })
        }
        showSuccessMessage(`${software.brand_name} deleted from RSD`)
      }
    }else{
      showErrorMessage('Failed to remove software item. You need to login first')
    }
  // ignore showErrorMessage dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchFor,page,rows,token])

  useEffect(()=>{
    if (token){
      getSoftware({searchFor,page,rows,token})
    }
  },[searchFor,page,rows,token,getSoftware])

  return {
    page,
    software,
    loading,
    deleteSoftware
  }
}
