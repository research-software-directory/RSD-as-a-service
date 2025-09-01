// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {deleteMaintainerLink, getUnusedInvitations} from '~/components/maintainers/apiMaintainers'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {Invitation} from '~/components/maintainers/InvitationList'
import {communityMaintainerLink} from './apiCommunityMaintainers'

export function useCommunityInvitations({community}:{community?:string}) {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [unusedInvitations,setUnusedInvitations] = useState<Invitation[]>([])
  const [magicLink, setMagicLink] = useState(null)

  const loadUnusedInvitations = useCallback(()=>{
    // get unused invitation
    getUnusedInvitations({
      id: community ?? '',
      type: 'community',
      token
    }).then(items=>{
      // update
      setUnusedInvitations(items)
    }).catch(()=>{
      // update on error to empty array
      setUnusedInvitations([])
    })
  },[community,token])

  useEffect(()=>{
    let abort = false
    if (community && token && abort===false){
      loadUnusedInvitations()
    }
    return ()=>{abort=true}
  },[community,token,loadUnusedInvitations])

  const createInvitation = useCallback(async()=>{
    if (community && user?.account){
      const resp = await communityMaintainerLink({
        community,
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
  },[community,user?.account,token,loadUnusedInvitations])

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
