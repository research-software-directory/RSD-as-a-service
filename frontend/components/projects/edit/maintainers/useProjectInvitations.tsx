// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth'
import {Invitation, deleteMaintainerLink, getUnusedInvitations} from '~/components/maintainers/apiMaintainers'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createMaintainerLink} from '~/utils/editProject'

export function useProjectInvitations({project}:{project?:string}) {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [unusedInvitations,setUnusedInvitations] = useState<Invitation[]>([])
  const [magicLink, setMagicLink] = useState(null)

  const loadUnusedInvitations = useCallback(()=>{
    // get unused invitation
    getUnusedInvitations({
      id: project ?? '',
      type: 'project',
      token
    }).then(items=>{
      // update
      setUnusedInvitations(items)
    }).catch(e=>{
      // update on error to empty array
      setUnusedInvitations([])
    })
  },[project,token])

  useEffect(()=>{
    let abort = false
    if (project && token){
      loadUnusedInvitations()
    }
    return ()=>{abort=true}
  },[project,token,loadUnusedInvitations])

  const createInvitation = useCallback(async()=>{
    if (project && user?.account){
      const resp = await createMaintainerLink({
        project,
        account:user?.account,
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
  },[project,user?.account,token,loadUnusedInvitations])

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
