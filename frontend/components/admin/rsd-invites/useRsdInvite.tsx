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

  const createInvite = useCallback((invite:NewAccountInvite)=>{
    createRsdInvite({invite,token})
      .then((resp)=>{
        if (resp.status===201){
          getInvites()
        }else{
          showErrorMessage(`Failed to create invite. ${resp.message}`)
        }
      })
      .catch(e=>{
        showErrorMessage(`Failed to create invite. ${e.message}`)
      })
  },[token,getInvites,showErrorMessage])

  const deleteInvite = useCallback(async({id}:{id:string})=>{
    const resp = await deleteRsdInvite({id,token})

    if (resp.status!==200){
      showErrorMessage(`Failed to delete invite. ${resp.message}`)
    }else{
      getInvites()
    }

  },[token,getInvites,showErrorMessage])

  useEffect(()=>{

    if (token) getInvites()
  },[token,getInvites])

  return {
    loading,
    activeInvites,
    getInvites,
    createInvite,
    deleteInvite,
  }
}
