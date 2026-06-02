// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {Invitation, InvitationType} from '~/components/maintainers/InvitationList'
import {createRsdInvite, deleteRsdInvite, getRsdInvites, NewAccountInvite} from './apiRsdInvite'

export function useRsdInvite(){
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [activeInvites, setActiveInvites] = useState<Invitation[]>([])
  // a11y feedback notifier state for dynamic list actions
  const [notification, setNotification] = useState('')

  const getInvites = useCallback(()=>{
    setLoading(true)

    getRsdInvites({token})
      .then(items=>{
        const invitations:Invitation[] = items.map(item=>{
          return {
            id: item.id,
            created_at: item.created_at,
            expires_at: item.expires_at,
            type: 'rsd' as InvitationType,
            uses_left: item.uses_left,
            comment: item.comment
          }
        })
        setActiveInvites(invitations)
      })
      .catch(()=>setActiveInvites([]))
      .finally(()=>setLoading(false))

  },[token])

  const createInvite = useCallback(async(invite:NewAccountInvite)=>{
    const resp = await createRsdInvite({invite,token})

    if (resp.status===201){
      setNotification('New invitation link successfully generated and added to the list.')
      getInvites()
    }else{
      showErrorMessage(`Failed to create invite. ${resp.message}`)
      setNotification('Failed to generate invitation link. Please try again.')
    }

  },[token,getInvites,showErrorMessage])

  const deleteInvite = useCallback(async({id}:{id:string})=>{
    const resp = await deleteRsdInvite({id,token})

    if (resp.status!==200){
      setNotification('Failed to delete invitation link.')
      showErrorMessage(`Failed to delete invite. ${resp.message}`)
    }else{
      setNotification('Invitation link successfully deleted.')
      getInvites()
    }

  },[token,getInvites,showErrorMessage])

  useEffect(()=>{
    if (token) getInvites()
  },[token,getInvites])

  return {
    loading,
    activeInvites,
    notification,
    getInvites,
    createInvite,
    deleteInvite,
  }
}
