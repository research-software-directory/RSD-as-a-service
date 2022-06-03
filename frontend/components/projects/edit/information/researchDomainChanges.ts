// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {UseFormGetFieldState} from 'react-hook-form'
import {EditProject, ResearchDomainForProject} from '~/types/Project'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'

type ResearchDomainChanges = {
  project?: string
  formData: EditProject
  getFieldState: UseFormGetFieldState<EditProject>
  projectState?: EditProject
}

export type ResearchDomainsForSave = {
  add: ResearchDomainForProject[],
  delete: ResearchDomainForProject[]
}

export function getResearchDomainChanges(props: ResearchDomainChanges) {
  const {formData, projectState, project} = props
  const research_domains: ResearchDomainsForSave = {
    add: [],
    delete: []
  }
  if (formData.research_domains) {
    // we need to compare projectState and formData states
    // we cannot use isDirty to determine changed items
    // because we order fields and use replace to replace all items
    const toAdd = itemsNotInReferenceList({
      list: formData.research_domains ?? [],
      referenceList: projectState?.research_domains ?? [],
      key: 'key'
    })
    // debugger
    toAdd.forEach(item => {
      research_domains.add.push({
        project,
        research_domain: item.id
      })
    })
  }
  // find deleted items
  if (projectState?.research_domains && projectState?.research_domains.length > 0) {
    const toDelete = itemsNotInReferenceList({
      list: projectState?.research_domains,
      referenceList: formData.research_domains ?? [],
      key: 'key'
    })
    // debugger
    toDelete.forEach(item => {
      if (item.id && project) {
        research_domains.delete.push({
          project,
          research_domain: item.id
        })
      }
    })
  }

  return research_domains
}
