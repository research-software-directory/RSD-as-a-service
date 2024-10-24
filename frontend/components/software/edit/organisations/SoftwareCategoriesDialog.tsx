// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {EditOrganisation} from '~/types/Organisation'
import CategoriesDialog from '~/components/category/CategoriesDialog'
import useSoftwareCategories from './useSoftwareCategories'

export type OrganisationCategoriesDialogProps = Readonly<{
  softwareId: string
  organisation: EditOrganisation
  onCancel: () => void
  onComplete: () => void
  edit: boolean
}>

export default function SoftwareCategoriesDialog({
  softwareId,
  organisation,
  onCancel,
  onComplete,
  edit
}: OrganisationCategoriesDialogProps) {

  const {
    categories,selectedCategoryIds,
    state,error,
    saveOrganisationCategories
  } = useSoftwareCategories({
    organisationId:organisation.id,
    softwareId
  })

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
      title={edit ? 'Edit organisation categories' : 'Select organisation categories'}
      categories = {categories ?? []}
      selected = {selectedCategoryIds}
      state = {state}
      errorMsg = {error}
      noItemsMsg = {`No categories for ${organisation.name}`}
      onCancel = {onCancel}
      onSave = {(selected)=>{
        // pass onComplete to call when done
        saveOrganisationCategories(selected,onComplete)
      }}
    />
  )

}
