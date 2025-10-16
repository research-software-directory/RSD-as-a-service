// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {deleteImage, upsertImage} from '~/utils/editImage'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {CommunityListProps, getCommunityList} from '~/components/communities/apiCommunities'
import {addCommunity as addCommunityToRsd, deleteCommunityById} from './apiCommunities'
import {EditCommunityProps} from './AddCommunityModal'

export function useAdminCommunities(){
  const {token} = useSession()
  const {showErrorMessage, showSuccessMessage} = useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find community by name')
  const [communities, setCommunities] = useState<CommunityListProps[]>([])
  const [loading, setLoading] = useState(true)

  const loadCommunities = useCallback(async() => {
    // setLoading(true)
    const {communities, count} = await getCommunityList({
      token,
      searchFor,
      page,
      rows
    })
    setCommunities(communities)
    setCount(count ?? 0)
    setLoading(false)
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchFor, page, rows])

  useEffect(() => {
    if (token) {
      loadCommunities()
    }
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token,searchFor,page,rows])

  const addCommunity = useCallback(async(data:EditCommunityProps)=>{
    try{
      // UPLOAD LOGO
      if (data.logo_b64 && data.logo_mime_type) {
        // split base64 to use only encoded content
        const b64data = data.logo_b64.split(',')[1]
        const upload = await upsertImage({
          data: b64data,
          mime_type: data.logo_mime_type,
          token
        })
        // debugger
        if (upload.status === 201) {
          // update data values
          data.logo_id = upload.message
        } else {
          data.logo_id = null
          showErrorMessage(`Failed to upload image. ${upload.message}`)
          return [false, null]
        }
      }
      // remove temp props
      delete data?.logo_b64
      delete data?.logo_mime_type

      const resp = await addCommunityToRsd({
        data,
        token
      })

      if (resp.status === 200) {
        // return created item
        loadCommunities()
        return [true, resp.message['slug']]
      } else {
        // show error
        showErrorMessage(`Failed to add community. Error: ${resp.message}`)
        return [false, null]
      }
    }catch(e:any){
      showErrorMessage(`Failed to add community. Error: ${e.message}`)
      return [false, null]
    }
  // we do not include showErrorMessage in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,loadCommunities])

  const deleteCommunity = useCallback(async(id:string,logo_id:string|null)=>{
    // console.log('deleteCommunity...', item)
    const resp = await deleteCommunityById({id,token})
    if (resp.status!==200){
      showErrorMessage(`Failed to delete community. Error: ${resp.message}`)
    } else {
      // optionally try to delete logo
      // but not wait on response
      if (logo_id){
        await deleteImage({
          id: logo_id,
          token
        })
      }
      // reload list
      loadCommunities()
      // confirm deletion
      showSuccessMessage('Community deleted from RSD')
    }
  // we do not include showErrorMessage in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])

  return {
    loading,
    communities,
    addCommunity,
    deleteCommunity
  }
}
