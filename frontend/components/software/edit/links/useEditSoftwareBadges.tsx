// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useCallback} from 'react'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {BadgeForSoftware, EditSoftwareItem} from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {addBadgeForSoftware, deleteBadge, getBadgesForSoftware, updateBadgeContent, updateBadgePosition} from '~/components/software/apiSoftware'
import {NewBadgeFields} from './EditSoftwareBadgeModal'

export function useEditSoftwareBadges() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {setValue,watch} = useFormContext<EditSoftwareItem>()
  const [modal, setModal] = useState<{
    open: boolean,
    data?: NewBadgeFields
  }>({
    open: false
  })

  // monitor data from react-hook-form context
  const [softwareId,badges] = watch(['id','badges'])

  // derived state: memoized to avoid reconstruction on unrelated changes
  // const urlsPresent = useMemo(() => new Set(badges.map(b => b.badge_url)), [badges])
  const urlsPresent = new Set(badges.map(b => b.badge_url))

  // use this method to open modal and pass badge data (optional)
  const openEditBadgeModal = useCallback((badge?: BadgeForSoftware) => {
    console.group('openEditBadgeModal')
    console.log('badge...',badge)
    console.groupEnd()
    setModal({
      open:true,
      data: {
        // new item will have null values
        badgeId: badge?.id ?? null,
        badgeUrl: badge?.badge_url ?? null,
        badgeLink: badge?.link_url ?? null
      }
    })
  }, [])

  // use this method to close modal
  const closeEditBadgeModal = useCallback(() => {
    setModal({open:false})
  }, [])

  // NOTE: this method is refactored in getBadges()
  // const handleNewBadgeAdded = useCallback(() => {
  //   getBadgesForSoftware(softwareId, token)
  //     .then(updatedBadges => setValue('badges', updatedBadges))
  //     .catch(e => showErrorMessage(e.message))
  //     .finally(() => setModal({open:false}))
  // }, [softwareId, token, setValue])

  // use this method to load/reload badges
  const getBadges = useCallback(() => {
    getBadgesForSoftware(softwareId, token)
      .then(updatedBadges => setValue('badges', updatedBadges))
      .catch(e => showErrorMessage(e.message))
      // .finally(() => setModal({open:false}))
  }, [softwareId, token, setValue])
  // this method patches the position of all badges
  const handleSortedBadges = useCallback((sortedBadges: BadgeForSoftware[]) => {
    // optimistically update react-hook-form context
    setValue('badges', sortedBadges)
    // generate patch calls
    const promises = sortedBadges.map(b => updateBadgePosition(token, b.id, b.position))
    // execute all pathes
    Promise.allSettled(promises).then((results) => {
      const errors = results.filter(r => r.status === 'rejected')
      if (errors.length > 0) {
        showErrorMessage('Failed to save some positions.')
        //reload current situation
        getBadges()
      }
    })
  }, [token, badges, setValue])

  const handleDeleteBadge = useCallback((badgeId: string) => {
    deleteBadge(token, badgeId)
      .then(() => {
        const newBadgesArray = badges
          .filter(b => b.id !== badgeId)
          // .map((b, index) => ({...b, position: index + 1}))
          // handleSortedBadges(newBadgesArray)
        setValue('badges',newBadgesArray)
      })
      .catch(e => showErrorMessage(e.message))
  }, [token, setValue])

  const handleOnSaveBadge = useCallback(async(badge:NewBadgeFields) => {
    console.group('handleOnSave')
    console.log('badge...',badge)
    console.groupEnd()

    try{
      if (badge.badgeId!==null && softwareId){
        // update badge
        await updateBadgeContent(token, badge.badgeId, badge.badgeUrl as string, badge.badgeLink)
      }else if (softwareId){
        // create new badge
        await addBadgeForSoftware(token, {
          software: softwareId,
          badge_url: badge.badgeUrl as string,
          link_url: badge.badgeLink,
          position: badges.length + 1,
        })
      }
      // reload
      getBadges()
      // close modal
      setModal({open:false})
    }catch(e:any){
      // this catch is reached when you throw error
      showErrorMessage(e.message)
    }
  },[token,softwareId,badges])

  return {
    softwareId,
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
