// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {deleteMaintainerLink, getUnusedInvitations} from '~/components/maintainers/apiMaintainers'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {Invitation} from '~/components/maintainers/InvitationList'
import {softwareMaintainerLink} from './apiSoftwareMaintainers'

export function useSoftwareInvitations({software}:{software?:string}) {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [unusedInvitations,setUnusedInvitations] = useState<Invitation[]>([])
  // a11y feedback notifier state for dynamic list actions
  const [notification, setNotification] = useState('')

  const loadUnusedInvitations = useCallback(()=>{
    // get unused invitation
    getUnusedInvitations({
      id: software ?? '',
      type: 'software',
      token
    }).then(items=>{
      // update
      setUnusedInvitations(items)
    }).catch(()=>{
      // update on error to empty array
      setUnusedInvitations([])
    })
  },[software,token])

  useEffect(()=>{
    let abort = false
    if (software && token && abort===false){
      loadUnusedInvitations()
    }
    return ()=>{abort=true}
  },[software,token,loadUnusedInvitations])

  const createInvitation = useCallback(async()=>{
    if (software && user?.account){
      const resp = await softwareMaintainerLink({
        software,
        account:user?.account,
        token
      })
      if (resp.status===201){
        // update notification
        setNotification('New invitation link successfully generated and added to the list.')
        // reload unused invitation list
        loadUnusedInvitations()
      }else{
        showErrorMessage(`Failed to create invitation. ${resp.message}`)
        setNotification('Failed to generate invitation link. Please try again.')
      }
    }
  // IGNORE showErrorMessage dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[software,user?.account,token,loadUnusedInvitations])

  const deleteInvitation = useCallback(async(invitation:Invitation)=>{
    const resp = await deleteMaintainerLink({
      invitation,
      token
    })
    if (resp.status===200){
      setNotification('Invitation link successfully deleted.')
      loadUnusedInvitations()
    }else{
      showErrorMessage(`Failed to delete invitation. ${resp.message}`)
      setNotification('Failed to delete invitation link.')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,loadUnusedInvitations])

  return {
    unusedInvitations,
    notification,
    deleteInvitation,
    createInvitation
  }
}
