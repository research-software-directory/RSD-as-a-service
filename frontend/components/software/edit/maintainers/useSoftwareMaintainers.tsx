// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {MaintainerProps, rawMaintainersToMaintainers} from '~/components/maintainers/apiMaintainers'
import {deleteMaintainerFromSoftware, getMaintainersOfSoftware} from './apiSoftwareMaintainers'

export function useSoftwareMaintainers({software}:{software: string}) {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [maintainers, setMaintainers] = useState<MaintainerProps[]>([])
  const [loading, setLoading] = useState(true)

  // console.group('useSoftwareMaintainers')
  // console.log('software...',software)
  // console.log('token...',token)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    async function getMaintainers() {
      setLoading(true)
      const raw_maintainers = await getMaintainersOfSoftware({
        software,
        token
      })
      const maintainers = rawMaintainersToMaintainers(raw_maintainers)
      if (abort) return null
      // update maintainers state
      setMaintainers(maintainers)
      // keep track what is loaded
      // setLoadedSoftware(software?.id ?? '')
      // update loading flag
      setLoading(false)
    }

    if (software && token) {
      getMaintainers()
    }
    return()=>{abort=true}
  },[software,token])

  async function deleteMaintainer(account?:string){
    if (account && software){
      const resp = await deleteMaintainerFromSoftware({
        maintainer: account,
        software,
        token
      })
      if (resp.status === 200) {
        // remove account
        const newMaintainersList = maintainers.filter(item=>item.account!==account)
        setMaintainers(newMaintainersList)
      } else {
        showErrorMessage(`Failed to remove maintainer. ${resp.message}`)
      }
    }
  }

  // last maintainer can be deleted only by rsd-admin
  if (maintainers?.length===1 && user?.role!=='rsd_admin'){
    // disable delete button on last maintainer
    maintainers[0].disableDelete = true
  }

  return {
    loading,
    maintainers,
    deleteMaintainer
  }
}
