// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {BasicApiParams} from '~/utils/postgrestUrl'
import {RepositoryUrl} from '~/components/software/edit/repositories/apiRepositories'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {deleteRepository, getRepositoryUrl, patchRepositoryTable} from './apiAdminRepo'

export default function useAdminRepos() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find repository by url')
  const [loading, setLoading] = useState(true)
  const [repositories, setRepositories] = useState<RepositoryUrl[]>([])

  const getRepositories = useCallback(async({page,rows,searchFor,token}:BasicApiParams)=>{
    const {count,repositories} = await getRepositoryUrl({page,rows,searchFor,token})
    setRepositories(repositories)
    setCount(count)
    setLoading(false)
  // ignore setCount dependency but need other props to update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchFor,page,rows,token])

  useEffect(()=>{
    if (token){
      getRepositories({page,rows,searchFor,token})
      // debugger
    }
  },[searchFor,page,rows,token,getRepositories])

  // console.group('useAdminRepos')
  // console.log('loading...',loading)
  // console.log('token...',token)
  // console.log('searchFor...',searchFor)
  // console.log('page...',page)
  // console.log('rows...',rows)
  // console.groupEnd()

  async function updateRepo({id,data}:{
    id:string,data:Partial<RepositoryUrl>
  }){
    const resp = await patchRepositoryTable({
      id,
      data,
      token
    })
    if (resp.status==200){
      // reload list
      getRepositories({page,rows,searchFor,token})
    }else{
      showErrorMessage(`Failed to update repository: ${resp.message}`)
    }
  }

  async function deleteRepo(id:string){
    const resp = await deleteRepository(id,token)
    if (resp.status==200){
      // reload list
      getRepositories({page,rows,searchFor,token})
    }else{
      showErrorMessage(`Failed to remove repository: ${resp.message}`)
    }
  }

  return {
    repositories,
    loading,
    updateRepo,
    deleteRepo,
  }
}
