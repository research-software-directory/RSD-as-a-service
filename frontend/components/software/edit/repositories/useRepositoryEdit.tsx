// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {
  addSoftwareRepository,
  deleteSoftwareRepository,
  EditRepositoryProps,
  getRepositoryInfoForSoftware,
  patchRepositoryUrl,
  RepositoryForSoftware,
  RepositoryUrl,
  saveRepositoryPositions
} from './apiRepositories'

export default function useRepositoryEdit(software_id:string) {
  const {token} = useSession()
  const {showErrorMessage,showWarningMessage} = useSnackbar()
  const [repositories, setRepositories] = useState<RepositoryForSoftware[]>([])
  const [loading, setLoading] = useState(true)

  // new repo props (minimal)
  const newRepo: EditRepositoryProps = {
    id: null,
    url: null,
    code_platform: null,
    scraping_disabled_reason: null,
    position: 1
  }

  const getRepositories = useCallback(async(software_id:string,token:string)=>{
    const repos = await getRepositoryInfoForSoftware(
      software_id,
      token
    )
    setRepositories(repos)
    setLoading(false)
  },[])

  useEffect(()=>{
    if (software_id && token){
      getRepositories(software_id,token)
    }
  },[software_id,token,getRepositories])

  async function addRepository({data}:{data:EditRepositoryProps}){
    // add software
    const resp = await addSoftwareRepository({
      software: software_id,
      position: data.position,
      data,
      token
    })
    // debugger
    if (resp.status===409){
      showWarningMessage('This repository is already added to this software')
    } else if (resp.status==200){
      // reload list
      getRepositories(software_id,token)
    }else{
      showErrorMessage(`Failed to add repository: ${resp.message}`)
    }
  }

  async function deleteRepository(id:string){
    // console.group('deleteRepository')
    // console.log('id...', id)
    // console.log('software_id...', software_id)
    // console.groupEnd()
    const resp = await deleteSoftwareRepository({
      software: software_id,
      repository_url: id,
      token
    })
    // debugger
    if (resp.status==200){
      // reload list
      getRepositories(software_id,token)
    }else{
      showErrorMessage(`Failed to delete repository: ${resp.message}`)
    }
  }

  async function sortRepositories(items:RepositoryForSoftware[]){
    // save old order
    const oldOrder = [
      ...repositories
    ]
    // show new order
    setRepositories(items)
    // save new positions
    const resp = await saveRepositoryPositions({items,token})
    // on error reverse to old order
    if (resp.status!=200){
      showErrorMessage(`Failed to save item positions: ${resp.message}`)
      // reverse to old order
      setRepositories(oldOrder)
    }
  }

  async function updateRepositoryUrl({id,data}:{id:string,data:Partial<RepositoryUrl>}){
    // update database
    const resp = await patchRepositoryUrl({id,data,token})
    if (resp.status===200){
      const newState = repositories.map(item=>{
        // update item locally
        if (item.id === id){
          return {
            ...item,
            ...data
          }
        }
        return item
      })
      setRepositories(newState)
    }else{
      showErrorMessage(`Operation failed: ${resp.message}`)
    }
  }

  return{
    loading,
    newRepo,
    repositories,
    addRepository,
    deleteRepository,
    sortRepositories,
    updateRepositoryUrl
  }
}
