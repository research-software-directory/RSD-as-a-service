// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {BasicApiParams} from '~/utils/postgrestUrl'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {
  deletePackageManager, getPackageManagers,
  PackageManager, patchPackageManager
} from '~/components/software/edit/package-managers/apiPackageManager'

export default function useAdminPacMan() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find package manager by url')
  const [managers, setManagers] = useState<PackageManager[]>([])
  const [loading, setLoading] = useState(true)

  const getManagers = useCallback(async({page,rows,searchFor,token}:BasicApiParams)=>{
    const {count,managers} = await getPackageManagers({page,rows,searchFor,token})
    setManagers(managers)
    setCount(count)
    setLoading(false)
  // ignore setCount dependency but need other props to update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchFor,page,rows,token])

  useEffect(()=>{
    if (token){
      getManagers({page,rows,searchFor,token})
      // debugger
    }
  },[searchFor,page,rows,token,getManagers])


  async function updateManager({id,data}:{id:string,data:Partial<PackageManager>}){
    // patch package manager table
    const resp = await patchPackageManager({id,data,token})
    if (resp.status===200){
      // reload data
      getManagers({page,rows,searchFor,token})
    }else{
      showErrorMessage(`Failed to update: ${resp.message}`)
    }
  }

  async function deleteManager(id:string){
    // console.log('deletePacMan...',id)
    const resp = await deletePackageManager({id,token})
    if (resp.status===200){
      // reload data
      getManagers({page,rows,searchFor,token})
    }else{
      showErrorMessage(`Failed to remove: ${resp.message}`)
    }
  }

  return {
    loading,
    managers,
    updateManager,
    deleteManager
  }
}
