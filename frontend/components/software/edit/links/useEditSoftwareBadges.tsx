// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useCallback} from 'react'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {BadgeForSoftware, EditSoftwareItem} from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {
  addBadgeForSoftware,
  deleteBadge,
  getBadgesForSoftware,
  updateBadgeContent,
  updateBadgePosition
} from '~/components/software/apiSoftware'
import {EditBadgeFields} from './EditSoftwareBadgeModal'


export function useEditSoftwareBadges(){
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {setValue, watch} = useFormContext<EditSoftwareItem>()
  const [modal, setModal] = useState<{
    open: boolean,
    data?: BadgeForSoftware
  }> ({
    open: false
  })

  const [softwareId, badges] = watch(['id', 'badges'])

  const urlsPresent = new Set<string>()
  badges.forEach(badge => urlsPresent.add(badge.badge_url))

  const openEditBadgeModal = useCallback((badge?: BadgeForSoftware)=>{
    setModal({open: true, data: badge})
  },[])

  const closeEditBadgeModal = useCallback(()=>{
    setModal({open: false})
  },[])

  const getBadges = useCallback(()=>{
    getBadgesForSoftware(softwareId, token)
      .then(updatedBadges => setValue('badges', updatedBadges))
      .catch(e => showErrorMessage(e.message))

  },[softwareId,token,setValue,showErrorMessage])

  const handleSortedBadges = useCallback((sortedBadges: BadgeForSoftware[])=>{
    // optimistically update position locally
    setValue('badges', sortedBadges)

    const promises = []
    for (const badge of sortedBadges) {
      promises.push(updateBadgePosition(token, badge.id, badge.position))
    }

    Promise.all(promises)
      .catch(e => {
        showErrorMessage(e.message)
        // reload current situation
        getBadges()
      })

  },[token,setValue,getBadges,showErrorMessage])

  const handleDeleteBadge = useCallback((badgeId: string)=>{
    deleteBadge(token, badgeId)
      .then(() => {
        // max speed delete and renumber positions
        const newBadgesArray = []
        for (let i = 0; i < badges.length; i++) {
          const badge = badges[i]
          if (badge.id !== badgeId){
            newBadgesArray.push({
              ...badge,
              position:i + 1
            })
          }
        }
        handleSortedBadges(newBadgesArray)
      })
      .catch(e => showErrorMessage(e.message))
  },[token,badges,handleSortedBadges,showErrorMessage])

  const handleOnSaveBadge = useCallback(async({badgeId, badgeUrl, badgeLink, altText}: EditBadgeFields)=>{
    try{
      if (badgeId!==null && softwareId){
        await updateBadgeContent(
          token,{
            badgeId,
            badgeUrl,
            altText,
            badgeLink,
          })
      }else if (softwareId){
        await addBadgeForSoftware(token,{
          softwareId,
          badgeUrl,
          altText,
          badgeLink,
          position: badges.length + 1
        })
      }
      // reload badges list
      getBadges()
    }catch(e:any){
      showErrorMessage(e?.message ?? 'Unexpected error')
    }finally{
      // close modal
      setModal({open:false})
    }
  },[softwareId,token,badges,getBadges,showErrorMessage])

  return {
    badges,
    urlsPresent,
    modal,
    openEditBadgeModal,
    closeEditBadgeModal,
    handleSortedBadges,
    handleDeleteBadge,
    handleOnSaveBadge
  }
}
