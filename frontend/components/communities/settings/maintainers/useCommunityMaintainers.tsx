// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {MaintainerProps, rawMaintainersToMaintainers} from '~/components/maintainers/apiMaintainers'
import {deleteMaintainerFromCommunity, getMaintainersOfCommunity} from './apiCommunityMaintainers'

export function useCommunityMaintainers({community}:{community?: string}) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [maintainers, setMaintainers] = useState<MaintainerProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function getMaintainers() {
      if (community && token) {
        setLoading(true)

        const raw_maintainers = await getMaintainersOfCommunity({
          community,
          token
        })
        const maintainers = rawMaintainersToMaintainers(raw_maintainers)

        if (abort) return null
        // update maintainers state
        setMaintainers(maintainers)
        // update loading flag
        setLoading(false)
      }
    }

    getMaintainers()

    return ()=>{abort=true}
  }, [community,token])

  async function deleteMaintainer(account?: string) {
    // console.log('delete maintainer...pos...', pos)
    if (account && community) {
      const resp = await deleteMaintainerFromCommunity({
        maintainer: account,
        community,
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

  return {
    loading,
    maintainers,
    deleteMaintainer
  }
}
