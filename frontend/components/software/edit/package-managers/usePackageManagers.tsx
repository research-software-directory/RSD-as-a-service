// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import {
  NewPackageManager, PackageManager, deletePackageManager,
  getPackageManagers, patchPackageManagers, postPackageManager
} from './apiPackageManager'

export default function usePackageManagers({token, software}: { token: string, software: string }) {
  const [managers,setManagers]=useState<PackageManager[]>([])
  const [loading,setLoading]=useState(true)

  const getManagers = useCallback(async () => {
    setLoading(true)
    const managers = await getPackageManagers({
      software,
      token
    })
    setManagers(managers)
    setLoading(false)
  },[software,token])


  useEffect(() => {
    if (token && software) {
      getManagers()
    }
  }, [token, software, getManagers])

  async function saveManager(data: NewPackageManager) {
    const resp = await postPackageManager({
      data,
      token
    })
    // debugger
    if (resp.status == 200) {
      // reload package managers
      await getManagers()
    }
    return resp
  }

  async function deleteManager(id: string) {
    if (id) {
      const resp = await deletePackageManager({
        id,
        token
      })
      if (resp.status !== 200) {
        return resp
      }

      await getManagers()
      return {
        status: 200,
        message: 'OK'
      }
    } else {
      return {
        status: 400,
        message: 'Id is missing'
      }
    }
  }

  async function sortManagers(items: PackageManager[]) {
    // visually confirm position change
    setManagers(items)
    // make all request
    const resp = await patchPackageManagers({
      items,
      token
    })
    if (resp.status !== 200) {
      // revert back in case of error
      setManagers(items)
    }
    // return response
    return resp
  }

  return {
    managers,
    loading,
    saveManager,
    sortManagers,
    deleteManager
  }
}
