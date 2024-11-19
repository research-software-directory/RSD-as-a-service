// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import CategoriesDialog from '~/components/category/CategoriesDialog'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import useCommunityCategories from './useCommunityCategories'

export type OrganisationCategoriesDialogProps = Readonly<{
  softwareId: string
  community: CommunityListProps
  onCancel: () => void
  onComplete: () => void
  edit: boolean
}>

export default function CommunityCategoriesDialog({
  softwareId,
  community,
  onCancel,
  onComplete,
  edit
}: OrganisationCategoriesDialogProps) {

  const {
    categories,selectedCategoryIds,
    state,error,
    saveCommunityCategories
  } = useCommunityCategories({
    communityId:community.id,
    softwareId
  })

  // console.group('CategoriesDialog')
  // console.log('state...', state)
  // console.log('categories...', categories)
  // console.log('selectedCategoryIds...',selectedCategoryIds)
  // console.groupEnd()

  useEffect(()=>{
    // if there are no categories and not an edit "request"
    // we call onComplete immediately and don't show the modal
    // this "approach" is used to add RSD organisation
    // which does not have organisation categories defined
    if (state==='ready' && edit===false && categories?.length===0){
      onComplete()
    }
  },[state,edit,categories,onComplete])

  return (
    <CategoriesDialog
      title={edit ? 'Edit community categories' : 'Select community categories'}
      categories = {categories ?? []}
      selected = {selectedCategoryIds}
      state = {state}
      errorMsg = {error}
      noItemsMsg = {`No categories for ${community.name}`}
      onCancel = {onCancel}
      onSave = {(selected)=>{
        // pass onComplete to call when done
        saveCommunityCategories(selected,onComplete)
      }}
    />
  )

}
