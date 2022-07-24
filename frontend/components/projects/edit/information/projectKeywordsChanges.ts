// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {UseFieldArrayUpdate} from 'react-hook-form'
import {EditProject, KeywordForProject} from '~/types/Project'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'

type KeywordChanges = {
  updateKeyword: UseFieldArrayUpdate<EditProject, 'keywords'>
  formData: EditProject
  previousState?: EditProject
}

export type ProjectKeyword = {
  // UUID
  project: string,
  // UUID
  keyword: string
}

export type KeywordsForSave = {
  create: KeywordForProject[],
  add: KeywordForProject[],
  delete: ProjectKeyword[],
  updateKeyword: UseFieldArrayUpdate<EditProject, 'keywords'>
}

export function getKeywordChanges(props: KeywordChanges) {
  const {updateKeyword, formData, previousState} = props
  const keywords: KeywordsForSave = {
    create: [],
    add: [],
    delete: [],
    updateKeyword
  }
  function classifyKeywords(newKeywords: KeywordForProject[]) {
    newKeywords.forEach((item, pos) => {
      // split to new keywords we need to create
      if (item?.action === 'create') {
        // add item
        keywords.create.push(item)
      } else if (item.id) {
        // only items with id
        keywords.add.push(item)
      }
    })
  }
  // console.group('projectKeywordChanges.getKeywordChanges')
  const addKeywords = itemsNotInReferenceList({
    list: formData.keywords,
    referenceList: previousState?.keywords ?? [],
    key: 'keyword'
  })
  // console.log('addKeywords...', addKeywords)
  classifyKeywords(addKeywords)

  const removeKeywords = itemsNotInReferenceList({
    list: previousState?.keywords ?? [],
    referenceList: formData.keywords,
    key: 'keyword'
  })
  // console.log('removeKeywords...', removeKeywords)
  removeKeywords.forEach(item => {
    if (item.id) {
      keywords.delete.push({
        project: item.project,
        keyword: item.id
      })
    }
  })
  // console.log('keywords...', keywords)
  // console.groupEnd()
  return keywords
}
