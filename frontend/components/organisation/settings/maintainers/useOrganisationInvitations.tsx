// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {deleteMaintainerLink, getUnusedInvitations} from '~/components/maintainers/apiMaintainers'
import {Invitation} from '~/components/maintainers/InvitationList'
import {organisationMaintainerLink} from './apiOrganisationMaintainers'

export function useOrganisationInvitations({organisation}:{organisation?:string}) {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [unusedInvitations,setUnusedInvitations] = useState<Invitation[]>([])
  const [magicLink, setMagicLink] = useState(null)

  const loadUnusedInvitations = useCallback(()=>{
    // get unused invitation
    getUnusedInvitations({
      id: organisation ?? '',
      type: 'organisation',
      token
    }).then(items=>{
      // update
      setUnusedInvitations(items)
    }).catch(()=>{
      // update on error to empty array
      setUnusedInvitations([])
    })
  },[organisation,token])

  useEffect(()=>{
    let abort = false
    if (organisation && token && abort===false){
      loadUnusedInvitations()
    }
    return ()=>{abort=true}
  },[organisation,token,loadUnusedInvitations])

  const createInvitation = useCallback(async()=>{
    if (organisation && user?.account){
      const resp = await organisationMaintainerLink({
        organisation,
        account: user?.account,
        token
      })
      if (resp.status===201){
        // set magic link prop to new link
        setMagicLink(resp.message)
        // reload unused invitations
        loadUnusedInvitations()
      }else{
        showErrorMessage(`Failed to create invitation. ${resp.message}`)
      }
    }
  // IGNORE showErrorMessage dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[organisation,user?.account,token,loadUnusedInvitations])

  const deleteInvitation = useCallback(async(invitation:Invitation)=>{
    const resp = await deleteMaintainerLink({
      invitation,
      token
    })
    if (resp.status===200){
      loadUnusedInvitations()
    }else{
      showErrorMessage(`Failed to delete invitation. ${resp.message}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,loadUnusedInvitations])

  return {
    magicLink,
    unusedInvitations,
    deleteInvitation,
    createInvitation
  }
}
