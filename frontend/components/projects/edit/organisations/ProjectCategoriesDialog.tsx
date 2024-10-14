// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {EditOrganisation} from '~/types/Organisation'
import CategoriesDialog from '~/components/category/CategoriesDialog'
import useProjectCategories from './useProjectCategories'

export type OrganisationCategoriesDialogProps = Readonly<{
  projectId: string
  organisation: EditOrganisation
  onCancel: () => void
  onComplete: () => void
  edit: boolean
}>

export default function ProjectCategoriesDialog({
  projectId, organisation, edit,
  onCancel, onComplete
}: OrganisationCategoriesDialogProps) {

  const {
    categories,selectedIds,
    state,error,
    saveOrganisationCategories
  } = useProjectCategories({
    organisationId:organisation.id,
    projectId
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
      selected = {selectedIds}
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
