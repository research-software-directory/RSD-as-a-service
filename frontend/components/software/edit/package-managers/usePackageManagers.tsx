// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {
  NewPackageManager, PackageManager, deletePackageManager,
  getPackageManagersForSoftware, patchPackageManager, patchPackageManagers, postPackageManager
} from './apiPackageManager'

export default function usePackageManagers({token, software}: {token: string, software: string}) {
  const {showErrorMessage} = useSnackbar()
  const [managers,setManagers]=useState<PackageManager[]>([])
  const [loading,setLoading]=useState(true)

  const getManagers = useCallback(async () => {
    setLoading(true)
    const managers = await getPackageManagersForSoftware({
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

  async function addManager(data: NewPackageManager) {
    const resp = await postPackageManager({
      data,
      token
    })
    // debugger
    if (resp.status == 200) {
      // reload package managers
      await getManagers()
    } else {
      showErrorMessage(`Failed to save ${data.url}. ${resp.message}`)
    }
  }

  async function updateManager(data: PackageManager) {
    // update only following props
    const patchData = {
      package_manager: data.package_manager,
      download_count_scraping_disabled_reason: data.download_count_scraping_disabled_reason,
      reverse_dependency_count_scraping_disabled_reason: data.reverse_dependency_count_scraping_disabled_reason
    }
    const resp = await patchPackageManager({
      id: data.id,
      data: patchData,
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
    const resp = await deletePackageManager({
      id,
      token
    })
    if (resp.status == 200) {
      await getManagers()
    }else{
      showErrorMessage(`Failed to remove item. ${resp.message}`)
    }
  }

  async function sortManagers(items: PackageManager[]) {
    // copy old items order
    const previousState = {...managers}
    // visually confirm position change
    setManagers(items)
    // make all request
    const resp = await patchPackageManagers({
      items,
      token
    })
    if (resp.status != 200) {
      // revert back in case of error
      setManagers(previousState)
      showErrorMessage(`Failed to sort items. ${resp.message}`)
    }
  }

  return {
    managers,
    loading,
    addManager,
    updateManager,
    sortManagers,
    deleteManager
  }
}
