// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {MaintainerProps, rawMaintainersToMaintainers} from '~/components/maintainers/apiMaintainers'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {
  deleteMaintainerFromOrganisation,
  getMaintainersOfOrganisation
} from './apiOrganisationMaintainers'


export function useOrganisationMaintainers({organisation}:{organisation: string}) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [maintainers, setMaintainers] = useState<MaintainerProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function getMaintainers() {
      setLoading(true)
      const raw_maintainers = await getMaintainersOfOrganisation({
        organisation,
        token
      })
      const maintainers = rawMaintainersToMaintainers(raw_maintainers)
      if (abort) return null
      // update maintainers state
      setMaintainers(maintainers)
      // update loading flag
      setLoading(false)
    }
    if (organisation && token) {
      getMaintainers()
    } else if (token==='') {
      setLoading(false)
    }
    return ()=>{abort=true}
  }, [organisation,token])


  async function deleteMaintainer(account?:string) {
    // console.log('delete maintainer...pos...', pos)
    if (account && organisation) {
      const resp = await deleteMaintainerFromOrganisation({
        maintainer: account,
        organisation,
        token
      })
      if (resp.status === 200) {
        // remove account
        const newMaintainersList = maintainers.filter(item=>item.account!==account)
        setMaintainers(newMaintainersList)
        // setMaintainers(newMaintainersList)
      } else {
        showErrorMessage(`Failed to remove maintainer. ${resp.message}`)
      }
    }
  }

  return {
    loading,
    maintainers,
    deleteMaintainer
  }
}
