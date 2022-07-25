// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {UseFieldArrayUpdate} from 'react-hook-form'
import {FundingOrganisation} from '~/types/Organisation'
import {EditProject} from '~/types/Project'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'

type DeleteOrganisation = {
  project: string,
  organisation: string
}

type FundingOrganisationChanges = {
  updateOrganisation: UseFieldArrayUpdate<EditProject, 'funding_organisations'>,
  formData: EditProject,
  previousState?: EditProject
}

export type FundingOrganisationsForSave = {
  create: FundingOrganisation[]
  add: FundingOrganisation[]
  delete: DeleteOrganisation[]
  updateOrganisation: UseFieldArrayUpdate<EditProject, 'funding_organisations'>
}

export function getFundingOrganisationChanges(props: FundingOrganisationChanges) {
  // destructure
  const {updateOrganisation, formData, previousState} = props
  // funding organisations
  const fundingOrganisations: FundingOrganisationsForSave = {
    create: [],
    add: [],
    delete: [],
    updateOrganisation
  }

  function classifyOrganisations(addOrganisations: FundingOrganisation[]) {
    addOrganisations.forEach((item) => {
      if (item.id) {
        // funding organisation from RSD have id and should be only added to project
        fundingOrganisations.add.push(item)
      } else {
        // funding organisations without id are not present in RSD
        // and should be created in RSD and added to project
        fundingOrganisations.create.push(item)
      }
    })
  }
  // console.group('fundingOrganisationsChanges.getFundingOrganisationChanges')
  const addOrganisations = itemsNotInReferenceList({
    list: formData.funding_organisations,
    referenceList: previousState?.funding_organisations ?? [],
    key: 'name'
  })
  // console.log('addOrganisations...', addOrganisations)
  classifyOrganisations(addOrganisations)

  const removeOrganisations = itemsNotInReferenceList({
    list: previousState?.funding_organisations ?? [],
    referenceList: formData.funding_organisations,
    key: 'name'
  })
  // console.log('removeOrganisations...', removeOrganisations)
  removeOrganisations.forEach(item => {
    if (item.id) {
      fundingOrganisations.delete.push({
        project: formData.id,
        organisation: item.id
      })
    }
  })
  // console.log('fundingOrganisations...', fundingOrganisations)
  // console.groupEnd()
  return fundingOrganisations
}
