// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {deleteMaintainerLink, getUnusedInvitations} from '~/components/maintainers/apiMaintainers'
import {Invitation} from '~/components/maintainers/InvitationList'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createMaintainerLink} from '~/components/projects/edit/apiEditProject'

export function useProjectInvitations({project}:{project?:string}) {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [unusedInvitations,setUnusedInvitations] = useState<Invitation[]>([])
  const [magicLink, setMagicLink] = useState(null)
  // a11y feedback notifier state for dynamic list actions
  const [notification, setNotification] = useState('')

  const loadUnusedInvitations = useCallback(()=>{
    // get unused invitation
    getUnusedInvitations({
      id: project ?? '',
      type: 'project',
      token
    }).then(items=>{
      // update
      setUnusedInvitations(items)
    }).catch(()=>{
      // update on error to empty array
      setUnusedInvitations([])
    })
  },[project,token])

  useEffect(()=>{
    let abort = false
    if (project && token && abort===false){
      loadUnusedInvitations()
    }
    return ()=>{abort=true}
  },[project,token,loadUnusedInvitations])

  const createInvitation = useCallback(async()=>{
    if (project && user?.account){
      setNotification('Generating new invitation link...')
      const resp = await createMaintainerLink({
        project,
        account:user?.account,
        token
      })
      if (resp.status===201){
        // set magic link prop to new link
        setMagicLink(resp.message)
        // update notification
        setNotification('New invitation link successfully generated and added to the list.')
        // reload unused invitations
        loadUnusedInvitations()
      }else{
        showErrorMessage(`Failed to create invitation. ${resp.message}`)
        setNotification('Failed to generate invitation link. Please try again.')
      }
    }
  // IGNORE showErrorMessage dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project,user?.account,token,loadUnusedInvitations])

  const deleteInvitation = useCallback(async(invitation:Invitation)=>{
    setNotification('Deleting invitation link...')
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
    magicLink,
    unusedInvitations,
    notification,
    deleteInvitation,
    createInvitation
  }
}
