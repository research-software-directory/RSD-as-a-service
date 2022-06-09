// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {UseFieldArrayUpdate, UseFormGetFieldState} from 'react-hook-form'
import {SearchOrganisation} from '~/types/Organisation'
import {EditProject, OrganisationsOfProject} from '~/types/Project'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'

type DeleteOrganisation = {
  project: string,
  organisation: string
}

type FundingOrganisationChanges = {
  updateOrganisation: UseFieldArrayUpdate<EditProject, 'funding_organisations'>,
  formData: EditProject,
  getFieldState: UseFormGetFieldState<EditProject>,
  projectState?: EditProject
}

export type CreateOrganisation = SearchOrganisation & {
  // used to update id of the form item
  pos: number
}

export type FundingOrganisationsForSave = {
  create: CreateOrganisation[]
  add: SearchOrganisation[]
  delete: DeleteOrganisation[]
  updateOrganisation: UseFieldArrayUpdate<EditProject, 'funding_organisations'>
}

export function getFundingOrganisationChanges(props: FundingOrganisationChanges) {
  // destructure
  const {updateOrganisation, formData, getFieldState, projectState} = props
  // funding organisations
  const fundingOrganisations: FundingOrganisationsForSave = {
    create: [],
    add: [],
    delete: [],
    updateOrganisation
  }

  // set status to existing items
  formData.funding_organisations.forEach((item, pos) => {
    const name = getFieldState(`funding_organisations.${pos}.name`)
    // using only "dirty" items, because dirty items
    // are the items that are new/changed since last save (form reset)
    if (name.isDirty === true) {
      if ((item as SearchOrganisation).source && (item as SearchOrganisation).source === 'RSD') {
        // funding organisation from RSD should be added to project
        fundingOrganisations.add.push(item as SearchOrganisation)
      } else if (item.hasOwnProperty('source') === true) {
        // funding organisations added from search and not present in RSD should be created in RSD
        fundingOrganisations.create.push({
          ...item as SearchOrganisation,
          pos
        })
      }
    }
  })

  // find deleted items
  if (projectState?.funding_organisations &&
    projectState?.funding_organisations.length > 0) {
    // extract items to delete
    const toDelete = itemsNotInReferenceList<OrganisationsOfProject | SearchOrganisation>({
      list: projectState?.funding_organisations,
      referenceList: formData.funding_organisations,
      key: 'id'
    })
    // add delete items to links collection
    // for deletion we only need id's stored in uuid prop
    toDelete.forEach(item => {
      if (item.id) fundingOrganisations.delete.push({
        project: projectState.id,
        organisation: item.id
      })
    })
  }
  // return object with all changes
  return fundingOrganisations
}
