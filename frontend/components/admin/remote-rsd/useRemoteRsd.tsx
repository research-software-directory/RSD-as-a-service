// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {
  addRemoteRsd, deleteRemoteRsdById, deleteRemoteSoftwareByRemoteRsdId,
  EditRemoteRsd, getRemoteRsd, patchRemoteRsd, RemoteRsd
} from './apiRemoteRsd'

export default function useRemoteRsd() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find remote by name or url')
  const [loading, setLoading] = useState(true)
  const [remoteRsd, setRemoteRsd] = useState<RemoteRsd[]>([])


  const loadRemoteRsd = useCallback(async()=>{
    const {remoteRsd,count} = await getRemoteRsd({
      token,
      searchFor,
      page,
      rows
    })
    setRemoteRsd(remoteRsd)
    setCount(count ?? 0)
    setLoading(false)
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token, searchFor, page, rows])

  useEffect(()=>{
    loadRemoteRsd()
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token, searchFor, page, rows])

  async function addRemote(data:EditRemoteRsd){
    // console.log('Implement...addRemoteRsd...',data)
    const newRemote={
      label: data.label,
      domain: data.domain,
      active: data.active,
      scrape_interval_minutes: data.scrape_interval_minutes
    }
    const resp = await addRemoteRsd({data:newRemote,token})
    // debugger
    if (resp.status!==200){
      showErrorMessage(`Failed to add remote RSD. ${resp.message}`)
      return false
    }else{
      loadRemoteRsd()
      return true
    }
  }

  async function patchRemote({id,data}:{id:string,data:Partial<EditRemoteRsd>}){
    // console.log('Implement...patchRemoteRsd...', data)
    const resp = await patchRemoteRsd({id,data,token})
    // debugger
    if (resp.status!==200){
      showErrorMessage(`Failed to update remote RSD. ${resp.message}`)
      return false
    }else{
      loadRemoteRsd()
      return true
    }
  }

  async function deleteRemote(id:string){
    // console.log('Implement...deleteRemoteRsd...', id)
    let resp
    // delete scraped software items first
    resp = await deleteRemoteSoftwareByRemoteRsdId({id,token})
    if (resp.status!==200){
      showErrorMessage(`Failed to delete remote RSD. ${resp.message}`)
      return false
    }
    // delete remote rsd entry
    resp = await deleteRemoteRsdById({id,token})
    if (resp.status!==200){
      showErrorMessage(`Failed to delete remote RSD. ${resp.message}`)
      return false
    }else{
      loadRemoteRsd()
      return true
    }
  }

  return {
    loading,
    remoteRsd,
    addRemote,
    patchRemote,
    deleteRemote
  }
}
